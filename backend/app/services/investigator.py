import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re

class WebsiteInvestigator:
    async def investigate(self, url: str):
        """
        Deeply investigates a website to extract content for test case generation.
        Runs in a separate thread with its own ProactorEventLoop on Windows 
        to bypass Uvicorn loop restrictions.
        """
        loop = asyncio.get_running_loop()
        # Use run_in_executor to execute the blocking _run_in_thread in a separate thread
        return await loop.run_in_executor(None, self._run_in_thread, url)

    def _run_in_thread(self, url: str) -> dict:
        """Helper to set up a new event loop and run the async investigation."""
        import sys
        import asyncio
        
        # Create a new event loop for this thread
        if sys.platform == 'win32':
            # Explicitly use ProactorEventLoop for subprocess support (Playwright)
            new_loop = asyncio.ProactorEventLoop()
        else:
            new_loop = asyncio.new_event_loop()
            
        asyncio.set_event_loop(new_loop)
        
        try:
            # Run the actual async logic
            return new_loop.run_until_complete(self._async_investigate(url))
        finally:
            new_loop.close()

    async def _async_investigate(self, url: str) -> dict:
        """The actual investigation logic using Playwright."""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            )
            page = await context.new_page()
            
            try:
                # Navigate with timeout
                response = await page.goto(url, wait_until="networkidle", timeout=30000)
                
                if not response:
                    return {"error": "Failed to load website."}
                
                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Check for login/signup requirement
                is_login_required = self._detect_login(soup, page.url)
                if is_login_required:
                    return {"error": "I cannot process login-required websites."}
                
                # Extract meaningful content
                text_content = self._extract_text(soup)
                links = self._extract_links(soup, url)
                
                return {
                    "url": page.url,
                    "title": await page.title(),
                    "content": text_content[:5000], # Limit content size for LLM
                    "links": links[:10] # Top 10 internal links for context
                }
                
            except Exception as e:
                return {"error": f"Error investigating website: {str(e)}"}
            finally:
                await browser.close()

    def _detect_login(self, soup: BeautifulSoup, current_url: str) -> bool:
        # Check URL for common login/signup patterns
        login_patterns = [r'/login', r'/signin', r'/signup', r'/register', r'/auth']
        if any(re.search(pattern, current_url.lower()) for pattern in login_patterns):
            return True
            
        # Check for password fields
        if soup.find('input', {'type': 'password'}):
            return True
            
        # Check for common login button text
        login_keywords = ['login', 'sign in', 'log in', 'create account', 'sign up']
        buttons = soup.find_all(['button', 'a', 'input'])
        for btn in buttons:
            text = btn.get_text().lower() if hasattr(btn, 'get_text') else str(btn.get('value', '')).lower()
            if any(kw in text for kw in login_keywords):
                # Additional check: high density of login related terms might indicate a login page
                # but we'll stick to password field + URL first as more reliable indicators.
                pass
                
        return False

    def _extract_text(self, soup: BeautifulSoup) -> str:
        # Remove scripts and styles
        for script in soup(["script", "style"]):
            script.decompose()
            
        # Get text
        text = soup.get_text(separator=' ', strip=True)
        return text

    def _extract_links(self, soup: BeautifulSoup, base_url: str) -> list:
        links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            # Basic internal link detection
            if href.startswith('/') or base_url in href:
                links.append(href)
        return list(set(links))

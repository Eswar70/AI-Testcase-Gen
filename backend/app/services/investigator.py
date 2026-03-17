import asyncio
import httpx
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import re
import logging
from ..config.settings import settings

logger = logging.getLogger(__name__)

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
        """The actual investigation logic using Playwright, with fallback."""
        try:
            async with async_playwright() as p:
                browser = None
                try:
                    # Check if remote browser is configured
                    if settings.BROWSERLESS_TOKEN:
                        ws_endpoint = f"wss://chrome.browserless.io?token={settings.BROWSERLESS_TOKEN}"
                        logger.info(f"Connecting to remote browser at {ws_endpoint}")
                        browser = await p.chromium.connect_over_cdp(ws_endpoint)
                    else:
                        # Try launching local browser
                        logger.info("Launching local Chromium browser")
                        browser = await p.chromium.launch(headless=True)
                        
                    context = await browser.new_context(
                        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                    )
                    page = await context.new_page()
                    
                    # Navigate with timeout
                    # Some sites block headless browsers, so we use networkidle with a fallback
                    await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                    # Wait a bit more for dynamic content if possible
                    try:
                        await asyncio.sleep(2)
                    except:
                        pass
                    
                    content = await page.content()
                    final_url = page.url
                    title = await page.title()
                    await browser.close()
                    
                    return self._process_content(content, final_url, title, url)

                except Exception as browser_error:
                    logger.warning(f"Playwright failed: {str(browser_error)}. Falling back to httpx.")
                    if browser:
                        await browser.close()
                    return await self._fallback_investigate(url)

        except Exception as e:
            logger.error(f"Investigation failed entirely: {str(e)}")
            return {"error": f"Error investigating website: {str(e)}"}

    async def _fallback_investigate(self, url: str) -> dict:
        """Fallback using httpx when Playwright/Browsers are unavailable (e.g. Vercel)."""
        logger.info(f"Starting fallback investigation for {url}")
        async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
            try:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                }
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                
                content = response.text
                soup = BeautifulSoup(content, 'html.parser')
                title = soup.title.string if soup.title else "No Title Found"
                
                return self._process_content(content, str(response.url), title, url)
            except Exception as e:
                return {"error": f"Fallback investigation failed: {str(e)}"}

    def _process_content(self, html_content: str, final_url: str, title: str, base_url: str) -> dict:
        """Shared processing logic for both browser and fallback results."""
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Check for login/signup requirement
        is_login_required = self._detect_login(soup, final_url)
        if is_login_required:
            return {"error": "I cannot process login-required websites."}
        
        # Extract meaningful content
        text_content: str = self._extract_text(soup)
        links: list[str] = self._extract_links(soup, base_url)
        
        return {
            "url": final_url,
            "title": title,
            "content": text_content[:5000],  # Limit content size for LLM
            "links": links[:10]  # Top 10 internal links for context
        }

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

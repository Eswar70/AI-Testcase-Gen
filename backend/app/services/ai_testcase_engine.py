import cohere
import json
from ..config.settings import settings
from ..utils.prompt_engine import build_testcase_prompt
from ..schemas.testcase_schema import TestCaseGenerationResponse

from ..services.investigator import WebsiteInvestigator

co = cohere.AsyncClient(settings.COHERE_API_KEY) if settings.COHERE_API_KEY else None
investigator = WebsiteInvestigator()

async def generate_test_cases_from_url(url: str) -> TestCaseGenerationResponse:
    # 1. Investigate Website
    investigation = await investigator.investigate(url)
    
    if "error" in investigation:
        raise ValueError(investigation["error"])
        
    # 2. Build detailed prompt with website context
    context = f"""
    Website URL: {investigation['url']}
    Title: {investigation['title']}
    Content Summary:
    {investigation['content']}
    
    Internal Links found:
    {', '.join(investigation['links'])}
    """
    
    return await generate_test_cases_from_cohere(context, is_url=True)

async def generate_test_cases_from_cohere(requirement: str, is_url: bool = False) -> TestCaseGenerationResponse:
    if not co:
        raise ValueError("Cohere API Key is not configured in environment variables.")
        
    prompt = build_testcase_prompt(requirement)
    if is_url:
        prompt = f"Analyze this website investigation result and generate comprehensive test cases for its features.\n\n{prompt}"
    
    try:
        response = await co.chat(
            message=prompt,
            temperature=0.3,
            # Best model for JSON / reasoning
            model="command-r-plus-08-2024"
        )
        
        raw_text = response.text.strip()
        
        # Clean up markdown code blocks if the model mistakenly included them
        if raw_text.startswith("```json"):
            raw_text = raw_text.replace("```json", "", 1)
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        raw_text = raw_text.strip()
        
        parsed_json = json.loads(raw_text)
        return TestCaseGenerationResponse(**parsed_json)
        
    except json.JSONDecodeError as je:
        print(f"Failed to parse JSON: {raw_text}")
        raise ValueError("AI output was not valid JSON.") from je
    except Exception as e:
        print(f"Cohere API Error: {e}")
        raise ValueError(f"Failed to generate test cases: {str(e)}")

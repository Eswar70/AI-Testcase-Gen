import cohere
import json
from ..config.settings import settings
from ..utils.prompt_engine import build_testcase_prompt
from ..schemas.testcase_schema import TestCaseGenerationResponse

co = cohere.AsyncClient(settings.COHERE_API_KEY) if settings.COHERE_API_KEY else None

async def generate_test_cases_from_cohere(requirement: str) -> TestCaseGenerationResponse:
    if not co:
        raise ValueError("Cohere API Key is not configured in environment variables.")
        
    prompt = build_testcase_prompt(requirement)
    
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

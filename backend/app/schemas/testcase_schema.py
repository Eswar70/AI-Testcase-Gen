from pydantic import BaseModel, Field
from typing import List

class TestCase(BaseModel):
    test_id: str
    scenario: str
    steps: List[str]
    expected_result: str
    type: str = Field(description="e.g., Positive, Negative, Edge, Regression, Functional")
    priority: str = Field(description="High, Medium, Low")

class SaveTestCasesRequest(BaseModel):
    suite_name: str
    test_cases: List[TestCase]

class TestCaseGenerationRequest(BaseModel):
    requirement: str
    
class TestCaseGenerationResponse(BaseModel):
    test_cases: List[TestCase]

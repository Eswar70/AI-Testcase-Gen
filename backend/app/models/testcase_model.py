from pydantic import BaseModel, ConfigDict, Field, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

class TestCaseDBModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    suite_id: str
    suite_name: str
    test_id: str
    scenario: str
    steps: List[str]
    expected_result: str
    type: str
    priority: str
    requirement: str  # The requirement that generated this test case
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

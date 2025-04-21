from pydantic import BaseModel, field_validator
from typing import List

class QueryRequest(BaseModel):
    question: str

    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Question cannot be empty.")
        return value

class QueryResponse(BaseModel):
    response: str

class QueryHistoryItem(BaseModel):
    question: str
    answer: str
    timestamp: str

class QueryListResponse(BaseModel):
    queries: List[QueryHistoryItem]
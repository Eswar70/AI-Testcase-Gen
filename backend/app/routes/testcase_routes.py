from fastapi import APIRouter, HTTPException, UploadFile, File, WebSocket, WebSocketDisconnect
import uuid
import asyncio
from typing import List
from ..schemas.testcase_schema import TestCaseGenerationRequest, TestCaseGenerationResponse, SaveTestCasesRequest, URLGenerationRequest
from ..models.testcase_model import TestCaseDBModel
from ..services.ai_testcase_engine import generate_test_cases_from_cohere, generate_test_cases_from_url
from ..database.mongo import get_database

router = APIRouter()

@router.post("/generate-testcases", response_model=TestCaseGenerationResponse)
async def generate_testcases_endpoint(request: TestCaseGenerationRequest):
    try:
        # Generate with AI
        ai_response = await generate_test_cases_from_cohere(request.requirement)
        return ai_response
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error: " + str(e))

@router.post("/generate-from-url", response_model=TestCaseGenerationResponse)
async def generate_from_url_endpoint(request: URLGenerationRequest):
    try:
        ai_response = await generate_test_cases_from_url(request.url)
        return ai_response
    except ValueError as ve:
        # This will catch "I cannot process login-required websites."
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error: " + str(e))

@router.websocket("/ws/execute")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            test_cases = data.get("test_cases", [])
            
            for i, tc in enumerate(test_cases):
                # Simulate execution with updates
                await websocket.send_json({
                    "status": "executing",
                    "index": i,
                    "test_id": tc["test_id"],
                    "message": f"Executing {tc['test_id']}..."
                })
                
                # Real-time delay
                await asyncio.sleep(1)
                
                await websocket.send_json({
                    "status": "completed",
                    "index": i,
                    "test_id": tc["test_id"],
                    "result": "Passed"
                })
            
            await websocket.send_json({"status": "done"})
            
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()

@router.post("/save-testcases", response_model=List[TestCaseDBModel])
async def save_testcases(request: SaveTestCasesRequest):
    try:
        db = get_database()
        if db is None:
            raise HTTPException(status_code=500, detail="Database disabled")
        
        suite_id = str(uuid.uuid4())
        cases_to_insert = []
        for tc in request.test_cases:
            # Reconstruct dummy requirement tag safely inside backend
            db_model = TestCaseDBModel(
                suite_id=suite_id,
                suite_name=request.suite_name,
                test_id=tc.test_id,
                scenario=tc.scenario,
                steps=tc.steps,
                expected_result=tc.expected_result,
                type=tc.type,
                priority=tc.priority,
                requirement="Generated via App"
            )
            cases_to_insert.append(db_model.model_dump(by_alias=True, exclude_none=True))
        
        if cases_to_insert:
            inserted = await db.test_cases.insert_many(cases_to_insert)
            # Find the newly inserted documents to return their proper ObjectIDs
            cursor = db.test_cases.find({"_id": {"$in": inserted.inserted_ids}})
            docs = await cursor.to_list(length=len(cases_to_insert))
            return docs
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save test cases: " + str(e))

@router.get("/history", response_model=List[TestCaseDBModel])
async def get_testcase_history(limit: int = 50, skip: int = 0):
    try:
        db = get_database()
        if db is None:
             return []
        cursor = db.test_cases.find().sort("created_at", -1).skip(skip).limit(limit)
        history = await cursor.to_list(length=limit)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch history")

@router.put("/edit/{object_id}", response_model=TestCaseDBModel)
async def edit_testcase(object_id: str, updated_data: dict):
    try:
        from bson import ObjectId
        db = get_database()
        if db is None:
            raise HTTPException(status_code=500, detail="Database disabled")
            
        update_result = await db.test_cases.update_one(
            {"_id": ObjectId(object_id)},
            {"$set": updated_data}
        )
        
        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Test case not found or unmodified")
            
        doc = await db.test_cases.find_one({"_id": ObjectId(object_id)})
        return doc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/delete/{object_id}")
async def delete_testcase(object_id: str):
    try:
        from bson import ObjectId
        db = get_database()
        if db is None:
            raise HTTPException(status_code=500, detail="Database disabled")
            
        delete_result = await db.test_cases.delete_one({"_id": ObjectId(object_id)})
        
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Test case not found")
            
        return {"status": "success", "message": "Test case deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/delete-suite/{suite_id}")
async def delete_suite(suite_id: str):
    try:
        db = get_database()
        if db is None:
            raise HTTPException(status_code=500, detail="Database disabled")
            
        delete_result = await db.test_cases.delete_many({"suite_id": suite_id})
        
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Test suite not found")
            
        return {"status": "success", "message": f"Suite deleted successfully ({delete_result.deleted_count} cases removed)"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/generate-from-file", response_model=TestCaseGenerationResponse)
async def generate_from_file_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        try:
            requirement_text = content.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="File must be valid UTF-8 text (CSV/JSON)")
            
        # The LLM engine is natively capable of contextually understanding raw CSV or JSON buffers.
        ai_response = await generate_test_cases_from_cohere(requirement_text)
        return ai_response
        return ai_response
    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error: " + str(e))

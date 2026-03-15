import sys
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if sys.platform == 'win32':
    logger.info("Windows detected: Ensuring ProactorEventLoopPolicy is set.")
    if not isinstance(asyncio.get_event_loop_policy(), asyncio.WindowsProactorEventLoopPolicy):
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    logger.info(f"Current Event Loop Policy: {type(asyncio.get_event_loop_policy()).__name__}")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config.settings import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Final check of the event loop type in the active worker process
    loop = asyncio.get_running_loop()
    logger.info(f"Worker Startup: Active Event Loop Type: {type(loop).__name__}")
    
    from .database.mongo import connect_to_mongo
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    from .database.mongo import close_mongo_connection
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Welcome to AI Test Case Generator API"}

# Include routers
from .routes.testcase_routes import router as testcase_router
app.include_router(testcase_router, prefix=settings.API_V1_STR, tags=["Test Cases"])

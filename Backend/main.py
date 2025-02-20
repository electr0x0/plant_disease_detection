from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.routes import detection, metrics, gemini_vision, chat

main = FastAPI()

# Simpler CORS configuration
main.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Create a directory for storing processed images
UPLOAD_DIR = "static/processed_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Serve static files
main.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
main.include_router(detection.router, prefix="/api", tags=["detection"])
main.include_router(metrics.router, prefix="/api", tags=["metrics"])
main.include_router(gemini_vision.router, prefix="/api", tags=["gemini-vision"])
main.include_router(chat.router, prefix="/api", tags=["chat"])
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:main", host="0.0.0.0", port=8000, reload=True) 
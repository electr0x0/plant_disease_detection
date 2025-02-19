from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import base64
import io
import cv2
import numpy as np
from datetime import datetime
import random
import asyncio
import json
from typing import List, Dict
import os
from Backend.services.predict import TiledPredictor
from server_schema import DetectionResponse, ImageUpload, PlantMetric, PlantMetricType, ClassificationRequest, ClassificationResponse
from predict_base import ClassificationVisualizer

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a directory for storing processed images
UPLOAD_DIR = "static/processed_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize the predictor with default values


@app.post("/api/detect", response_model=DetectionResponse)
async def detect_disease(image_data: ImageUpload):
    try:
        predictor = TiledPredictor(
            model_path='v8/best.pt',
            tile_size=image_data.tile_size,
            overlap=image_data.overlap,
            conf_threshold=image_data.conf_threshold
        )

        # Decode base64 image
        image_bytes = base64.b64decode(image_data.file_content)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        # Save the original image temporarily
        temp_path = os.path.join(UPLOAD_DIR, f"temp_{image_data.file_name}")
        cv2.imwrite(temp_path, image)

        # Process the image
        start_time = datetime.now()
        processed_image, detections = predictor.predict(temp_path)
        
        # Save processed image
        output_filename = f"processed_{image_data.file_name}"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        cv2.imwrite(output_path, processed_image)

        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()

        return DetectionResponse(
            success=True,
            message="Disease detection completed successfully",
            detections=detections,
            image_url=f"/static/processed_images/{output_filename}",
            processing_time=processing_time
        )

    except Exception as e:
        return DetectionResponse(
            success=False,
            message=f"Error processing image: {str(e)}",
            detections=[],
            processing_time=0
        )

# Simulated plant metrics
async def generate_plant_metrics() -> List[PlantMetric]:
    metrics = []
    current_time = datetime.now().isoformat()
    
    metric_ranges = {
        PlantMetricType.TEMPERATURE: (20, 30, "°C"),
        PlantMetricType.HUMIDITY: (40, 80, "%"),
        PlantMetricType.SOIL_MOISTURE: (30, 70, "%"),
        PlantMetricType.LIGHT_INTENSITY: (2000, 10000, "lux"),
        PlantMetricType.SOIL_PH: (5.5, 7.5, "pH"),
        PlantMetricType.NITROGEN_LEVEL: (100, 200, "ppm"),
        PlantMetricType.PHOSPHORUS_LEVEL: (20, 50, "ppm"),
        PlantMetricType.POTASSIUM_LEVEL: (100, 250, "ppm"),
    }

    for metric_type, (min_val, max_val, unit) in metric_ranges.items():
        value = round(random.uniform(min_val, max_val), 2)
        metrics.append(
            PlantMetric(
                metric_type=metric_type,
                value=value,
                unit=unit,
                timestamp=current_time
            )
        )
    
    return metrics

@app.get("/api/plant-metrics", response_model=List[PlantMetric])
async def get_plant_metrics():
    return await generate_plant_metrics()

# WebSocket connection for real-time metrics
@app.websocket("/ws/plant-metrics")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            try:
                metrics = await generate_plant_metrics()
                await websocket.send_json([metric.dict() for metric in metrics])
                await asyncio.sleep(5)
            except RuntimeError as e:
                if "close message has been sent" in str(e):
                    break
                raise e
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        try:
            await websocket.close()
        except RuntimeError:
            pass  # Ignore if already closed

@app.post("/api/classify", response_model=ClassificationResponse)
async def classify_disease(image_data: ClassificationRequest):
    try:
        # Initialize the classifier
        classifier = ClassificationVisualizer(
            model_path='runs/classify/cauliflower_cls/weights/best.pt'
        )

        # Decode base64 image
        image_bytes = base64.b64decode(image_data.file_content)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        # Save the original image temporarily
        temp_path = os.path.join(UPLOAD_DIR, f"temp_{image_data.file_name}")
        cv2.imwrite(temp_path, image)

        # Process the image
        start_time = datetime.now()
        processed_image, predictions = classifier.process_image(temp_path)
        
        # Save processed image
        output_filename = f"classified_{image_data.file_name}"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        cv2.imwrite(output_path, processed_image)

        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()

        return ClassificationResponse(
            success=True,
            message="Disease classification completed successfully",
            class_name=predictions["class"],
            confidence=predictions["confidence"],
            image_url=f"/static/processed_images/{output_filename}",
            processing_time=processing_time
        )

    except Exception as e:
        return ClassificationResponse(
            success=False,
            message=f"Error processing image: {str(e)}",
            class_name="",
            confidence=0.0,
            processing_time=0
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
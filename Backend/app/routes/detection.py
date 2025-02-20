from fastapi import APIRouter, HTTPException
import cv2
import numpy as np
from datetime import datetime
import os
import base64
from app.schemas.detection import DetectionResponse, ImageUpload

from app.config import BASE_DIR

router = APIRouter()

# Create a directory for storing processed images
UPLOAD_DIR = "static/processed_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/detect", response_model=DetectionResponse)
async def detect_disease(image_data: ImageUpload):
    try:
        from app.services.predict import TiledPredictor
        predictor = TiledPredictor(
            model_path=os.path.join(BASE_DIR, 'services/models/cauliflower_model.pt'),
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
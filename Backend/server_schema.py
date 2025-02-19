from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Union
from enum import Enum

class Detection(BaseModel):
    class_name: str = Field(alias="class")
    original_class: str
    confidence: float
    bbox: List[float]
    severity: str

class DetectionResponse(BaseModel):
    success: bool
    message: str
    detections: List[Detection] = []
    image_url: Optional[str] = None
    processing_time: float

    class Config:
        populate_by_name = True

class ImageUpload(BaseModel):
    file_name: str
    file_content: str  # Base64 encoded image
    tile_size: int = Field(default=640, ge=32, le=2048)
    overlap: float = Field(default=0.2, ge=0, le=0.9)
    conf_threshold: float = Field(default=0.25, ge=0, le=1.0)

class PlantMetricType(str, Enum):
    TEMPERATURE = "temperature"
    HUMIDITY = "humidity"
    SOIL_MOISTURE = "soil_moisture"
    LIGHT_INTENSITY = "light_intensity"
    SOIL_PH = "soil_ph"
    NITROGEN_LEVEL = "nitrogen_level"
    PHOSPHORUS_LEVEL = "phosphorus_level"
    POTASSIUM_LEVEL = "potassium_level"

class PlantMetric(BaseModel):
    metric_type: PlantMetricType
    value: float
    unit: str
    timestamp: str
    
# Add these to server_schema.py
class ClassificationRequest(BaseModel):
    file_name: str
    file_content: str  # Base64 encoded image

class ClassificationResponse(BaseModel):
    success: bool
    message: str
    class_name: str
    confidence: float
    image_url: Optional[str] = None
    processing_time: float
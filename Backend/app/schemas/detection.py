from pydantic import BaseModel, Field
from typing import List, Optional

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
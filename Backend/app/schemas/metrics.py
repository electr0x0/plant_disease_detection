from pydantic import BaseModel
from enum import Enum

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
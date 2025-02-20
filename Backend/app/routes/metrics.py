from fastapi import APIRouter
from typing import List
import random
from datetime import datetime
from app.schemas.metrics import PlantMetric, PlantMetricType

router = APIRouter()

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

@router.get("/plant-metrics", response_model=List[PlantMetric])
async def get_plant_metrics():
    return await generate_plant_metrics() 
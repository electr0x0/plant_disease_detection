from fastapi import APIRouter, HTTPException
from app.schemas.detection import ImageUpload
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
import os
import base64
import tempfile
from typing import Dict, Union
import json

from app.config import GEMINI_API_KEY

router = APIRouter()

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Generation config with schema
GENERATION_CONFIG = {
    "temperature": 0.7,  # Reduced for more consistent outputs
    "top_p": 0.8,
    "top_k": 40,
    "max_output_tokens": 8192,
}

@router.post("/analyze-plant")
async def analyze_plant_image(image_data: ImageUpload) -> Dict[str, Union[bool, dict]]:
    try:
        # Initialize Gemini model
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",  # Changed to pro-vision
            generation_config=GENERATION_CONFIG
        )

        # Decode base64 image and save temporarily
        image_bytes = base64.b64decode(image_data.file_content)
        
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_file:
            temp_file.write(image_bytes)
            temp_path = temp_file.name

        # Upload image to Gemini
        image = genai.upload_file(temp_path, mime_type="image/jpeg")

        # Create a more detailed prompt
        prompt = """
        You are a plant expert analyzing this image. Please provide a detailed analysis following this exact JSON structure:
        {
            "is_plant": true/false,
            "plant_details": {
                "plant_type": "Detailed plant species/variety name",
                "plant_health": "Comprehensive health assessment",
                "visible_symptoms": [
                    "List each visible symptom",
                    "Be specific about locations and appearances"
                ],
                "growth_stage": "Current stage of plant development",
                "environmental_conditions": "Assessment of visible growing conditions",
                "recommended_actions": [
                    "Specific action item 1",
                    "Specific action item 2",
                    "Add more as needed"
                ]
            }
        }

        Important guidelines:
        1. Always include ALL fields in the response
        2. For plant_health, provide a detailed assessment (e.g., "Generally healthy with minor leaf damage")
        3. List at least 2-3 visible symptoms even if minor
        4. Be specific about the growth stage (e.g., "Early flowering stage")
        5. Include at least 3 recommended actions
        6. If no plant is detected, set is_plant to false and return empty plant_details
        7. Ensure the response is valid JSON

        Analyze the image carefully and provide thorough details for each field.
        """

        # Generate response
        response = model.generate_content([prompt, image])
        
        # Extract JSON from response
        # Look for JSON content between curly braces
        response_text = response.text
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start == -1 or json_end == 0:
            raise ValueError("No valid JSON found in response")
            
        json_str = response_text[json_start:json_end]
        
        # Parse JSON response
        result = json.loads(json_str)

        # Validate required fields
        required_fields = [
            "is_plant",
            "plant_details",
            "plant_details.plant_type",
            "plant_details.plant_health",
            "plant_details.visible_symptoms",
            "plant_details.growth_stage",
            "plant_details.environmental_conditions",
            "plant_details.recommended_actions"
        ]

        if result.get("is_plant"):
            for field in required_fields:
                parts = field.split('.')
                current = result
                for part in parts:
                    if isinstance(current, dict) and part in current:
                        current = current[part]
                    else:
                        raise ValueError(f"Missing required field: {field}")

        # Clean up temp file
        os.unlink(temp_path)

        return result

    except ValueError as ve:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid response format: {str(ve)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing image: {str(e)}"
        ) 
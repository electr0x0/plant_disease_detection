from fastapi import APIRouter, HTTPException
from typing import Dict, List, Tuple
import os
from groq import Groq
import json
from pydantic import BaseModel
from app.config import GROQ_API_KEY

router = APIRouter()

# Initialize Groq client
client = Groq(
    api_key=GROQ_API_KEY
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    plant_context: Dict

class ExpertChatRequest(BaseModel):
    messages: List[ChatMessage]

def get_groq_response(messages: List[Dict], system_message: str) -> Tuple[str, str]:
    """
    Get a response from Groq model with thinking process.
    
    Args:
        messages (List[Dict]): Previous messages
        system_message (str): System context message
        
    Returns:
        Tuple[str, str]: (thinking_process, response)
    """
    try:
        completion = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": system_message},
                *messages
            ],
            temperature=0.7,
            max_tokens=4096,
            top_p=0.95,
            stream=True,
            stop=None
        )

        response_text = ""
        for chunk in completion:
            chunk_content = chunk.choices[0].delta.content or ""
            response_text += chunk_content

        # Split the response into thinking process and actual response
        parts = response_text.split("</think>")
        if len(parts) > 1:
            thinking = parts[0].replace("<think>", "").strip()
            response = parts[1].strip()
        else:
            thinking = ""
            response = response_text

        return thinking, response

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API error: {str(e)}"
        )

@router.post("/chat")
async def chat_with_context(chat_request: ChatRequest):
    try:
        # Format the plant context as a string
        context = json.dumps(chat_request.plant_context, indent=2)
        
        # Create system message with context
        system_message = f"""You are a helpful plant expert assistant. 
        Use this plant analysis context for your responses:
        {context}
        
        Guidelines:
        1. Use the context to provide specific, personalized advice
        2. If asked about something not in the context, you can provide general plant care advice
        3. Be friendly and encouraging
        4. Keep responses concise but informative
        5. If unsure, admit limitations and suggest consulting a local expert
        
        When analyzing:
        - Consider the plant's current health status
        - Reference specific symptoms from the context
        - Think about environmental factors
        - Consider growth stage implications
        - Factor in any visible issues
        """

        # Prepare messages for the API
        messages = [{"role": m.role, "content": m.content} for m in chat_request.messages]

        # Get response with thinking process
        thinking, response = get_groq_response(messages, system_message)

        return {
            "thinking": thinking,
            "response": response,
            "role": "assistant"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat error: {str(e)}"
        )

@router.post("/expert-chat")
async def chat_with_expert(chat_request: ExpertChatRequest):
    try:
        system_message = """You are an expert plant scientist and horticulturist with extensive knowledge of:
        - Plant species identification
        - Plant diseases and treatments
        - Growing conditions and requirements
        - Plant care and maintenance
        - Gardening techniques
        - Sustainable agriculture
        - Indoor and outdoor plants
        - Plant nutrition and soil health
        
        Guidelines:
        1. Provide detailed, scientific explanations when relevant
        2. Use proper botanical terminology while remaining accessible
        3. Include practical, actionable advice
        4. Reference research or studies when appropriate
        5. Be clear about limitations of online diagnosis
        6. Suggest when in-person expert consultation is needed
        7. Focus on evidence-based recommendations
        8. Format responses in markdown for better readability
        
        Always structure your responses with clear sections using markdown headings, lists, and emphasis where appropriate.
        """

        messages = [{"role": m.role, "content": m.content} for m in chat_request.messages]
        thinking, response = get_groq_response(messages, system_message)

        return {
            "thinking": thinking,
            "response": response,
            "role": "assistant"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat error: {str(e)}"
        ) 
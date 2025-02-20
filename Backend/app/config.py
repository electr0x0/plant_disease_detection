import os
import dotenv

dotenv.load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
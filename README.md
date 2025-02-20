# Plant Disease Detection System

An advanced plant disease detection and analysis system that combines computer vision, AI-powered plant analysis, and expert chat capabilities to help identify and manage plant diseases.

![Main Dashboard](https://i.ibb.co.com/Lz74XD13/image.png)

## Features

- 🔍 Real-time plant disease detection using computer vision
- 🌱 Detailed plant health analysis using Gemini Vision AI
- 💬 Expert chat system with context-aware responses
- 📊 Real-time plant metrics monitoring
- 🎯 High-accuracy disease classification
- 📱 Responsive web interface

## System Architecture

The system consists of three main components:

1. **Frontend (Next.js)**
   - Modern React-based UI
   - Material UI components
   - Real-time data visualization
   - Responsive design

2. **Backend (FastAPI)**
   - RESTful API endpoints
   - AI model integration
   - Real-time processing and analysis (Hardware implementation is pending)
   - Secure file handling

3. **AI Models**
   - YOLOv11-based disease detection
   - Gemini Vision AI for plant analysis
   - deepseek-r1-distill-llama-70b for reasoning

## Screenshots

### Plant Analysis
![Plant Analysis](https://i.ibb.co.com/W4pskzs9/image.png)

### Agentic Chat
![Agentic Chat](https://i.ibb.co.com/Y4K90zd7/image.png)

### Plant Metrics
![Plant Metrics](https://i.ibb.co.com/QFGVwc6m/image.png)


## Technology Stack

### Frontend
- Next.js 14
- Material UI
- React Three Fiber
- Chart.js & Recharts
- TailwindCSS

### Backend
- FastAPI
- OpenCV
- Ultralytics YOLOv8
- Google Gemini AI
- Groq LLM

### AI/ML
- YOLOv8 for object detection
- Custom-trained disease detection model
- Gemini Vision AI for image analysis

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- CUDA-capable GPU (recommended)

### Backend Setup
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp app/.env.example app/.env  # Configure your API keys
python main.py
```

### Frontend Setup
```bash
cd Frontend
pnpm install
cp .env.example .env  # Configure your environment variables
pnpm run dev
```

### Training Setup (Optional)
```bash
cd Training
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train.py
```

## Project Structure
```
├── Backend/
│   ├── app/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── schemas/        # Data models
│   │   └── config.py       # Configuration
│   └── main.py            # Application entry
├── Frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── views/         # Page layouts
│   │   └── assets/        # Static resources
│   └── next.config.mjs    # Next.js config
└── Training/
    ├── train.py          # Model training
    ├── predict.py        # Inference logic
    └── download.py       # Dataset utilities
```

## API Endpoints

- `/api/detect` - Disease detection endpoint
- `/api/analyze-plant` - Plant analysis using Gemini Vision
- `/api/chat` - Context-aware plant expert chat
- `/api/expert-chat` - Specialized horticultural advice
- `/api/plant-metrics` - Real-time plant monitoring data
- `/api/docs` - API documentation

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- YOLOv11 by Ultralytics
- Google Gemini AI
- Groq LLM
- Next.js team
- FastAPI framework

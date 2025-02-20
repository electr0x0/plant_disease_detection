import os
from roboflow import Roboflow
import dotenv

dotenv.load_dotenv()

rf = Roboflow(api_key=os.getenv("ROBOFLOW_API_KEY"))
project = rf.workspace("leaf-detection-7puag").project("diseasedleafdetection")
version = project.version(1)
dataset = version.download("yolov11")     
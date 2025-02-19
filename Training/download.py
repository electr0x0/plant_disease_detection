from roboflow import Roboflow

rf = Roboflow(api_key="TFwyt4fYTDxEKa1mbqRN")
project = rf.workspace("leaf-detection-7puag").project("diseasedleafdetection")
version = project.version(1)
dataset = version.download("yolov11")     
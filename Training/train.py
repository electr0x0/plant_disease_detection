import ultralytics
from ultralytics import YOLO
from multiprocessing import freeze_support

def main():
    # Load a model
    model = YOLO('yolov8m.pt')  # load a pretrained model

    # Train the model
    model.train(
        data='DiseasedLeafDetection-1/data.yaml',
        epochs=10,
        imgsz=640,
        batch=16,
        plots=True,
        device=0,
        patience=20,
        save=True,
        pretrained=True,
        optimizer='auto',
        augment=True,
        half=True,
        cache='disk',
        workers=12,        # Reduced for Windows stability
        project='runs/detect',
        name='experimentv8',
        exist_ok=True,
        close_mosaic=10,
        amp=True,
        cos_lr=True,
        
        # # Windows-optimized settings
        # multi_scale=True,
        
        # Checkpointing (important for Windows)
        save_period=10,
    
        
        # Performance settings
        warmup_epochs=3,
        warmup_momentum=0.8,
        box=7.5,
        cls=0.5,
        dfl=1.5
    )

    ultralytics.checks()

    # Evaluate model performance on the validation set
    metrics = model.val()

    # Perform object detection on an image
    results = model("Bacterial-Soft-Rot-of-Cauliflower-Head.jpg")
    results[0].show()

    # Export the model to ONNX format
    path = model.export(format="onnx")  # return path to exported model

    # Save in multiple formats
    # 1. PyTorch format (always good to keep)
    model.save('best.pt')

    # 2. Export to TensorRT (best for NVIDIA GPU deployment)
    model.export(
        format='engine',
        device=0,
        half=True,  # FP16 for faster inference
        simplify=True,
        workspace=4,  # GB
        verbose=True
    )

if __name__ == '__main__':
    freeze_support()
    main()
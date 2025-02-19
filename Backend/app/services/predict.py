from ultralytics import YOLO
import cv2
import numpy as np
import os
from typing import Tuple, List, Dict
from itertools import product

class TiledPredictor:
    def __init__(self, model_path: str, tile_size: int = 640, overlap: float = 0.2, conf_threshold: float = 0.25):
        self.model = YOLO(model_path, task='detect')
        self.tile_size = tile_size
        self.overlap = overlap
        self.conf_threshold = conf_threshold
        
    def split_image(self, image: np.ndarray) -> Tuple[List[Dict], Tuple[int, int]]:
        """Split image into overlapping tiles."""
        height, width = image.shape[:2]
        stride = int(self.tile_size * (1 - self.overlap))
        
        tiles = []
        
        for y in range(0, height, stride):
            for x in range(0, width, stride):
                # Calculate tile boundaries
                x1 = x
                y1 = y
                x2 = min(x + self.tile_size, width)
                y2 = min(y + self.tile_size, height)
                
                # Adjust starting position for edge tiles
                if x2 == width:
                    x1 = max(0, x2 - self.tile_size)
                if y2 == height:
                    y1 = max(0, y2 - self.tile_size)
                
                # Extract tile
                tile = image[y1:y2, x1:x2]
                
                # Pad if necessary
                if tile.shape[0] != self.tile_size or tile.shape[1] != self.tile_size:
                    padded_tile = np.full((self.tile_size, self.tile_size, 3), 114, dtype=np.uint8)
                    padded_tile[:tile.shape[0], :tile.shape[1]] = tile
                    tile = padded_tile
                
                tiles.append({
                    'tile': tile,
                    'position': (x1, y1, x2, y2)
                })
        
        return tiles, (height, width)

    def adjust_coordinates(self, boxes: np.ndarray, tile_pos: Tuple[int, int, int, int]) -> np.ndarray:
        """Adjust coordinates from tile space to original image space."""
        x1, y1, _, _ = tile_pos
        adjusted_boxes = boxes.copy()
        adjusted_boxes[:, [0, 2]] += x1  # adjust x coordinates
        adjusted_boxes[:, [1, 3]] += y1  # adjust y coordinates
        return adjusted_boxes

    def get_detections(self, boxes: np.ndarray, scores: np.ndarray, classes: np.ndarray) -> List[Dict]:
        """Convert detections to a structured format with descriptive labels."""
        disease_descriptions = {
            'Cf_blk_rot': 'Cauliflower Black Rot Disease',
            'Cf_healthy_l': 'Healthy Cauliflower Leaf',
            'Cf_healthy_v': 'Healthy Cauliflower Vegetable',
            'Cf_r_spot': 'Cauliflower Ring Spot Disease',
            'Cf_s_rot': 'Cauliflower Soft Rot Disease'
        }
        
        detections = []
        for box, score, cls in zip(boxes, scores, classes):
            class_name = self.model.names[int(cls)]
            detections.append({
                "class": disease_descriptions.get(class_name, class_name),
                "original_class": class_name,
                "confidence": float(score),
                "bbox": box.tolist(),  # Make sure it's a list
                "severity": self._calculate_severity(score)
            })
        return detections

    def _calculate_severity(self, confidence: float) -> str:
        """Calculate severity level based on confidence score."""
        if confidence >= 0.85:
            return "High"
        elif confidence >= 0.65:
            return "Medium"
        else:
            return "Low"

    def predict(self, image_path: str) -> Tuple[np.ndarray, List[Dict]]:
        """Predict on tiled image and combine results."""
        # Read and enhance image
        original_img = cv2.imread(image_path)
        if original_img is None:
            raise ValueError("Could not load image")
        
        # Split image into tiles
        tiles, (height, width) = self.split_image(original_img)
        
        # Store all detections
        all_boxes = []
        all_scores = []
        all_classes = []
        
        # Process each tile
        for tile_info in tiles:
            tile = tile_info['tile']
            tile_pos = tile_info['position']
            
            # Run inference on tile
            results = self.model(tile, conf=self.conf_threshold)
            
            for r in results:
                if len(r.boxes) > 0:
                    # Get boxes and adjust coordinates to original image space
                    boxes = r.boxes.xyxy.cpu().numpy()
                    adjusted_boxes = self.adjust_coordinates(boxes, tile_pos)
                    
                    all_boxes.extend(adjusted_boxes)
                    all_scores.extend(r.boxes.conf.cpu().numpy())
                    all_classes.extend(r.boxes.cls.cpu().numpy())
        
        final_detections = []
        # Convert to numpy arrays
        if all_boxes:
            all_boxes = np.array(all_boxes)
            all_scores = np.array(all_scores)
            all_classes = np.array(all_classes)
            
            # Apply NMS to remove overlapping boxes
            indices = cv2.dnn.NMSBoxes(
                all_boxes.tolist(),
                all_scores.tolist(),
                self.conf_threshold,
                0.45  # NMS threshold
            )
            
            # Get final detections
            final_boxes = all_boxes[indices]
            final_scores = all_scores[indices]
            final_classes = all_classes[indices]
            
            # Get structured detections
            final_detections = self.get_detections(final_boxes, final_scores, final_classes)
            
            # Draw final predictions
            for detection in final_detections:
                box = detection["bbox"]
                label = f'{detection["class"]} ({detection["severity"]}) {detection["confidence"]:.2f}'
                
                # Draw rectangle
                cv2.rectangle(original_img,
                            (int(box[0]), int(box[1])),
                            (int(box[2]), int(box[3])),
                            (0, 255, 0), 2)
                
                # Add label with better positioning and background
                label_size, baseline = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
                text_x = int(box[0])
                text_y = int(box[1]) - 10 if int(box[1]) - 10 > label_size[1] else int(box[1]) + 10 + label_size[1]
                
                # Draw background rectangle for text
                cv2.rectangle(original_img,
                            (text_x, text_y - label_size[1] - baseline),
                            (text_x + label_size[0], text_y + baseline),
                            (0, 0, 0), cv2.FILLED)
                
                # Draw text
                cv2.putText(original_img, label,
                           (text_x, text_y),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        
        return original_img, final_detections

def predict_image(image_path: str, conf_threshold: float = 0.25) -> None:
    """Main prediction function."""
    predictor = TiledPredictor(
        model_path=os.path.join(os.path.dirname(__file__)+'models/cauliflower_model.pt'),
        tile_size=640,
        overlap=0.2,
        conf_threshold=conf_threshold
    )
    predictor.predict(image_path)

if __name__ == '__main__':
    image_path = "Bacterial-Soft-Rot-of-Cauliflower-Head.jpg"
    predict_image(image_path)
import sys
import json
import os
from ultralytics import YOLO
from PIL import Image, ImageDraw

def predict(image_path):
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'best.pt')
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        model = YOLO(model_path)
        results = model(image_path)
        
        # Extract boxes and confidence scores
        boxes = []
        confidences = []
        for result in results[0].boxes:
            box_data = result.xyxy.tolist()[0]
            confidence = result.conf.tolist()[0]
            boxes.append(box_data)
            confidences.append(confidence)
        
        # Load and process image
        image = Image.open(image_path)
        draw = ImageDraw.Draw(image)
        for box in boxes:
            x1, y1, x2, y2 = box[:4]
            draw.rectangle([x1, y1, x2, y2], outline="red", width=2)
        
        # Save processed image
        processed_image_name = f'processed_{os.path.basename(image_path)}'
        processed_image_path = os.path.join(script_dir, 'uploads', processed_image_name)
        image.save(processed_image_path)
        
        # Return results
        result = json.dumps({
            "boxes": boxes,
            "confidences": confidences,
            "image_path": f"/uploads/{processed_image_name}"
        })
        print(result)
        return result
    except Exception as e:
        error_result = json.dumps({"error": str(e)})
        print(error_result, file=sys.stderr)
        return error_result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python predict.py <image_path>"}), file=sys.stderr)
    else:
        image_path = sys.argv[1]
        result = predict(image_path)
        print(result)

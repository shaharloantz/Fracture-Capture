import sys
import json
import os
from ultralytics import YOLO

def predict(image_path):
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'best.pt')
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        model = YOLO(model_path)
        results = model(image_path)
        
        # Convert numpy arrays to lists for JSON serialization
        boxes_data = results[0].boxes.data.tolist()
        
        # Create a dictionary with the results
        output = {
            "boxes": boxes_data,
            "image_path": image_path
        }
        
        # Return JSON string
        return json.dumps(output)
    except Exception as e:
        # Return a JSON string with the error
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python predict.py <image_path>"}), file=sys.stderr)
    else:
        image_path = sys.argv[1]
        result = predict(image_path)
        print(result)  # Print only the JSON string to stdout
        sys.stdout.flush()  # Ensure the output is immediately flushed

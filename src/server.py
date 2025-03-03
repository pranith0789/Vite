from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
try:
    model = load_model("../cnn_covid_model.h5")
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Model load failed: {e}")
    model = None

IMG_SIZE = (224, 224)

def predict_image(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.resize(IMG_SIZE)
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        if model is None:
            raise RuntimeError("Model not loaded.")

        prediction = model.predict(img_array)[0][0]
        class_label = "COVID Positive" if prediction > 0.5 else "COVID Negative"

        return {"prediction": class_label, "confidence": float(prediction)}

    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = predict_image(image_bytes)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": f"Internal server error: {str(e)}"}, status_code=500)

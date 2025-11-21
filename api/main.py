from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model("saved_models/3.h5")
IMAGE_SIZE = 256
CLASS_NAMES = ["glioma", "meningioma", "notumor", "pituitary"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data: bytes) -> np.ndarray:
    # Load image from bytes
    img = Image.open(BytesIO(data)).convert("RGB")
    # Resize
    img = img.resize((IMAGE_SIZE, IMAGE_SIZE))
    # Convert to numpy array without normalization; model already handles rescaling
    img_arr = np.array(img, dtype=np.float32)
    return img_arr

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = read_file_as_image(contents)

    # Add batch dimension: (H, W, 3) -> (1, H, W, 3)
    img_batch = np.expand_dims(image, axis=0)
    predictions = MODEL.predict(img_batch)
    predicted_index = int(np.argmax(predictions[0]))
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(np.max(predictions[0]))

    print(f"Received file: {file.filename}")
    print(f"Raw predictions: {predictions[0]}")
    print(f"Predicted index: {predicted_index}")
    print(f"Predicted class: {predicted_class}, confidence: {confidence:.4f}")

    return {
        "class": predicted_class,
        "confidence": confidence,
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

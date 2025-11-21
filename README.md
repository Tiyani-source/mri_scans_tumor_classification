# MRI Brain Tumor Classification
An end-to-end deep learning project for **brain MRI image classification**, built as a portfolio piece to demonstrate:

- Computer vision & model development (baseline CNN + transfer learning)
- Model evaluation & experiment tracking
- Production-style **FastAPI** backend for inference
- Modern **React** frontend with drag-and-drop image upload
- Optional cloud deployment (GCP Cloud Functions / Cloud Run ready)

> ⚠️ **Disclaimer:**  
> This project is for **research, learning, and portfolio purposes only**.  
> It is **not** a medical device and must **not** be used for clinical diagnosis or treatment decisions.

## Demo Video & Links

### YouTube Demo

[![Watch the Demo](assets/thumbnail.png)](https://youtu.be/tOXIGWK7OUg)

### Dataset Link
[![Kaggle Dataset](https://img.shields.io/badge/Kaggle-Dataset-blue?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)

## 1. Project Structure

```
  MRI_SCANS_TUMOR_CLASSIFICATION/
  api/            # FastAPI backend
  frontend/       # React interface (Vite)
  dataset/        # MRI dataset (Training / Testing)
  saved_models/   # Baseline + TL + fine-tuned models
  training/       # Notebooks / scripts for training

```


## 2. Overview

An end-to-end system for **classifying brain MRI images** into four categories using deep learning:

- **Glioma**
- **Meningioma**
- **Pituitary tumor**
- **No tumor**

This project focuses on building a complete machine-learning pipeline—from dataset preparation and model experimentation to API deployment and a usable frontend interface.

The core highlights include:

- Multiple model iterations  
  - Baseline **CNN**  
  - Transfer learning with **EfficientNetB0** (frozen base)  
  - **Fine-tuned EfficientNetB0** (final selected model)

- A production-ready **FastAPI backend**  
  - Efficient image preprocessing  
  - TensorFlow inference  
  - JSON prediction responses  
  - CORS support for the frontend

- A modern **React (Vite) frontend**  
  - Drag-and-drop MRI upload  
  - Preview before prediction  
  - Real-time class + confidence display

- Optional **Cloud deployment** (GCP Cloud Functions or Cloud Run)

This project serves as a portfolio demonstration of **model development**, **ML engineering**, **deployment**, and **full-stack integration**, not for clinical diagnostic use.

## 3. Model Development

This project includes three major model iterations, each designed to explore different levels of representation learning, performance, and generalization.

### 3.1 Baseline CNN
A custom-built convolutional neural network used to establish the initial benchmark.

- Simple Conv2D → BatchNorm → MaxPooling architecture  
- Trained on grayscale MRI images resized to **256×256**  
- Served as a sanity check to understand dataset complexity  
- Revealed class imbalance and limited feature extraction capacity  
- Result: moderate accuracy; useful for comparison but not the final choice

### 3.2 Transfer Learning (Frozen Base)
EfficientNetB0 was introduced to leverage strong pre-trained ImageNet features.

- Used **EfficientNetB0** with `include_top=False` and `trainable=False`  
- Added custom classification head and trained only the dense layers  
- Significantly improved accuracy and stability compared to baseline CNN  
- Result: strong validation performance; a solid intermediate model

### 3.3 Fine-Tuned Transfer Learning — Final Model
The final selected model used fine-tuning to unlock deeper feature learning.

- Unfroze top layers of EfficientNetB0 for fine-tuning  
- Applied a **very low learning rate** to preserve pre-trained weights  
- Combined with data augmentation and early stopping  
- Delivered the best class-wise balance and test performance  
- Saved as: `saved_models/3.h5`

This fine-tuned model is the one deployed in the FastAPI backend and used by the frontend interface.

## 4. System Architecture

The project follows a simple but production-aligned architecture that connects the React frontend, FastAPI backend, and the TensorFlow model into a single prediction pipeline.

### High-Level Flow

```text
[ React Frontend ]
        |
        | 1. User uploads MRI image (drag & drop)
        v
[ FastAPI Backend ]
        |
        | 2. API receives file → preprocesses image
        | 3. Passes processed tensor to the model
        v
[ TensorFlow Model (EfficientNetB0) ]
        |
        | 4. Outputs class probabilities
        v
[ FastAPI Backend ]
        |
        | 5. API constructs JSON response (class + confidence)
        v
[ React Frontend ]
        |
        | 6. Displays prediction + confidence to the user
```
## 5. Quick Start

## Backend (FastAPI)
```
cd api
python main.py
```

## Frontend (React + Vite)
```
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

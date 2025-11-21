import React, { useState, useEffect } from "react";
import Dropzone from "./components/Dropzone.jsx";
import PredictionResult from "./components/PredictionResult.jsx";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelected = (file) => {
    setError("");
    setPrediction(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select or drag & drop an MRI image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      // MUST match FastAPI parameter name: file: UploadFile = File(...)
      formData.append("file", selectedFile);

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setPrediction(data); // { class, confidence }
    } catch (err) {
      console.error(err);
      setError("Error while predicting. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToUpload = () => {
    document.getElementById("upload-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  useEffect(() => {
    // Add scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".feature-card, .step");
    elements.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
      observer.observe(el);
    });

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="app">
      {/* Landing Page Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">MRI Tumor Classification</h1>
          <p className="hero-subtitle">
            Deep-Learning Research Project for Brain MRI Image Analysis
          </p>
          <p className="hero-description">
            Upload MRI brain scans and get instant, classification of tumors.
            This neural network model can identify glioma, meningioma, pituitary tumors,
            or detect if no tumor is present.
          </p>
          <button className="cta-button" onClick={scrollToUpload}>
            Get Started
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="scroll-indicator" onClick={scrollToUpload}>
          <span>Scroll to upload</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">🔒</div>
            <div className="card-text">Secure</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">⚡</div>
            <div className="card-text">Fast Results</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🎯</div>
            <div className="card-text">Insights</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Neural Network</h3>
            <p>Built using a pre-trained CNN and model is fine-tunedto cater to current needs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Results</h3>
            <p>Get classification results in seconds with confidence scores for each prediction</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Class-Level Insights</h3>
            <p>Able to detect glioma, meningioma, pituitary tumors, and no tumor cases</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Privacy First</h3>
            <p>Your medical images are processed securely and never stored on our servers</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Upload MRI Scan</h3>
              <p>Drag and drop or click to upload your brain MRI image</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Deep-Learning Inference</h3>
              <p>A TensorFlow model hosted via FastAPI processes the input. The image is resized, preprocessed, passed through the network, and evaluated using softmax classification.s</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Results</h3>
              <p>A predicted class and a confidence score are returned instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="upload-section">
        <div className="app-content">
          <h2 className="section-title">Classify Your MRI Scan</h2>
          <p className="section-subtitle">
            Drag & drop an MRI scan or click to upload. The model will classify it
            as glioma, meningioma, pituitary tumor, or no tumor.
          </p>

          <Dropzone
            onFileSelected={handleFileSelected}
            previewUrl={previewUrl}
            onClear={handleClearUpload}
          />

          <button
            className={`predict-button ${loading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
          >
            {loading ? "Analyzing..." : "Predict"}
          </button>

          {error && <p className="error">{error}</p>}

          {prediction && (
            <PredictionResult
              label={prediction.class}
              confidence={prediction.confidence}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
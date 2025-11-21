import React, { useEffect, useState } from "react";

const formatConfidence = (c) => (c * 100).toFixed(2);

const PredictionResult = ({ label, confidence }) => {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    // Animate confidence number from 0 to actual value
    const duration = 1500;
    const steps = 60;
    const increment = confidence / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, confidence);
      setAnimatedConfidence(current);

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedConfidence(confidence);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [confidence]);

  const getLabelColor = (label) => {
    const normalizedLabel = label.toLowerCase();
    if (normalizedLabel === 'notumor' || normalizedLabel === 'no tumor') {
      return '#10b981'; // Green for no tumor
    } else {
      return '#f59e0b'; // Amber for tumors
    }
  };

  return (
    <div className="result-card">
      <div className="result-header">
        <svg
          className="result-icon"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        <h2>Prediction Result</h2>
      </div>

      <div className="result-content">
        <div className="result-item">
          <span className="result-label-text">Classification:</span>
          <span
            className="result-label"
            style={{ color: getLabelColor(label) }}
          >
            {label}
          </span>
        </div>

        <div className="result-item">
          <span className="result-label-text">Confidence:</span>
          <span className="result-confidence">
            {formatConfidence(animatedConfidence)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
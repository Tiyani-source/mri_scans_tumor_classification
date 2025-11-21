import React, { useCallback, useState } from "react";

const Dropzone = ({ onFileSelected, previewUrl, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the dropzone itself
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelected(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const handleClick = useCallback(() => {
    // Allow clicking to upload a new file even when preview exists
    document.getElementById("fileInput").click();
  }, []);

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
  };

  return (
    <div
      className={`dropzone ${isDragging ? "dragging" : ""} ${previewUrl ? "has-preview" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileInput}
      />

      {!previewUrl && (
        <div className="dropzone-content">
          <svg
            className="upload-icon"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p>
            <strong>Drag & drop</strong> an MRI image here, or <span>click</span> to browse
          </p>
        </div>
      )}

      {previewUrl && (
        <div className="preview">
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear image"
            title="Clear image"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img src={previewUrl} alt="Selected MRI" />
        </div>
      )}
    </div>
  );
};

export default Dropzone;
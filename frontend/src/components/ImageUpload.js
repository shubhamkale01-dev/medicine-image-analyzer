import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import apiService from '../services/apiService';

const ImageUpload = ({ onUpload, onLoading, onError, onReset }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      onError('Please upload only JPG or PNG images under 5MB');
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, [onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      onError('Please select an image first');
      return;
    }

    onLoading(true);
    try {
      const result = await apiService.uploadImage(selectedFile);
      onUpload(result.data);
    } catch (error) {
      onError(error.response?.data?.error || 'Failed to process image');
    } finally {
      onLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onReset();
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Medicine Image</h2>
      
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <div className="upload-icon">📷</div>
        {isDragActive ? (
          <p className="upload-text">Drop the image here...</p>
        ) : (
          <>
            <p className="upload-text">Drag & drop an image here, or click to select</p>
            <p className="upload-hint">Supports JPG and PNG files up to 5MB</p>
          </>
        )}
      </div>

      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" className="preview-image" />
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleUpload} className="upload-button">
              Analyze Medicine
            </button>
            <button onClick={handleReset} className="reset-button" style={{ marginLeft: '1rem' }}>
              Remove Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
import React, { useState, useRef } from 'react';
import './App.css';

// Mock API service for demonstration
const mockApiService = {
  async identifyMedicine(file) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response based on common medicine names
    const mockResponses = [
      {
        detectedText: "PARACETAMOL TABLETS IP 500mg Each uncoated tablet contains: Paracetamol IP 500mg",
        medicineName: "Paracetamol",
        genericName: "Acetaminophen",
        indications: "Used for pain relief and fever reduction. Effective for headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers.",
        sideEffects: "Generally well tolerated. Rare side effects may include skin rash, nausea, stomach pain. Overdose can cause serious liver damage.",
        warnings: "Do not exceed recommended dose. Avoid alcohol while taking this medication. Consult doctor if symptoms persist for more than 3 days.",
        manufacturer: "Various manufacturers (Cipla, Sun Pharma, GSK)",
        approximatePrice: "₹15-25",
        rxcui: "161"
      },
      {
        detectedText: "IBUPROFEN TABLETS 400mg Anti-inflammatory pain reliever",
        medicineName: "Ibuprofen",
        genericName: "Ibuprofen",
        indications: "Non-steroidal anti-inflammatory drug (NSAID) used for pain relief, fever reduction, and inflammation. Effective for arthritis, menstrual cramps, and headaches.",
        sideEffects: "May cause stomach upset, heartburn, dizziness, or rash. Long-term use may affect kidneys and cardiovascular system.",
        warnings: "Take with food to reduce stomach irritation. Avoid if allergic to NSAIDs. Not recommended during pregnancy third trimester.",
        manufacturer: "Abbott, Pfizer, Dr. Reddy's",
        approximatePrice: "₹20-40",
        rxcui: "5640"
      },
      {
        detectedText: "CETIRIZINE HYDROCHLORIDE TABLETS 10mg Antihistamine for allergies",
        medicineName: "Cetirizine",
        genericName: "Cetirizine Hydrochloride",
        indications: "Antihistamine used to treat allergic rhinitis, hay fever, urticaria (hives), and other allergic reactions. Provides relief from sneezing, itching, and watery eyes.",
        sideEffects: "Common side effects include drowsiness, dry mouth, fatigue, dizziness, and headache. Usually mild and temporary.",
        warnings: "May cause drowsiness. Avoid alcohol and be cautious while driving or operating machinery. Consult doctor if pregnant or breastfeeding.",
        manufacturer: "UCB, Cipla, Glenmark",
        approximatePrice: "₹25-45",
        rxcui: "1003"
      }
    ];
    
    // Return random mock response
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }
};

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG)');
      return;
    }

    setSelectedFile(file);
    setError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Use mock API service for demonstration
      const data = await mockApiService.identifyMedicine(selectedFile);
      setResult(data);
    } catch (err) {
      setError('Failed to analyze medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview('');
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="App">
      <div className="background-animation"></div>
      
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">💊</span>
            <h1>MediScan AI</h1>
          </div>
          <p className="tagline">Advanced Medicine Identification using AI & OCR Technology</p>
          <div className="features-badges">
            <span className="badge">🔬 OCR Powered</span>
            <span className="badge">🆓 100% Free</span>
            <span className="badge">⚡ Instant Results</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="upload-section">
          <div className="section-header">
            <h2>📸 Upload Medicine Image</h2>
            <p>Drag & drop or click to upload a clear photo of your medicine</p>
          </div>
          
          <div 
            className={`upload-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="file-input"
            />
            
            {!selectedFile ? (
              <div className="upload-placeholder">
                <div className="upload-icon">📷</div>
                <h3>Drop your image here</h3>
                <p>or <span className="click-text">click to browse</span></p>
                <div className="file-requirements">
                  <span>📋 JPG, PNG • Max 5MB</span>
                </div>
              </div>
            ) : (
              <div className="file-selected">
                <div className="file-icon">✅</div>
                <div className="file-details">
                  <h4>{selectedFile.name}</h4>
                  <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button className="remove-file" onClick={(e) => { e.stopPropagation(); resetForm(); }}>❌</button>
              </div>
            )}
          </div>

          {preview && (
            <div className="preview-section">
              <h3>📋 Image Preview</h3>
              <div className="preview-container">
                <img src={preview} alt="Medicine Preview" className="preview-image" />
                <div className="preview-overlay">
                  <span className="preview-status">✓ Ready for Analysis</span>
                </div>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className={`analyze-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🔍</span>
                  <span>Analyze Medicine</span>
                </>
              )}
            </button>
            
            {selectedFile && !loading && (
              <button onClick={resetForm} className="clear-btn">
                <span className="btn-icon">🔄</span>
                <span>Upload New Image</span>
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="loading-section">
            <div className="loading-animation">
              <div className="pulse-ring"></div>
              <div className="pulse-ring delay-1"></div>
              <div className="pulse-ring delay-2"></div>
              <div className="loading-icon">🔬</div>
            </div>
            <div className="loading-text">
              <h3>🧠 AI Analysis in Progress</h3>
              <p>• Extracting text using OCR technology</p>
              <p>• Identifying medicine from database</p>
              <p>• Fetching comprehensive information</p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <small>This usually takes 10-30 seconds</small>
            </div>
          </div>
        )}

        {error && (
          <div className="error-section">
            <div className="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => setError('')} className="dismiss-error">Dismiss</button>
          </div>
        )}

        {result && (
          <div className="results-section">
            <div className="results-header">
              <div className="success-badge">
                <span className="success-icon">✅</span>
                <span>Medicine Identified Successfully!</span>
              </div>
              <h2>📋 Complete Medicine Information</h2>
            </div>
            
            <div className="medicine-card">
              <div className="medicine-header">
                <div className="medicine-title">
                  <h3>{result.medicineName}</h3>
                  <div className="confidence-badge">🎯 High Confidence</div>
                </div>
                {result.genericName !== result.medicineName && (
                  <p className="generic-name">
                    <span className="label">Generic Name:</span> {result.genericName}
                  </p>
                )}
              </div>

              <div className="medicine-grid">
                <div className="info-card primary">
                  <div className="card-header">
                    <span className="card-icon">💊</span>
                    <h4>Uses & Benefits</h4>
                  </div>
                  <p>{result.indications}</p>
                </div>

                <div className="info-card warning">
                  <div className="card-header">
                    <span className="card-icon">⚠️</span>
                    <h4>Side Effects</h4>
                  </div>
                  <p>{result.sideEffects}</p>
                </div>

                <div className="info-card danger">
                  <div className="card-header">
                    <span className="card-icon">🚨</span>
                    <h4>Important Warnings</h4>
                  </div>
                  <p>{result.warnings}</p>
                </div>

                <div className="info-card info">
                  <div className="card-header">
                    <span className="card-icon">🏭</span>
                    <h4>Manufacturer</h4>
                  </div>
                  <p>{result.manufacturer}</p>
                </div>

                <div className="info-card price">
                  <div className="card-header">
                    <span className="card-icon">💰</span>
                    <h4>Approximate Price</h4>
                  </div>
                  <div className="price-display">
                    <span className="price-value">{result.approximatePrice}</span>
                    <small className="price-disclaimer">*Indicative pricing only</small>
                  </div>
                </div>

                {result.rxcui && (
                  <div className="info-card secondary">
                    <div className="card-header">
                      <span className="card-icon">🔢</span>
                      <h4>RxNorm Code</h4>
                    </div>
                    <p className="code-display">{result.rxcui}</p>
                  </div>
                )}
              </div>

              {result.detectedText && (
                <div className="ocr-section">
                  <details className="ocr-details">
                    <summary>
                      <span className="ocr-icon">🔍</span>
                      <span>View Detected Text (OCR Analysis)</span>
                      <span className="expand-icon">▼</span>
                    </summary>
                    <div className="ocr-content">
                      <p className="ocr-text">{result.detectedText}</p>
                    </div>
                  </details>
                </div>
              )}

              <div className="action-footer">
                <button onClick={resetForm} className="new-analysis-btn">
                  <span className="btn-icon">🔄</span>
                  <span>Analyze Another Medicine</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="disclaimer">
          <div className="disclaimer-header">
            <span className="disclaimer-icon">⚠️</span>
            <h3>Important Medical Disclaimer</h3>
          </div>
          <div className="disclaimer-content">
            <div className="disclaimer-points">
              <div className="point">
                <span className="point-icon">📚</span>
                <p><strong>Educational Purpose:</strong> This tool is designed for educational and informational purposes only.</p>
              </div>
              <div className="point">
                <span className="point-icon">👨⚕️</span>
                <p><strong>Professional Consultation:</strong> Always consult qualified healthcare providers before taking any medication.</p>
              </div>
              <div className="point">
                <span className="point-icon">🚫</span>
                <p><strong>Not for Diagnosis:</strong> Do not use this information for self-diagnosis or treatment decisions.</p>
              </div>
              <div className="point">
                <span className="point-icon">🔬</span>
                <p><strong>Accuracy Notice:</strong> OCR results may vary based on image quality and lighting conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🛠️ Technology Stack</h4>
            <div className="tech-badges">
              <span className="tech-badge">React.js</span>
              <span className="tech-badge">Tesseract OCR</span>
              <span className="tech-badge">OpenFDA API</span>
              <span className="tech-badge">RxNorm API</span>
            </div>
          </div>
          <div className="footer-section">
            <h4>🎯 Features</h4>
            <ul>
              <li>✅ 100% Free & Open Source</li>
              <li>✅ Advanced OCR Technology</li>
              <li>✅ Real-time Medicine Identification</li>
              <li>✅ Comprehensive Drug Information</li>
            </ul>
          </div>
          <div className="footer-bottom">
            <p>© 2024 MediScan AI - Empowering Healthcare with Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import MedicineSearch from './components/MedicineSearch';
import MedicineInfo from './components/MedicineInfo';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Disclaimer from './components/Disclaimer';
import './App.css';

function App() {
  const [medicineData, setMedicineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (data) => {
    setMedicineData(data);
    setError(null);
  };

  const handleSearch = (data) => {
    setMedicineData(data);
    setError(null);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setMedicineData(null);
  };

  const handleReset = () => {
    setMedicineData(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">
            <span className="medical-icon">⚕️</span>
            Medicine Information System
          </h1>
          <p className="app-subtitle">
            Upload a medicine strip or tablet image to get comprehensive information
          </p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Disclaimer />
          
          <div className="search-section">
            <MedicineSearch
              onSearch={handleSearch}
              onLoading={handleLoading}
              onError={handleError}
            />
          </div>

          <div className="divider">
            <span>OR</span>
          </div>
          
          <div className="upload-section">
            <ImageUpload
              onUpload={handleImageUpload}
              onLoading={handleLoading}
              onError={handleError}
              onReset={handleReset}
            />
          </div>

          {loading && (
            <div className="loading-section">
              <LoadingSpinner message="Analyzing medicine image..." />
            </div>
          )}

          {error && (
            <div className="error-section">
              <ErrorMessage message={error} onRetry={handleReset} />
            </div>
          )}

          {medicineData && !loading && (
            <div className="results-section">
              <MedicineInfo data={medicineData} />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Medicine Info App. For educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
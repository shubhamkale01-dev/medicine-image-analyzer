import React from 'react';

const MedicineInfo = ({ data }) => {
  const { medicineName, medicineInfo, priceInfo } = data;
  const { fda, rxnorm } = medicineInfo;

  const formatText = (text) => {
    if (!text || text === 'Not available') return 'Information not available';
    return text.length > 500 ? text.substring(0, 500) + '...' : text;
  };

  return (
    <div className="medicine-info">
      <div className="medicine-header">
        <h2 className="medicine-name">{medicineName}</h2>
        {fda?.genericName && fda.genericName !== 'Not available' && (
          <p className="medicine-generic">Generic: {fda.genericName}</p>
        )}
        {fda?.source && (
  <p className="data-source">
    📌 <strong>Data Source:</strong>{" "}
    {fda.source === "openfda"
      ? "OpenFDA (Official Database)"
      : "Fallback / Educational Data"}
  </p>
)}

      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3 className="info-card-title">
            <span>💊</span> Basic Information
          </h3>
          <div className="info-card-content">
            <p><strong>Brand Name:</strong> {fda?.brandName || medicineName}</p>
            <p><strong>Generic Name:</strong> {fda?.genericName || 'Not available'}</p>
            <p><strong>Manufacturer:</strong> {fda?.manufacturer || 'Not available'}</p>
            {rxnorm?.ingredients && (
              <p><strong>Active Ingredients:</strong> {rxnorm.ingredients}</p>
            )}
          </div>
        </div>

        <div className="info-card">
          <h3 className="info-card-title">
            <span>🎯</span> Indications & Usage
          </h3>
          <div className="info-card-content">
            <p>{formatText(fda?.indications)}</p>
          </div>
        </div>

        <div className="info-card">
          <h3 className="info-card-title">
            <span>⚠️</span> Warnings & Precautions
          </h3>
          <div className="info-card-content">
            <p>{formatText(fda?.warnings)}</p>
          </div>
        </div>

        <div className="info-card">
          <h3 className="info-card-title">
            <span>🔄</span> Side Effects
          </h3>
          <div className="info-card-content">
            <p>{formatText(fda?.adverseReactions)}</p>
          </div>
        </div>

        <div className="info-card">
          <h3 className="info-card-title">
            <span>📋</span> Dosage Information
          </h3>
          <div className="info-card-content">
            <p>{formatText(fda?.dosage)}</p>
          </div>
        </div>

        {rxnorm?.rxcui && rxnorm.rxcui !== 'Not found' && (
          <div className="info-card">
            <h3 className="info-card-title">
              <span>🔬</span> RxNorm Information
            </h3>
            <div className="info-card-content">
              <p><strong>RxCUI:</strong> {rxnorm.rxcui}</p>
              <p><strong>Standard Name:</strong> {rxnorm.name}</p>
              {rxnorm.synonym && rxnorm.synonym !== 'Not available' && (
                <p><strong>Synonym:</strong> {rxnorm.synonym}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {priceInfo && (
        <div className="price-info">
          <h3 className="price-title">💰 Approximate Price</h3>
          <div className="price-range">
            ₹{priceInfo.min} - ₹{priceInfo.max} per {priceInfo.unit}
          </div>
          {priceInfo.note && (
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {priceInfo.note}
            </p>
          )}
          <p className="price-disclaimer">
            {priceInfo.disclaimer}
          </p>
        </div>
      )}

      <div className="disclaimer" style={{ marginTop: '2rem' }}>
        <h4 className="disclaimer-title">⚕️ Medical Disclaimer</h4>
        <p className="disclaimer-text">
          This information is for educational purposes only and should not replace professional medical advice. 
          Always consult with a qualified healthcare provider before starting, stopping, or changing any medication.
        </p>
      </div>
    </div>
  );
};

export default MedicineInfo;
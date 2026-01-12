import React, { useState } from 'react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a medicine name');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Searching for:', searchQuery);
      const response = await fetch(`https://medicine-image-analyzer-1.onrender.com/api/search/${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', color: 'white', marginBottom: '30px' }}>
        ⚕️ Medicine Information System
      </h1>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>🔍 Search Medicine</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter medicine name (e.g., Paracetamol)"
            style={{ 
              padding: '10px', 
              flex: '1', 
              minWidth: '250px',
              border: '1px solid #ddd', 
              borderRadius: '5px' 
            }}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              background: loading ? '#ccc' : '#2c5aa0', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '15px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}>
          <h2 style={{ color: '#2c5aa0', marginTop: '0' }}>📋 {result.medicineName}</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: '#666', marginBottom: '5px' }}>Basic Information:</h4>
            <p><strong>Generic Name:</strong> {result.medicineInfo?.fda?.genericName || 'Not available'}</p>
            <p><strong>Manufacturer:</strong> {result.medicineInfo?.fda?.manufacturer || 'Not available'}</p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: '#666', marginBottom: '5px' }}>Usage & Information:</h4>
            <p><strong>Indications:</strong> {result.medicineInfo?.fda?.indications || 'Not available'}</p>
            <p><strong>Warnings:</strong> {result.medicineInfo?.fda?.warnings || 'Not available'}</p>
          </div>
          
          {result.priceInfo && (
            <div style={{ 
              background: '#e7f3ff', 
              padding: '15px', 
              borderRadius: '5px', 
              marginBottom: '15px' 
            }}>
              <h4 style={{ color: '#0066cc', marginTop: '0' }}>💰 Approximate Price</h4>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                ₹{result.priceInfo.min} - ₹{result.priceInfo.max} per {result.priceInfo.unit}
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>{result.priceInfo.disclaimer}</p>
            </div>
          )}
          
          <div style={{ 
            background: '#fff3cd', 
            padding: '15px', 
            borderRadius: '5px', 
            border: '1px solid #ffeaa7' 
          }}>
            <strong>⚠️ Medical Disclaimer:</strong> This information is for educational purposes only. 
            Always consult a licensed healthcare professional before taking any medication.
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
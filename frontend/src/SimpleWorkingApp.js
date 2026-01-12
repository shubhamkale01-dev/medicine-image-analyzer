import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    
    try {
      // Test different endpoints to see what's available
      console.log('Testing endpoints...');
      
      // Test 1: Health check
      try {
        const healthRes = await fetch('https://medicine-image-analyzer-1.onrender.com/api/health');
        console.log('Health check:', healthRes.status, await healthRes.text());
      } catch (e) {
        console.log('Health check failed:', e.message);
      }
      
      // Test 2: Root endpoint
      try {
        const rootRes = await fetch('https://medicine-image-analyzer-1.onrender.com/');
        console.log('Root endpoint:', rootRes.status, await rootRes.text());
      } catch (e) {
        console.log('Root endpoint failed:', e.message);
      }
      
      // Test 3: Try medicine endpoint instead of search
      const res = await fetch(`https://medicine-image-analyzer-1.onrender.com/api/medicine/${query}`);
      console.log('Medicine response status:', res.status);
      
      if (res.status === 404) {
        setData({ error: 'Medicine endpoint not found. Server needs redeployment.' });
        return;
      }
      
      const result = await res.json();
      console.log('Medicine result:', result);
      
      // Get price info separately
      try {
        const priceRes = await fetch(`https://medicine-image-analyzer-1.onrender.com/api/price/${query}`);
        const priceData = await priceRes.json();
        
        setData({
          success: true,
          data: {
            medicineName: query,
            medicineInfo: result.data,
            priceInfo: priceData.success ? priceData.data : null
          }
        });
      } catch (priceError) {
        setData({
          success: true,
          data: {
            medicineName: query,
            medicineInfo: result.data,
            priceInfo: null
          }
        });
      }
      
    } catch (e) {
      console.error('Search error:', e);
      setData({ error: `Network error: ${e.message}` });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>Medicine Search</h1>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)}
        placeholder="Enter medicine name"
        style={{ padding: '10px', width: '200px', marginRight: '10px' }}
      />
      <button onClick={search} disabled={loading}>
        {loading ? 'Loading...' : 'Search'}
      </button>
      
      {data && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5' }}>
          {data.error ? (
            <p>Error: {data.error}</p>
          ) : data.success ? (
            <div>
              <h3>{data.data.medicineName}</h3>
              <p>Generic: {data.data.medicineInfo?.fda?.genericName || 'N/A'}</p>
              <p>Price: ₹{data.data.priceInfo?.min}-{data.data.priceInfo?.max}</p>
            </div>
          ) : (
            <p>No data</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
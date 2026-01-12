import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://medicine-image-analyzer-1.onrender.com/api/search/${query}`);
      const result = await res.json();
      setData(result);
    } catch (e) {
      setData({ error: e.message });
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
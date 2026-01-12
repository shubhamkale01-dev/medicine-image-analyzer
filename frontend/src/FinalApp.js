import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "https://medicine-image-analyzer-backend.onrender.com";

  const search = async () => {
    if (!query.trim()) {
      setError("Please enter a medicine name");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/medicine/${encodeURIComponent(query)}`
      );

      if (!res.ok) throw new Error("API not responding");

      const data = await res.json();

      const priceRes = await fetch(
        `${API_BASE}/api/price/${encodeURIComponent(query)}`
      );
      const priceData = priceRes.ok ? await priceRes.json() : null;

      setResult({
        medicineName: query,
        medicineInfo: data.data,
        priceInfo: priceData?.data || null,
      });
    } catch (err) {
      setError("Server error or cold start. Try again in 30 seconds.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>💊 Medicine Info</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter medicine name"
        style={{ padding: 10, width: "60%" }}
      />

      <button onClick={search} disabled={loading} style={{ marginLeft: 10 }}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>{result.medicineName}</h2>
          <p>
            <b>Generic:</b>{" "}
            {result.medicineInfo?.fda?.genericName || "N/A"}
          </p>
          <p>
            <b>Indications:</b>{" "}
            {result.medicineInfo?.fda?.indications || "N/A"}
          </p>

          {result.priceInfo && (
            <p>
              <b>Price:</b> ₹{result.priceInfo.min} – ₹
              {result.priceInfo.max}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

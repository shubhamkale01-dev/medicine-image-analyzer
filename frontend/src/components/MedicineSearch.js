import React, { useState } from 'react';
import apiService from '../services/apiService';

const MedicineSearch = ({ onSearch, onLoading, onError }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      onError('Please enter at least 2 characters to search');
      return;
    }

    onLoading(true);
    try {
      const result = await apiService.searchMedicine(searchQuery.trim());
      onSearch(result.data);
    } catch (error) {
      onError(error.response?.data?.error || 'Failed to search medicine');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Search Medicine Information</h2>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter medicine name (e.g., Paracetamol, Aspirin)"
            className="search-input"
            maxLength={50}
          />
          <button type="submit" className="search-button" disabled={!searchQuery.trim()}>
            🔍 Search
          </button>
        </div>
        <p className="search-hint">Search for medicine information by name</p>
      </form>
    </div>
  );
};

export default MedicineSearch;
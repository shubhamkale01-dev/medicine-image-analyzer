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
      console.log('Searching for:', searchQuery.trim());
      const result = await apiService.searchMedicine(searchQuery.trim());
      console.log('Search result:', result);
      onSearch(result.data);
    } catch (error) {
      console.error('Search error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to search medicine';
      onError(`Search failed: ${errorMsg}`);
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
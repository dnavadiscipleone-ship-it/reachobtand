import { useState } from 'react';
import axios from 'axios';
import SearchForm from '../components/SearchForm';
import VehicleCard from '../components/VehicleCard';

function SearchPage({ onViewDetails }) {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query, searchType) => {
    setLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const response = await axios.get('/api/vehicles/search', {
        params: {
          query,
          type: searchType
        }
      });

      if (response.data.found) {
        setSearchResults(response.data.vehicles);
      } else {
        setError(`No vehicles found matching "${query}"`);
        setSearchResults([]);
      }
    } catch (err) {
      setError('Failed to search vehicles. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h2>Find Your Towed Vehicle</h2>
          <p>Search by license plate or VIN to locate and track your vehicle</p>
        </div>

        <SearchForm onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="results">
            <h3>Search Results ({searchResults.length})</h3>
            <div className="vehicle-grid">
              {searchResults.map(vehicle => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onViewDetails={() => onViewDetails(vehicle.id)}
                />
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {searchResults && searchResults.length === 0 && !loading && !error && (
          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            Search for your vehicle using license plate or VIN
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;

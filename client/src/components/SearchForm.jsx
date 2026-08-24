import { useState } from 'react';

function SearchForm({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('plate');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchType);
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-inputs">
        <div className="input-group">
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="plate"
                checked={searchType === 'plate'}
                onChange={(e) => setSearchType(e.target.value)}
              />
              License Plate
            </label>
            <label>
              <input
                type="radio"
                value="vin"
                checked={searchType === 'vin'}
                onChange={(e) => setSearchType(e.target.value)}
              />
              VIN
            </label>
          </div>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder={searchType === 'plate' ? 'Enter license plate (e.g., ABC1234)' : 'Enter VIN (e.g., 1HGCM82633A123456)'}
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            className="search-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="search-btn"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchForm;

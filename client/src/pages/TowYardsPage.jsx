import { useState, useEffect } from 'react';
import axios from 'axios';
import TowYardCard from '../components/TowYardCard';

function TowYardsPage() {
  const [towYards, setTowYards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTowYards = async () => {
      try {
        const response = await axios.get('/api/tow-yards');
        setTowYards(response.data);
      } catch (err) {
        setError('Failed to fetch tow yards');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTowYards();
  }, []);

  return (
    <div className="yards-page">
      <div className="yards-container">
        <div className="yards-header">
          <h2>Tow Yards in Your Area</h2>
          <p>Find contact information and hours for all tow yards</p>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading tow yards...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {!loading && towYards.length > 0 && (
          <div className="yards-grid">
            {towYards.map(yard => (
              <TowYardCard key={yard.id} yard={yard} />
            ))}
          </div>
        )}

        {!loading && towYards.length === 0 && !error && (
          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            No tow yards found
          </div>
        )}
      </div>
    </div>
  );
}

export default TowYardsPage;

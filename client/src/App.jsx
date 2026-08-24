import { useState } from 'react';
import SearchPage from './pages/SearchPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import TowYardsPage from './pages/TowYardsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('search');
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const handleViewDetails = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setCurrentPage('details');
  };

  const handleBackToSearch = () => {
    setCurrentPage('search');
    setSelectedVehicleId(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <h1 className="logo">🚗 Vehicle Tow Tracker</h1>
          <nav className="nav">
            <button
              className={`nav-btn ${currentPage === 'search' ? 'active' : ''}`}
              onClick={() => handleBackToSearch()}
            >
              Search Vehicle
            </button>
            <button
              className={`nav-btn ${currentPage === 'yards' ? 'active' : ''}`}
              onClick={() => setCurrentPage('yards')}
            >
              Tow Yards
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {currentPage === 'search' && (
          <SearchPage onViewDetails={handleViewDetails} />
        )}
        {currentPage === 'details' && selectedVehicleId && (
          <VehicleDetailsPage
            vehicleId={selectedVehicleId}
            onBack={handleBackToSearch}
          />
        )}
        {currentPage === 'yards' && (
          <TowYardsPage />
        )}
      </main>

      <footer className="footer">
        <p>Vehicle Tow Tracker © 2024 | Find your towed vehicle easily</p>
      </footer>
    </div>
  );
}

export default App;

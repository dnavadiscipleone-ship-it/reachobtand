import { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleMap from '../components/VehicleMap';
import StatusBadge from '../components/StatusBadge';

function VehicleDetailsPage({ vehicleId, onBack }) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(`/api/vehicles/${vehicleId}`);
        setVehicle(response.data);
      } catch (err) {
        setError('Failed to fetch vehicle details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="details-page">
        <button className="back-btn" onClick={onBack}>← Back to Search</button>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="details-page">
        <button className="back-btn" onClick={onBack}>← Back to Search</button>
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <button className="back-btn" onClick={onBack}>← Back to Search</button>

      <div className="details-container">
        <div className="details-header">
          <div className="vehicle-title">
            <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
            <div className="plate-display">{vehicle.licensePlate}</div>
          </div>
          <StatusBadge status={vehicle.status} />
        </div>

        <div className="details-grid">
          <div className="details-section vehicle-info">
            <h3>Vehicle Information</h3>
            <div className="info-rows">
              <div className="info-row">
                <span className="label">License Plate:</span>
                <span className="value">{vehicle.licensePlate}</span>
              </div>
              <div className="info-row">
                <span className="label">VIN:</span>
                <span className="value">{vehicle.vin}</span>
              </div>
              <div className="info-row">
                <span className="label">Color:</span>
                <span className="value">{vehicle.color}</span>
              </div>
              <div className="info-row">
                <span className="label">Tow Reason:</span>
                <span className="value">{vehicle.reason}</span>
              </div>
              <div className="info-row">
                <span className="label">Towed:</span>
                <span className="value">
                  {new Date(vehicle.towedAt).toLocaleString()}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Time in Yard:</span>
                <span className="value">{vehicle.hoursInYard} hours</span>
              </div>
            </div>
          </div>

          <div className="details-section fees">
            <h3>Fees</h3>
            <div className="fee-rows">
              <div className="fee-row">
                <span>Towing Fee:</span>
                <span className="amount">${vehicle.fees.towing}</span>
              </div>
              <div className="fee-row">
                <span>Storage Fee:</span>
                <span className="amount">${vehicle.fees.storage}</span>
              </div>
              <div className="fee-row">
                <span>Processing Fee:</span>
                <span className="amount">${vehicle.fees.processing}</span>
              </div>
              <div className="fee-row total">
                <span>Total Amount Due:</span>
                <span className="amount">${vehicle.totalFees}</span>
              </div>
            </div>
          </div>

          <div className="details-section tow-yard">
            <h3>Tow Yard Location</h3>
            {vehicle.towYard && (
              <div className="info-rows">
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{vehicle.towYard.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Address:</span>
                  <span className="value">{vehicle.towYard.address}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">
                    <a href={`tel:${vehicle.towYard.phone}`}>
                      {vehicle.towYard.phone}
                    </a>
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">
                    <a href={`mailto:${vehicle.towYard.email}`}>
                      {vehicle.towYard.email}
                    </a>
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Hours:</span>
                  <span className="value">{vehicle.towYard.hours}</span>
                </div>
                <div className="info-row">
                  <span className="label">Accepts:</span>
                  <span className="value">{vehicle.towYard.acceptedPayment.join(', ')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {vehicle.towYard && (
          <div className="map-section">
            <h3>Tow Yard Location Map</h3>
            <VehicleMap
              lat={vehicle.towYard.location.latitude}
              lng={vehicle.towYard.location.longitude}
              name={vehicle.towYard.name}
              address={vehicle.towYard.address}
            />
          </div>
        )}

        <div className="action-section">
          <button className="btn btn-primary" onClick={() => {
            if (vehicle.towYard) {
              window.location.href = `tel:${vehicle.towYard.phone}`;
            }
          }}>
            📞 Call Tow Yard
          </button>
          <button className="btn btn-secondary" onClick={() => {
            if (vehicle.towYard) {
              window.open(
                `https://www.google.com/maps/search/${encodeURIComponent(vehicle.towYard.address)}`,
                '_blank'
              );
            }
          }}>
            📍 Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailsPage;

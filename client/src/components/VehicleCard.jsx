import StatusBadge from './StatusBadge';

function VehicleCard({ vehicle, onViewDetails }) {
  return (
    <div className="vehicle-card">
      <div className="card-header">
        <div>
          <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
          <div className="plate">{vehicle.licensePlate}</div>
        </div>
        <StatusBadge status={vehicle.status} />
      </div>

      <div className="card-body">
        <div className="info">
          <span className="label">VIN:</span>
          <span className="text-sm">{vehicle.vin.slice(-8)}...</span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-full"
        onClick={onViewDetails}
      >
        View Details →
      </button>
    </div>
  );
}

export default VehicleCard;

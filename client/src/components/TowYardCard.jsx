function TowYardCard({ yard }) {
  const capacityPercent = (yard.currentVehicles / yard.capacity) * 100;
  const capacityStatus = capacityPercent > 80 ? 'high' : capacityPercent > 50 ? 'medium' : 'low';

  return (
    <div className="yard-card">
      <div className="yard-header">
        <h3>{yard.name}</h3>
        <div className={`capacity-indicator capacity-${capacityStatus}`}>
          {yard.currentVehicles}/{yard.capacity}
        </div>
      </div>

      <div className="yard-body">
        <div className="info-row">
          <span className="label">📍 Address:</span>
          <span className="value">{yard.address}</span>
        </div>

        <div className="info-row">
          <span className="label">📞 Phone:</span>
          <span className="value">
            <a href={`tel:${yard.phone}`}>{yard.phone}</a>
          </span>
        </div>

        <div className="info-row">
          <span className="label">✉️ Email:</span>
          <span className="value">
            <a href={`mailto:${yard.email}`}>{yard.email}</a>
          </span>
        </div>

        <div className="info-row">
          <span className="label">🕐 Hours:</span>
          <span className="value">{yard.hours}</span>
        </div>

        <div className="info-row">
          <span className="label">💳 Payment:</span>
          <span className="value">{yard.acceptedPayment.join(', ')}</span>
        </div>
      </div>

      <div className="yard-footer">
        <button
          className="btn btn-small btn-primary"
          onClick={() => window.location.href = `tel:${yard.phone}`}
        >
          Call Now
        </button>
        <button
          className="btn btn-small btn-secondary"
          onClick={() => window.open(
            `https://www.google.com/maps/search/${encodeURIComponent(yard.address)}`,
            '_blank'
          )}
        >
          Directions
        </button>
      </div>
    </div>
  );
}

export default TowYardCard;

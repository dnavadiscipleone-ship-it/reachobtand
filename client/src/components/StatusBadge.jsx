function StatusBadge({ status }) {
  const statusConfig = {
    'in-yard': {
      icon: '🔍',
      label: 'In Yard',
      className: 'status-in-yard'
    },
    'ready-for-pickup': {
      icon: '✅',
      label: 'Ready for Pickup',
      className: 'status-ready'
    },
    'picked-up': {
      icon: '🚗',
      label: 'Picked Up',
      className: 'status-picked-up'
    }
  };

  const config = statusConfig[status] || statusConfig['in-yard'];

  return (
    <div className={`status-badge ${config.className}`}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-label">{config.label}</span>
    </div>
  );
}

export default StatusBadge;

import { mockDatabase } from '../data/mockData.js';

export const searchVehicles = (req, res) => {
  const { query, type = 'plate' } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query required' });
  }

  const searchQuery = query.toUpperCase();
  const results = mockDatabase.vehicles.filter(vehicle => {
    if (type === 'plate') {
      return vehicle.licensePlate.includes(searchQuery);
    } else if (type === 'vin') {
      return vehicle.vin.includes(searchQuery);
    }
    return false;
  });

  res.json({
    found: results.length > 0,
    count: results.length,
    vehicles: results.map(v => ({
      id: v.id,
      licensePlate: v.licensePlate,
      make: v.make,
      model: v.model,
      year: v.year,
      status: v.status,
      towYardId: v.towYardId
    }))
  });
};

export const getVehicleDetails = (req, res) => {
  const { id } = req.params;
  const vehicle = mockDatabase.vehicles.find(v => v.id === id);

  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const towYard = mockDatabase.towYards.find(y => y.id === vehicle.towYardId);
  const totalFees = Object.values(vehicle.fees).reduce((a, b) => a + b, 0);

  res.json({
    ...vehicle,
    towYard,
    totalFees,
    hoursInYard: Math.round((Date.now() - new Date(vehicle.towedAt).getTime()) / (1000 * 60 * 60))
  });
};

export const getTowYards = (req, res) => {
  res.json(mockDatabase.towYards);
};

export const updateVehicleStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const vehicle = mockDatabase.vehicles.find(v => v.id === id);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const validStatuses = ['in-yard', 'ready-for-pickup', 'picked-up'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  vehicle.status = status;
  res.json(vehicle);
};

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mockDatabase } from './data/mockData.js';
import { searchVehicles, getVehicleDetails, getTowYards, updateVehicleStatus } from './routes/vehicles.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/vehicles/search', searchVehicles);
app.get('/api/vehicles/:id', getVehicleDetails);
app.get('/api/tow-yards', getTowYards);
app.put('/api/vehicles/:id/status', updateVehicleStatus);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

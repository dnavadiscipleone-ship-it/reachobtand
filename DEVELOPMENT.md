# Vehicle Tow Tracker - Development Guide

## Project Overview

This is a full-stack vehicle tow tracking application that helps users find and monitor their towed vehicles in real-time.

## Architecture

### Frontend Architecture
```
┌─────────────────────────────────────┐
│     React Application (Vite)        │
├─────────────────────────────────────┤
│  Pages Layer                        │
│  ├─ SearchPage                      │
│  ├─ VehicleDetailsPage              │
│  └─ TowYardsPage                    │
├─────────────────────────────────────┤
│  Components Layer                   │
│  ├─ SearchForm                      │
│  ├─ VehicleCard                     │
│  ├─ StatusBadge                     │
│  ├─ VehicleMap                      │
│  └─ TowYardCard                     │
├─────────────────────────────────────┤
│  Services Layer (Axios)             │
│  └─ API calls to backend            │
└─────────────────────────────────────┘
```

### Backend Architecture
```
┌─────────────────────────────────────┐
│     Express.js Server               │
├─────────────────────────────────────┤
│  Routes Layer                       │
│  └─ /api/vehicles/*                 │
│  └─ /api/tow-yards                  │
├─────────────────────────────────────┤
│  Services/Controllers               │
│  └─ Vehicle operations              │
│  └─ Tow yard operations             │
├─────────────────────────────────────┤
│  Data Layer (Mock)                  │
│  └─ mockData.js                     │
└─────────────────────────────────────┘
```

## Development Workflow

### 1. Setup Development Environment

```bash
# Install dependencies
npm install:all

# Create .env file
cp server/.env.example server/.env
```

### 2. Start Development Servers

```bash
# Run both frontend and backend
npm run dev

# Or run individually
npm run server    # Terminal 1
npm run client    # Terminal 2
```

### 3. Frontend Development

The React app uses Vite for hot module replacement (HMR).

**Component Structure:**
- Each component is in `src/components/`
- Each page is in `src/pages/`
- Global styles in `src/styles/index.css`

**Adding a New Component:**
```jsx
// src/components/NewComponent.jsx
function NewComponent() {
  return <div className="new-component">...</div>;
}

export default NewComponent;
```

### 4. Backend Development

**Adding a New API Endpoint:**

```javascript
// server/routes/vehicles.js
export const getNewData = (req, res) => {
  try {
    // Your logic
    res.json({ data: '...' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// server/index.js
import { getNewData } from './routes/vehicles.js';
app.get('/api/new-endpoint', getNewData);
```

## Database Integration

Currently using mock data. To integrate a real database:

### MongoDB Example
```bash
npm install mongoose
```

```javascript
// server/models/Vehicle.js
import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  licensePlate: String,
  vin: String,
  // ... other fields
});

export default mongoose.model('Vehicle', vehicleSchema);
```

### PostgreSQL Example
```bash
npm install pg sequelize
```

## Testing

### Manual Testing Checklist

- [ ] Search returns correct results
- [ ] Vehicle details load without errors
- [ ] Tow yard information displays correctly
- [ ] Status badges show correct colors
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Error messages appear for invalid searches
- [ ] Loading spinners show during data fetch

### Unit Testing (Future)
```bash
npm install --save-dev vitest @testing-library/react
```

## Deployment

### Heroku Deployment

```bash
# Create Heroku app
heroku create vehicle-tow-tracker

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Docker Deployment

```bash
docker build -t vehicle-tow-tracker .
docker run -p 5000:5000 -p 3000:3000 vehicle-tow-tracker
```

## Code Style

- **JavaScript**: ES6+ with arrow functions
- **React**: Functional components with hooks
- **CSS**: CSS3 with custom properties (variables)
- **Naming**: camelCase for variables/functions, PascalCase for components

## Performance Optimization

### Frontend
- [ ] Code splitting with React.lazy
- [ ] Image optimization
- [ ] Bundle size monitoring
- [ ] Caching strategies

### Backend
- [ ] Database query optimization
- [ ] Response compression
- [ ] Rate limiting
- [ ] Caching headers

## Security Considerations

- [ ] Input validation on backend
- [ ] CORS configuration
- [ ] SQL injection prevention (when using DB)
- [ ] XSS protection (React built-in)
- [ ] HTTPS in production
- [ ] Environment variable protection

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install:all
```

### CORS Issues
Ensure backend server is running and CORS is configured in `server/index.js`

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## License

MIT License

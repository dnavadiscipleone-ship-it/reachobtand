# Claude Context for Vehicle Tow Tracker

## Project Overview

**Vehicle Tow Tracker** is a full-stack web application that helps users locate and track their towed vehicles. Users can search by license plate or VIN, view vehicle details, see associated fees, and find tow yard locations and contact information.

**Author:** dnavadiscipleone@gmail.com  
**License:** MIT  
**Repository Structure:** Monorepo with client (React), server (Express), and mobile (React Native/Expo) packages

## Technology Stack

### Frontend (Client)
- **React 18** with functional components and hooks
- **Vite 5** for bundling and dev server (HMR at port 3000)
- **Axios** for HTTP requests
- **CSS3** with custom properties (variables) for theming
- **ES6 modules** (`"type": "module"` in package.json)

### Backend (Server)
- **Express.js 4.18** for REST API
- **CORS** middleware for cross-origin requests
- **dotenv** for environment configuration
- **Node.js** runtime with ES6 modules
- **Mock data** (mockData.js) for development

### Mobile (Future)
- **Expo 50** for React Native
- **React Navigation** for routing
- **React Native** 0.73
- **Axios** for API calls

## Directory Structure

```
reachobtand/
├── client/                    # React web frontend
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── SearchForm.jsx
│   │   │   ├── VehicleCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── TowYardCard.jsx
│   │   │   └── VehicleMap.jsx
│   │   ├── pages/            # Page-level components (views)
│   │   │   ├── SearchPage.jsx
│   │   │   ├── VehicleDetailsPage.jsx
│   │   │   └── TowYardsPage.jsx
│   │   ├── styles/           # Global and shared styles
│   │   │   └── index.css
│   │   ├── App.jsx           # Root app component with routing
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js        # Vite configuration with proxy to /api
│   └── package.json
├── server/                    # Express.js backend
│   ├── index.js              # Server entry, route setup, CORS config
│   ├── routes/
│   │   └── vehicles.js       # API endpoint handlers
│   ├── data/
│   │   └── mockData.js       # Mock database with sample data
│   └── package.json
├── mobile/                    # React Native/Expo app (future)
│   ├── src/
│   │   └── screens/          # Navigation screens
│   ├── app.json              # Expo configuration
│   ├── babel.config.js
│   └── package.json
├── DEVELOPMENT.md            # Development guide
├── README.md                 # User-facing documentation
├── CLAUDE.md                 # This file - AI assistant context
├── package.json              # Root package with monorepo scripts
└── .gitignore

```

## Development Setup

### Prerequisites
- Node.js v16+ (v18+ recommended)
- npm or yarn

### Initial Setup

```bash
# Clone and install all dependencies
git clone <repo>
cd reachobtand
npm install:all

# Or manually:
npm install
cd client && npm install
cd ../server && npm install
cd ..

# Optional: Setup environment variables
cp server/.env.example server/.env
```

### Running the Application

```bash
# Run both frontend and backend concurrently
npm run dev

# This starts:
# - Frontend (Vite): http://localhost:3000 with HMR
# - Backend (Express): http://localhost:5000
```

**Run individually (for debugging):**
```bash
# Terminal 1: Backend only
npm run server

# Terminal 2: Frontend only  
npm run client
```

## Code Conventions and Style

### JavaScript/React Conventions
- **ES6 modules:** Use `import`/`export` (not CommonJS)
- **Components:** Functional components with hooks, PascalCase names
- **Variables/Functions:** camelCase
- **Constants:** UPPERCASE_SNAKE_CASE (for module-level constants)
- **Files:** 
  - Components: `ComponentName.jsx`
  - Pages: `PageName.jsx`
  - Utilities: `utilityName.js`

### React Component Structure

```jsx
import { useState } from 'react';

function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initial);

  const handleEvent = () => {
    // Handler logic
  };

  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

**Best Practices:**
- Use functional components exclusively
- Lift state up only when necessary
- Pass callbacks via props for communication
- Keep components focused on single responsibility
- Use destructuring for props

### CSS Conventions
- **Selectors:** Lowercase with hyphens (`.component-name`)
- **CSS Variables:** `:root` defines theme properties
- **Layout:** Flexbox/Grid preferred, avoid floats
- **Mobile-first:** Base styles for mobile, then media queries for larger screens
- **Naming:** BEM-adjacent (block-element-modifier pattern acceptable)

Example CSS:
```css
:root {
  --primary-color: #3498db;
  --spacing-unit: 8px;
}

.search-form {
  display: flex;
  gap: var(--spacing-unit);
}

.search-input {
  color: var(--primary-color);
}
```

### Backend Conventions
- **Routes:** RESTful, use HTTP verbs correctly
- **Response Format:** Always JSON with consistent structure
- **Error Handling:** Try-catch blocks with meaningful error messages
- **Status Codes:** 
  - 200: Success
  - 400: Bad request
  - 404: Not found
  - 500: Server error
- **Naming:** Handlers use `verb + resource` pattern (e.g., `searchVehicles`, `getTowYards`)

Example handler:
```javascript
export const searchVehicles = (req, res) => {
  try {
    const { query, type } = req.query;
    // Logic
    res.json({ found: true, count: 1, vehicles: [...] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## API Endpoints

### Vehicle Search
```
GET /api/vehicles/search?query=ABC1234&type=plate
```
- Query params: `query` (string), `type` ('plate' | 'vin')
- Response: `{ found: boolean, count: number, vehicles: Vehicle[] }`

### Get Vehicle Details
```
GET /api/vehicles/:id
```
- Response: Complete `Vehicle` object with fees, tow yard info, location

### Get All Tow Yards
```
GET /api/tow-yards
```
- Response: Array of `TowYard` objects

### Update Vehicle Status
```
PUT /api/vehicles/:id/status
```
- Body: `{ status: 'in-yard' | 'ready-for-pickup' | 'picked-up' }`
- Response: Updated `Vehicle` object

### Health Check
```
GET /api/health
```
- Response: `{ status: 'ok', timestamp: ISO8601 }`

## Component Hierarchy and Data Flow

### Frontend Component Structure

```
App (State: currentPage, selectedVehicleId)
├── Header (Nav buttons)
├── Main
│   ├── SearchPage (currentPage === 'search')
│   │   ├── SearchForm (Input collection)
│   │   └── VehicleCard[] (Results display)
│   ├── VehicleDetailsPage (currentPage === 'details')
│   │   ├── StatusBadge
│   │   ├── VehicleCard (Detailed view)
│   │   ├── VehicleMap
│   │   └── TowYardCard
│   └── TowYardsPage (currentPage === 'yards')
│       └── TowYardCard[]
└── Footer
```

**Data Flow:** App → Pages → Components → API calls via Axios

### Axios Usage Pattern

```javascript
// In components
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await axios.get('/api/vehicles/search', { params: { query, type } });
    setData(response.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

## Data Models

### Vehicle
```javascript
{
  id: string,
  licensePlate: string,
  vin: string,
  make: string,
  model: string,
  year: number,
  color: string,
  status: 'in-yard' | 'ready-for-pickup' | 'picked-up',
  towedAt: ISO8601,
  reason: string,
  location: { latitude: number, longitude: number },
  fees: {
    towing: number,
    storage: number,
    processing: number
  },
  totalFees: number,
  hoursInYard: number,
  towYardId: string
}
```

### TowYard
```javascript
{
  id: string,
  name: string,
  address: string,
  phone: string,
  email: string,
  location: { latitude: number, longitude: number },
  hours: string,
  acceptedPayment: string[],
  capacity: number,
  currentVehicles: number
}
```

## Mock Data

**Location:** `server/data/mockData.js`

Contains:
- 3 sample vehicles with different statuses
- 2 sample tow yards in New York
- Realistic fee structures and location coordinates

To integrate real database, replace mock data exports in `vehicles.js` with actual database queries.

## Development Workflow

### Adding a New API Endpoint

1. **Add handler** in `server/routes/vehicles.js`:
```javascript
export const getNewData = (req, res) => {
  try {
    // Logic using mockDatabase
    res.json({ data: '...' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

2. **Register route** in `server/index.js`:
```javascript
import { getNewData } from './routes/vehicles.js';
app.get('/api/new-endpoint', getNewData);
```

3. **Call from frontend** using Axios

### Adding a New React Component

1. Create file in `client/src/components/ComponentName.jsx`
2. Use functional component with hooks
3. Export as default
4. Import and use in pages/other components

### Adding a New Page

1. Create file in `client/src/pages/PageName.jsx`
2. Implement page component
3. Add route/condition in `App.jsx`
4. Update navigation in header

## Testing

### Manual Testing Checklist
- [ ] Search returns correct results for both plate and VIN
- [ ] Vehicle details load and display all fields
- [ ] Status badges show correct colors/labels
- [ ] Tow yard list displays with capacity indicators
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Error messages appear for invalid searches
- [ ] Loading states display during data fetch
- [ ] API endpoints respond with correct status codes

### Running Tests (Future)
```bash
# Unit tests (not yet configured)
npm run test

# E2E tests (not yet configured)
npm run test:e2e
```

## Build and Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
Creates `client/dist/` with optimized frontend bundle.

### Environment Variables

**Server (.env):**
```
PORT=5000
NODE_ENV=production
```

**Frontend:** Currently hard-coded to `http://localhost:5000` via Vite proxy. Update for production.

### Deployment Options

**Heroku:**
```bash
heroku create vehicle-tow-tracker
heroku config:set NODE_ENV=production
git push heroku main
```

**Docker:**
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install:all && npm run build
EXPOSE 5000 3000
CMD ["npm", "run", "dev"]
```

**Vercel (Frontend):**
```bash
vercel --prod
```

## Performance Considerations

### Frontend Optimizations (To-Do)
- [ ] Code splitting with `React.lazy()` for pages
- [ ] Image optimization for vehicle images
- [ ] Bundle size monitoring
- [ ] Response caching strategies

### Backend Optimizations (To-Do)
- [ ] Database query optimization (when moving from mock data)
- [ ] Response compression (gzip)
- [ ] Rate limiting for API endpoints
- [ ] Cache-Control headers

## Security Considerations

### Current
- ✅ CORS configured in Express
- ✅ Input validation (text trimming in SearchForm)

### To-Do
- [ ] Backend input validation (query, type parameters)
- [ ] SQL injection prevention (when using real database)
- [ ] HTTPS in production
- [ ] Environment variable protection (.env never committed)
- [ ] Rate limiting on API endpoints
- [ ] XSS protection (React provides built-in)

## Common Tasks

### Debugging Backend
```bash
# Check port in use
lsof -ti:5000 | xargs kill -9  # Kill process on port 5000

# Restart server
npm run server
```

### Debugging Frontend
- Browser DevTools: F12 or Cmd+Option+I
- React DevTools extension recommended
- Vite HMR: Changes auto-reload at http://localhost:3000

### Add Mock Data
Edit `server/data/mockData.js`:
```javascript
export const mockDatabase = {
  vehicles: [
    { id: '1', licensePlate: 'ABC1234', ... },
    // Add more vehicles
  ],
  towYards: [
    { id: 'yard1', name: 'Central Tow Yard', ... },
    // Add more yards
  ]
};
```

### Integrate Real Database

**MongoDB Example:**
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

**PostgreSQL Example:**
```bash
npm install pg sequelize
```

## Git Conventions

### Branch Naming
- Feature: `feature/descriptive-name`
- Bug fix: `fix/descriptive-name`
- Hotfix: `hotfix/descriptive-name`

### Commit Messages
- Use imperative mood: "Add feature" not "Added feature"
- Be descriptive: reference what changed and why
- Example: "Add vehicle search by VIN"

### Pull Request Workflow
1. Create feature branch from `main`
2. Make changes with clear commits
3. Push branch and open PR
4. Address review comments
5. Merge when approved
6. Delete branch

## Troubleshooting

### Port Already in Use
```bash
# Port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install:all
```

### CORS Errors
- Ensure backend runs on port 5000
- Check `server/index.js` has `app.use(cors())`
- Vite proxy configured in `vite.config.js` for `/api` routes

### API Requests Fail
- Check backend is running: `curl http://localhost:5000/api/health`
- Verify endpoint path matches route in `server/index.js`
- Check query parameters in request
- Review browser Network tab for actual request/response

### Vite HMR Not Working
- Ensure `npm run dev` shows "ready in XXms"
- Check browser console for connection errors
- Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Restart dev server if persists

## Future Enhancements

### Planned Features
- 🌍 Real-time vehicle tracking with live updates
- 🗺️ Interactive maps (Google Maps or Leaflet.js)
- 📧 Email notifications on vehicle status changes
- 💳 Online payment processing
- 📱 Native mobile app (React Native implementation)
- 🔔 Push notifications (mobile)
- 🌙 Dark mode support
- 🗣️ Multi-language internationalization (i18n)
- 📊 Admin dashboard for tow yards
- 🔐 User authentication and search history

### Technical Improvements
- [ ] Migrate mock data to real database (MongoDB/PostgreSQL)
- [ ] Add unit and E2E tests
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement error tracking (Sentry)
- [ ] Add analytics tracking
- [ ] Set up logging system
- [ ] Performance monitoring

## Important Notes for AI Assistants

### When Modifying Code:
1. **Preserve structure:** Keep component/page/route organization consistent
2. **Follow conventions:** Match existing naming, style, and patterns
3. **No breaking changes:** Ensure backward compatibility with existing routes/components
4. **Test locally:** Run `npm run dev` to verify changes work
5. **Update documentation:** Keep this file and DEVELOPMENT.md in sync

### When Adding Features:
- Start with backend route if needed
- Create/update components
- Wire up in App.jsx or appropriate page
- Test frontend and backend integration
- Update API documentation in this file

### Code Review Focus Areas:
- Component props are well-named and documented
- State management is appropriate (no unnecessary state)
- API calls use consistent patterns
- Error handling is present
- Responsive design considered
- CSS follows conventions
- No console errors/warnings

### Database Integration Notes:
When migrating from mock data:
1. Keep API contract the same (same endpoints, response format)
2. Update handlers in `server/routes/vehicles.js`
3. Ensure all fields in responses match mock data models
4. Add proper error handling for database queries
5. Update mock data file or remove if no longer needed

## Quick Reference

### Common Commands
```bash
npm run dev          # Run frontend + backend
npm run server       # Backend only
npm run client       # Frontend only
npm run build        # Build for production
npm install:all      # Install all dependencies
```

### File Locations
- Frontend components: `client/src/components/`
- Pages: `client/src/pages/`
- Styles: `client/src/styles/`
- Backend routes: `server/routes/`
- Mock data: `server/data/mockData.js`
- Server config: `server/index.js`
- Vite config: `client/vite.config.js`

### Port Mappings
- Frontend (Vite): `http://localhost:3000`
- Backend (Express): `http://localhost:5000`
- API Proxy: `/api` → `http://localhost:5000/api`

### Key Files to Know
- `server/index.js` - Route definitions, CORS, server setup
- `server/routes/vehicles.js` - API endpoint handlers
- `server/data/mockData.js` - Sample data
- `client/src/App.jsx` - Page routing logic
- `client/vite.config.js` - Proxy configuration
- `client/src/styles/index.css` - Global styles

---

**Last Updated:** August 26, 2024  
**Maintained by:** dnavadiscipleone@gmail.com  
**Repository:** dnavadiscipleone-ship-it/reachobtand

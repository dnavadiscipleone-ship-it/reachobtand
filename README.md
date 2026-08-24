# 🚗 Vehicle Tow Tracker

A comprehensive web application that helps people locate and track their towed vehicles. Search by license plate or VIN, get real-time location information, view fees, and access tow yard contact details.

## Features

✨ **Core Features:**
- 🔍 **Vehicle Search** - Find towed vehicles by license plate or VIN
- 📍 **Location Tracking** - View tow yard locations with maps
- 💰 **Fee Information** - See all fees (towing, storage, processing)
- 📞 **Quick Contact** - Direct links to tow yard phone numbers
- 🗺️ **Directions** - Get directions to tow yards via Google Maps
- 📊 **Status Tracking** - Check vehicle status (In Yard, Ready for Pickup, Picked Up)
- 📋 **Detailed Information** - Complete vehicle and yard information in one place

## Project Structure

```
vehicle-tow-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── SearchForm.jsx
│   │   │   ├── VehicleCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── TowYardCard.jsx
│   │   │   └── VehicleMap.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── SearchPage.jsx
│   │   │   ├── VehicleDetailsPage.jsx
│   │   │   └── TowYardsPage.jsx
│   │   ├── styles/        # CSS styling
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                 # Node.js/Express backend
│   ├── routes/
│   │   └── vehicles.js    # API endpoints
│   ├── data/
│   │   └── mockData.js    # Mock database
│   ├── index.js           # Server entry point
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Search Vehicles
```
GET /api/vehicles/search?query=ABC1234&type=plate
```
- `query` - License plate or VIN to search
- `type` - Search type: `plate` or `vin`

Response:
```json
{
  "found": true,
  "count": 1,
  "vehicles": [
    {
      "id": "1",
      "licensePlate": "ABC1234",
      "make": "Honda",
      "model": "Civic",
      "year": 2020,
      "status": "in-yard",
      "towYardId": "yard1"
    }
  ]
}
```

### Get Vehicle Details
```
GET /api/vehicles/:id
```

Response:
```json
{
  "id": "1",
  "licensePlate": "ABC1234",
  "vin": "1HGCM82633A123456",
  "make": "Honda",
  "model": "Civic",
  "year": 2020,
  "color": "Silver",
  "status": "in-yard",
  "towedAt": "2024-01-15T10:30:00Z",
  "reason": "Expired meter",
  "location": { "latitude": 40.7580, "longitude": -73.9855 },
  "fees": { "towing": 150, "storage": 25, "processing": 35 },
  "totalFees": 210,
  "hoursInYard": 5,
  "towYard": { ... }
}
```

### Get Tow Yards
```
GET /api/tow-yards
```

Response:
```json
[
  {
    "id": "yard1",
    "name": "Central Tow Yard",
    "address": "123 Industrial Ave, New York, NY 10001",
    "phone": "(212) 555-0100",
    "email": "info@centraltow.com",
    "location": { "latitude": 40.7580, "longitude": -73.9855 },
    "hours": "8:00 AM - 6:00 PM",
    "acceptedPayment": ["Cash", "Credit Card", "Debit Card"],
    "capacity": 500,
    "currentVehicles": 187
  }
]
```

### Update Vehicle Status
```
PUT /api/vehicles/:id/status
```

Request:
```json
{
  "status": "ready-for-pickup"
}
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vehicle-tow-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install:all
   ```

   Or manually:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

### Development

**Start both server and client:**
```bash
npm run dev
```

This runs:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Start only server:**
```bash
npm run server
```

**Start only client:**
```bash
npm run client
```

### Production Build

```bash
npm run build
```

The frontend will be built into `client/dist/`

## Mock Data

The application includes mock data with:
- **3 sample vehicles** with different statuses
- **2 sample tow yards** in New York with realistic details
- Sample fees and location data

To use real data, replace the mock API endpoints in `server/routes/vehicles.js` with actual database queries or API calls.

## Technologies Used

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Styling with custom properties

### Backend
- **Express.js** - Web framework
- **CORS** - Cross-origin requests
- **Node.js** - Runtime environment

## Features in Detail

### 1. Search Functionality
- Search by license plate or VIN
- Real-time search results
- Displays vehicle summary cards

### 2. Vehicle Details
- Complete vehicle information
- All associated fees
- Time in yard calculation
- Vehicle status badge
- Tow yard contact information

### 3. Tow Yard Directory
- List of all tow yards
- Capacity indicators (low/medium/high)
- Contact information
- Operating hours
- Payment methods accepted
- Quick call and directions buttons

### 4. Map Integration
- Visual representation of tow yard locations
- Direct links to Google Maps for navigation
- Coordinates display

### 5. User Experience
- Responsive design for mobile and desktop
- Loading states
- Error handling
- Quick action buttons (Call, Directions)
- Intuitive navigation

## Customization

### Update Mock Data
Edit `server/data/mockData.js` to change:
- Sample vehicles
- Tow yards
- Locations
- Fees

### Add Real Database
Replace mock data with database queries:
```javascript
// Example with a real database
export const searchVehicles = async (req, res) => {
  const { query, type } = req.query;
  const results = await db.vehicles.find({
    [type === 'plate' ? 'licensePlate' : 'vin']: query
  });
  res.json({
    found: results.length > 0,
    count: results.length,
    vehicles: results
  });
};
```

### Styling
All styles are in `client/src/styles/index.css`. Customize colors in the `:root` CSS variables section.

## Future Enhancements

- 🌍 Real-time tracking with live location updates
- 🗺️ Leaflet.js map integration for interactive maps
- 📧 Email notifications when vehicle status changes
- 💳 Online payment processing
- 📱 Native mobile app
- 🔔 Push notifications
- 🌙 Dark mode support
- 🗣️ Multi-language support
- 📊 Admin dashboard for tow yards
- 🔐 User authentication and history

## Deployment

### Heroku
```bash
git push heroku main
```

### Vercel (Frontend only)
```bash
vercel --prod
```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install:all && npm run build
EXPOSE 5000 3000
CMD ["npm", "run", "dev"]
```

## License
MIT License - See LICENSE file for details

## Author
Vehicle Tow Tracker © 2024

## Support
For issues or feature requests, please open an issue in the repository.

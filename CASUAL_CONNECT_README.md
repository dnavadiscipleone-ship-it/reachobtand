# Casual Connect - Dating App

A mobile-first dating application for singles looking for casual encounters. Features location-based discovery, real-time messaging, and safety verification.

## Features

### Core Features
- **Location-Based Discovery**: Find singles near you with customizable search radius
- **Swiping/Matching**: Quick like/pass interface
- **Real-Time Messaging**: Socket.io-powered chat with matches
- **Profile Management**: Upload photos, set interests, and bio
- **Safety & Verification**: Photo verification system for authenticity

### Privacy & Discretion Options
- **Anonymous Mode**: Hide your name from other users
- **Discreet Mode**: Hide photos from non-matches
- **Block/Report Users**: Safety features to block and report inappropriate behavior
- **Location Privacy**: Share location only when needed

### Filters
- Age range filtering
- Interest-based matching
- Location radius customization
- Gender preferences

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Real-time**: Socket.io
- **Auth**: JWT + bcryptjs
- **File Upload**: Multer

### Mobile
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **Real-time**: socket.io-client
- **Storage**: AsyncStorage
- **Camera**: Expo Camera
- **Location**: Expo Location
- **Image Picker**: Expo Image Picker

## Project Structure

```
casual-connect/
├── server/              # Backend API
│   ├── index.js        # Main server file
│   ├── db.js          # Database connection
│   ├── db-schema.sql  # PostgreSQL schema
│   ├── utils/
│   │   ├── auth.js    # Authentication utilities
│   │   └── location.js # Location-based search
│   └── package.json
├── mobile-app/         # React Native mobile app
│   ├── App.js         # Main app component
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DiscoveryScreen.js
│   │   ├── MatchesScreen.js
│   │   ├── MessagesScreen.js
│   │   ├── ProfileScreen.js
│   │   └── VerificationScreen.js
│   ├── app.json       # Expo configuration
│   └── package.json
└── package.json       # Root configuration
```

## Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Expo CLI (for mobile development)

### Backend Setup

1. Create PostgreSQL database:
```bash
createdb casual_connect
```

2. Load schema:
```bash
psql casual_connect < server/db-schema.sql
```

3. Install dependencies:
```bash
cd server
npm install
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Start server:
```bash
npm start
```

### Mobile App Setup

1. Install dependencies:
```bash
cd mobile-app
npm install
```

2. Start Expo:
```bash
npm start
```

3. Choose platform:
   - Android: Press 'a' for Android emulator
   - iOS: Press 'i' for iOS simulator
   - Web: Press 'w' for web

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Discovery
- `GET /api/discover` - Get nearby singles (location + filters)

### Matching
- `POST /api/swipe` - Record like/pass
- `GET /api/matches` - Get all matches

### Messaging
- `GET /api/messages/:matchId` - Get conversation history
- `POST /api/messages` - Send message
- `WS` - Socket.io for real-time messaging

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/photos` - Upload photo
- `POST /api/verify` - Submit verification photo

### Safety
- `POST /api/block` - Block user
- `POST /api/report` - Report user

## Database Schema

### Users Table
- id (primary key)
- email (unique)
- password_hash
- created_at

### Profiles Table
- id (primary key)
- user_id (foreign key)
- display_name
- bio
- age
- gender
- interested_in
- latitude, longitude (for location-based search)
- verified (boolean)
- anonymous_mode (boolean)
- discreet_mode (boolean)
- interests (json/text)
- looking_for (text)

### Matches Table
- id (primary key)
- user_a_id, user_b_id (foreign keys)
- status (pending/accepted/blocked)
- matched_at

### Messages Table
- id (primary key)
- match_id (foreign key)
- sender_id (foreign key)
- content
- read (boolean)
- created_at

### Swipes Table
- id (primary key)
- user_id, profile_id (foreign keys)
- liked (boolean)
- passed (boolean)

### Blocks Table
- id (primary key)
- user_id, blocked_user_id (foreign keys)
- reason
- created_at

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Location-based access control
- Photo verification for authenticity
- Block/report system for safety
- Anonymous mode for privacy
- SQL injection protection via parameterized queries

## Development Tips

### Location Testing
- Use your device's real location or set a mock location in emulator
- Nearby radius defaults to 20km, adjustable in discovery

### Photo Verification
- Must have clear face visible
- No filters or heavy edits
- Good lighting recommended

### Privacy Defaults
- Profiles start with anonymous_mode OFF
- Users can toggle discreet mode anytime
- Location only shared during active session

## Future Enhancements

- Video verification option
- Premium features (see who liked you, etc.)
- Advanced filters (body type, interests, etc.)
- Video chat
- Rating/review system
- Integration with payment for premium features
- Push notifications
- Desktop web version

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, create an issue in the repository.

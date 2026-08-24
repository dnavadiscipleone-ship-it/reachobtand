-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100) NOT NULL,
  bio TEXT,
  age INTEGER,
  gender VARCHAR(50),
  interested_in VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_updated_at TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  verification_photo_url VARCHAR(500),
  anonymous_mode BOOLEAN DEFAULT FALSE,
  discreet_mode BOOLEAN DEFAULT FALSE,
  looking_for TEXT,
  interests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile photos
CREATE TABLE profile_photos (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches (mutual interest)
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  user_a_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  matched_at TIMESTAMP
);

-- Swipes/Likes
CREATE TABLE swipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liked BOOLEAN DEFAULT FALSE,
  passed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, profile_id)
);

-- Messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blocks/Reports
CREATE TABLE blocks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_profiles_location ON profiles(latitude, longitude);
CREATE INDEX idx_swipes_user ON swipes(user_id);
CREATE INDEX idx_matches_user ON matches(user_a_id, user_b_id);
CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_blocks_user ON blocks(user_id);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Doctors/Shows table
CREATE TABLE IF NOT EXISTS shows (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(100),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  total_slots INTEGER NOT NULL,
  available_slots INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  show_id INTEGER REFERENCES shows(id),
  status VARCHAR(20) DEFAULT 'PENDING',
  booked_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  confirmed_at TIMESTAMP,
  version INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_expires ON bookings(expires_at);
CREATE INDEX IF NOT EXISTS idx_shows_time ON shows(start_time);

CREATE TABLE IF NOT EXISTS destinations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  island TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  category_key TEXT NOT NULL,
  category_id TEXT NOT NULL,
  category_en TEXT NOT NULL,
  short_description_id TEXT NOT NULL,
  short_description_en TEXT NOT NULL,
  description_id TEXT NOT NULL,
  description_en TEXT NOT NULL,
  image_url TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  google_maps_url TEXT,
  activities_id TEXT,
  activities_en TEXT,
  best_time_to_visit_id TEXT,
  best_time_to_visit_en TEXT,
  travel_notes_id TEXT,
  travel_notes_en TEXT,
  seed_rating REAL DEFAULT 0,
  seed_review_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  review_text TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id INTEGER NOT NULL UNIQUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

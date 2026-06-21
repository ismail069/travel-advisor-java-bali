CREATE TABLE IF NOT EXISTS destinations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  name_id TEXT,
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
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  google_maps_url TEXT,
  activities_id TEXT,
  activities_en TEXT,
  best_time_to_visit_id TEXT,
  best_time_to_visit_en TEXT,
  travel_notes_id TEXT,
  travel_notes_en TEXT,
  source_name TEXT,
  source_url TEXT,
  seed_rating NUMERIC DEFAULT 0,
  seed_review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_places (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  destination_id INTEGER NOT NULL UNIQUE REFERENCES destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

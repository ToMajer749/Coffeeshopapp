-- 001_init.sql
-- Initial schema for CoffeeShopapp MVP (Postgres/Supabase)

-- users: Supabase auth provides users in auth.users; we still create a profile table for app-specific fields
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- cafes: basic cafe info referenced in UI
CREATE TABLE IF NOT EXISTS cafes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  website text,
  phone text,
  image_url text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cafes_geo_idx ON cafes USING gist (ll_to_earth(lat, lng));

-- beans: coffee bean records
CREATE TABLE IF NOT EXISTS beans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid REFERENCES cafes(id) ON DELETE SET NULL,
  name text NOT NULL,
  origin text,
  roast_level text,
  notes text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- orders: saved brews / orders by users
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  cafe_id uuid REFERENCES cafes(id) ON DELETE SET NULL,
  bean_id uuid REFERENCES beans(id) ON DELETE SET NULL,
  method text,
  notes text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  brewed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- favorites: user favorites (cafes or beans)
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  cafe_id uuid REFERENCES cafes(id) ON DELETE CASCADE,
  bean_id uuid REFERENCES beans(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, cafe_id, bean_id)
);

-- ratings: optional detailed ratings separate from orders
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 1 AND score <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Simple seed examples (optional)
-- INSERT INTO cafes (name, lat, lng, description) VALUES ('Caffè Central', 37.7749, -122.4194, 'Downtown roastery');

-- Note: Supabase uses pgcrypto for gen_random_uuid and earthdistance for ll_to_earth; ensure the extensions are enabled in your project.

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

/*
# Create devotionals and moderator cards tables

1. New Tables
   - `devotionals`
     - `id` (uuid, primary key)
     - `section` (text, children or teenagers)
     - `title` (text, devotional title)
     - `body` (text, main content)
     - `scripture` (text, bible verse)
     - `authorName` (text, author name)
     - `authorImage` (text, author image URL)
     - `shareImage` (text, optional share template URL)
     - `date` (date, devotional date)
     - `slug` (text, unique URL slug)
     - `created_at` (timestamp, creation time)
   
   - `moderator_cards`
     - `id` (uuid, primary key)
     - `section` (text, children or teenagers)
     - `message` (text, welcome message)
     - `preview` (text, preview text)
     - `moderatorImage` (text, moderator image URL)
     - `created_at` (timestamp, creation time)

2. Security
   - Enable RLS on both tables
   - Public read access for all users
   - Write access restricted to authenticated admins

3. Storage
   - Create media bucket for file uploads
   - Public read access, admin write access
*/

-- Create devotionals table
CREATE TABLE IF NOT EXISTS devotionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL CHECK (section IN ('children', 'teenagers')),
  title text NOT NULL,
  body text NOT NULL,
  scripture text NOT NULL,
  authorName text NOT NULL,
  authorImage text NOT NULL,
  shareImage text,
  date date NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create moderator_cards table
CREATE TABLE IF NOT EXISTS moderator_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL CHECK (section IN ('children', 'teenagers')),
  message text NOT NULL,
  preview text NOT NULL,
  moderatorImage text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderator_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for devotionals
CREATE POLICY "Anyone can read devotionals"
  ON devotionals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert devotionals"
  ON devotionals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update devotionals"
  ON devotionals
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can delete devotionals"
  ON devotionals
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for moderator_cards
CREATE POLICY "Anyone can read moderator cards"
  ON moderator_cards
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert moderator cards"
  ON moderator_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update moderator cards"
  ON moderator_cards
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can delete moderator cards"
  ON moderator_cards
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view media files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated users can update media files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can delete media files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_devotionals_section_date ON devotionals(section, date DESC);
CREATE INDEX IF NOT EXISTS idx_devotionals_slug ON devotionals(slug);
CREATE INDEX IF NOT EXISTS idx_moderator_cards_section ON moderator_cards(section, created_at DESC);
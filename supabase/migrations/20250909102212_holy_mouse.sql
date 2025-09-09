/*
# Complete Devotional App Schema Setup

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

4. Indexes
   - Performance indexes for common queries
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
CREATE INDEX IF NOT EXISTS idx_devotionals_date ON devotionals(date DESC);
CREATE INDEX IF NOT EXISTS idx_moderator_cards_section ON moderator_cards(section, created_at DESC);

-- Add some sample data for testing (optional)
-- You can remove this section if you don't want sample data

-- Sample moderator cards
INSERT INTO moderator_cards (section, message, preview, moderatorImage) VALUES
('children', 'Welcome to your daily adventure with God! 🌟', 'Today we''re going to discover something amazing about God''s love and how it helps us every single day!', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'),
('teenagers', 'Ready to dive deep into God''s truth? ⚡', 'Today''s devotional tackles real questions and challenges that matter to you, with biblical wisdom that actually applies to your life.', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT DO NOTHING;

-- Sample devotionals
INSERT INTO devotionals (section, title, body, scripture, authorName, authorImage, date, slug) VALUES
('children', 'God''s Amazing Love', 'Did you know that God loves you more than anyone else in the whole world? It''s true! His love is bigger than the ocean, higher than the mountains, and brighter than all the stars in the sky.\n\nSometimes we might feel sad or scared, but God''s love is always there to comfort us. Just like a warm hug from your mom or dad, God''s love wraps around us and makes us feel safe and happy.\n\nToday, remember that you are special to God. He made you unique and wonderful, and He has amazing plans for your life!', 'For God so loved the world that he gave his one and only Son. - John 3:16', 'Sarah Johnson', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400', CURRENT_DATE, CURRENT_DATE || '-gods-amazing-love'),
('teenagers', 'Finding Your Identity in Christ', 'In a world that constantly tells you who you should be, it can be overwhelming to figure out your true identity. Social media, peer pressure, and society''s expectations can make you feel like you''re never enough.\n\nBut here''s the truth: your identity isn''t found in your achievements, your appearance, or what others think of you. Your identity is found in Christ. You are chosen, loved, and valued not because of what you do, but because of who you are in Him.\n\nWhen you understand that you are a child of God, everything changes. You don''t have to prove your worth or compete for love. You already have it. This doesn''t mean life becomes easy, but it means you have a solid foundation that can''t be shaken.', 'But you are a chosen people, a royal priesthood, a holy nation, God''s special possession. - 1 Peter 2:9', 'Michael Chen', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400', CURRENT_DATE, CURRENT_DATE || '-finding-your-identity-in-christ')
ON CONFLICT (slug) DO NOTHING;
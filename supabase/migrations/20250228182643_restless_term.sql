/*
  # Create contacts table

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `phone` (text)
      - `message` (text)
      - `service_type` (text)
      - `address` (text)
      - `preferred_contact_method` (text)
      - `created_at` (timestamp with time zone, default: now())
      - `status` (text, default: 'new')
  
  2. Security
    - Enable RLS on `contacts` table
    - Add policy for authenticated users to insert data
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  service_type text,
  address text,
  preferred_contact_method text DEFAULT 'email',
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'new'
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert data (for public forms)
CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can read contacts
CREATE POLICY "Authenticated users can read contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update contacts
CREATE POLICY "Authenticated users can update contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
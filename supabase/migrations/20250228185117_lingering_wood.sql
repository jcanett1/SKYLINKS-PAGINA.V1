/*
  # Fix Row Level Security for contacts table

  1. Changes
    - Drop existing RLS policies for contacts table
    - Create new RLS policy that properly allows anonymous inserts
    - Ensure authenticated users can read and update contacts
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can read contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contacts;

-- Re-enable RLS on the contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anonymous users to insert data
CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows authenticated users to read contacts
CREATE POLICY "Authenticated users can read contacts"
  ON contacts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to update contacts
CREATE POLICY "Authenticated users can update contacts"
  ON contacts
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
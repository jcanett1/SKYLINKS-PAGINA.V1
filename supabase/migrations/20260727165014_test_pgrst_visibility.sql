/*
# Test table for PostgREST visibility

Creating a minimal test table to verify PostgREST picks up new tables.

1. New Tables
- `_test_pgrst` — minimal test table
2. Security
- RLS enabled, anon+authenticated can read.
*/

CREATE TABLE IF NOT EXISTS _test_pgrst (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text
);

ALTER TABLE _test_pgrst ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "test_read" ON _test_pgrst;
CREATE POLICY "test_read" ON _test_pgrst FOR SELECT
  TO anon, authenticated USING (true);

GRANT SELECT ON _test_pgrst TO anon;
GRANT SELECT ON _test_pgrst TO authenticated;

NOTIFY pgrst, 'reload schema';

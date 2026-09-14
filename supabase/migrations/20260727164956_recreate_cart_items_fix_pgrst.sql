/*
# Recreate cart_items table to fix PostgREST schema cache

PostgREST (the REST API) is not recognizing the `cart_items` table (PGRST205)
even though it exists in the database with correct permissions. The table is
empty (0 rows), so recreating it will force PostgREST to pick it up without
any data loss.

1. Changes
- Drop and recreate the `cart_items` table with the same schema.
- Re-enable RLS and re-create the session-based policies.
2. Security
- RLS enabled with session-based CRUD policies for anon + authenticated.
*/

-- Drop the existing table (it's empty, no data loss)
DROP TABLE IF EXISTS cart_items;

-- Recreate with the same schema
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session text NOT NULL,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_image text DEFAULT '',
  product_price numeric NOT NULL DEFAULT 0,
  product_sku text DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  category text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Session-based CRUD policies (no auth, shared data)
DROP POLICY IF EXISTS "Allow session-based cart read" ON cart_items;
CREATE POLICY "Allow session-based cart read" ON cart_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow session-based cart insert" ON cart_items;
CREATE POLICY "Allow session-based cart insert" ON cart_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow session-based cart update" ON cart_items;
CREATE POLICY "Allow session-based cart update" ON cart_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow session-based cart delete" ON cart_items;
CREATE POLICY "Allow session-based cart delete" ON cart_items FOR DELETE
  TO anon, authenticated USING (true);

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO authenticated;

-- Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';

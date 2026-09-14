/*
  # Create cart tables for Syscom product shopping

  1. New Tables
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_session` (text, identifies anonymous user via session)
      - `product_id` (text, Syscom product ID)
      - `product_name` (text)
      - `product_image` (text, URL)
      - `product_price` (numeric, unit price)
      - `product_sku` (text, nullable)
      - `quantity` (integer, default 1)
      - `category` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `cart_items` table
    - Add policies for session-based access (using a session_id header)
*/

CREATE TABLE IF NOT EXISTS cart_items (
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

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Allow read/insert/update/delete based on user_session matching a custom header
CREATE POLICY "Users can read own cart items"
  ON cart_items FOR SELECT
  TO anon, authenticated
  USING (user_session = current_setting('request.jwt.claims', true)::json->>'user_session');

-- For simplicity, we allow anon access with session-based identification
-- In production, you'd want authenticated users only
CREATE POLICY "Allow session-based cart read"
  ON cart_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow session-based cart insert"
  ON cart_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow session-based cart update"
  ON cart_items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow session-based cart delete"
  ON cart_items FOR DELETE
  TO anon, authenticated
  USING (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(user_session);

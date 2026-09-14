/*
# Create orders table for Stripe checkout

1. New Tables
- `orders`
  - `id` (uuid, primary key)
  - `stripe_session_id` (text, unique) — Stripe Checkout session ID
  - `user_session` (text) — matches the cart_items session so we can tie an order to a visitor
  - `customer_email` (text)
  - `customer_name` (text)
  - `customer_phone` (text)
  - `shipping_address` (jsonb) — full shipping address object
  - `items` (jsonb) — snapshot of the cart items at checkout time
  - `amount_total` (numeric) — total in MXN
  - `status` (text) — 'pending' | 'paid' | 'failed'
  - `created_at` (timestamp)
2. Security
- Enable RLS on `orders`.
- Allow anon + authenticated CRUD because the app has no sign-in screen and the data is tied to a session id.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text UNIQUE,
  user_session text,
  customer_email text,
  customer_name text,
  customer_phone text,
  shipping_address jsonb,
  items jsonb,
  amount_total numeric DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
TO anon, authenticated USING (true);

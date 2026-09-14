/*
# Force PostgREST to recognize cart_items table

PostgREST schema cache is not picking up the cart_items table (PGRST205).
This migration makes a no-op ALTER TABLE change to force PostgREST to
re-read the schema for this table.

1. Changes
- Add and immediately drop a temporary column on cart_items to force schema cache refresh.
2. Security
- No data changes. No RLS changes.
*/

-- Add a temp column then drop it — this forces PostgREST to re-read the table schema
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS _schema_refresh_tmp boolean DEFAULT false;
ALTER TABLE cart_items DROP COLUMN _schema_refresh_tmp;

-- Notify PostgREST to reload
NOTIFY pgrst, 'reload schema';

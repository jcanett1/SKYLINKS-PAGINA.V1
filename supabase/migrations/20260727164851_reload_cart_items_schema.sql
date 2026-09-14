/*
# Force PostgREST schema cache reload for cart_items

The `cart_items` table exists in the database but PostgREST (the REST API)
does not have it in its schema cache, returning PGRST205 ("Could not find the
table 'public.cart_items' in the schema cache"). This migration re-grants
permissions to the anon/authenticated roles and forces a schema reload so
the table becomes visible through the REST API.

1. Changes
- Re-grant CRUD on `cart_items` to `anon` and `authenticated`.
- Re-grant USAGE on `public` schema to `anon` and `authenticated`.
- Send NOTIFY to reload PostgREST schema cache.
2. Security
- No RLS policy changes. Existing policies remain intact.
*/

-- Ensure schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Re-grant table privileges (idempotent)
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO authenticated;

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

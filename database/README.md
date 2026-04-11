# Database Folder

This folder is the schema source of truth for the MOON backend.

## Structure

- `migrations/` stores ordered SQL schema changes.
- `seeds/` stores bootstrap data for catalog and shipping zones.

## Apply Order

Run the files in this order:

1. `migrations/0001_extensions.sql`
2. `migrations/0002_core_schema.sql`
3. `migrations/0003_updated_at_triggers.sql`
4. `seeds/0001_products.sql`
5. `seeds/0002_shipping_zones.sql`

## Notes

- The schema is written for Supabase Postgres.
- `payments.order_id` is the canonical order-to-payment relationship.
- Product and shipping bootstrap data lives only in `seeds/` to avoid duplicating backend source-of-truth catalog data in application code.

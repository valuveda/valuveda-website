# Database Foundation

PostgreSQL is the target relational database. The Phase 1 data model covers customers, profiles, addresses, products, variants, categories, images, inventory, carts, orders, order snapshots, payments, refunds, shipments, tracking, shipping providers, discount rules, coupons, staff roles, permissions, audit logs, and webhook events.

The executable ORM schema will be maintained as a separate database migration artifact before a database is provisioned. No production database is connected in Phase 1.

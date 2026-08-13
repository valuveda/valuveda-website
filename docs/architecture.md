# ValuVeda Wellness — Phase 1 Architecture

## Application boundary

The existing static website remains at the repository root. The new application foundation is additive and is not yet the public storefront migration.

Target structure:

- `src/` — future Next.js application and domain modules
- `src/pages/api/` — server-side API boundary during the foundation stage
- `src/domain/` — provider-independent business contracts
- `database/` — PostgreSQL schema documentation and future migration artifacts
- `assets/` — existing website assets, preserved

## Core principles

1. ValuVeda's PostgreSQL database is the master source of truth for orders.
2. Payment and shipping providers are external integrations behind provider contracts.
3. Shipping uses an adapter abstraction so Shipmozo, Shiprocket, Delhivery, Blue Dart, DTDC, or another provider can be added without changing core order logic.
4. Order, payment, shipment, and COD verification state are separate concerns.
5. Historical order items store immutable product, price, discount, tax, and shipping snapshots.
6. COD verification is manual and performed by authorized staff; no OTP or penny-payment verification is enabled in Phase 1.
7. Secrets are server-only and are never committed to source control.
8. Phase 1 makes no real payment or shipping API calls.

## Existing website preservation

The existing HTML, CSS, JavaScript, policy pages, CNAME, and assets are intentionally preserved. The migration to Next.js storefront routes is a later phase.

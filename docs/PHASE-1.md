# Phase 1 — Production Foundation

This branch contains the production-foundation scaffolding for the ValuVeda Wellness platform. The existing static website and its assets remain unchanged.

## Scope

- Next.js + TypeScript application foundation
- PostgreSQL/Prisma schema foundation
- Authentication and authorization interfaces only
- Provider-independent shipping interfaces only
- Payment interfaces only; no live payment calls
- COD verification state foundation; manual verification only
- Audit and webhook idempotency foundations

## Out of scope

- Customer login UI
- Checkout
- Razorpay live integration
- Shipping-provider API calls
- Complete admin panel
- Production deployment

## Secrets

Never commit credentials. Use environment variables or an external secret manager. See `.env.example`.

# ValuVeda Ecommerce Implementation

## Safety boundary
- Production `main` must never be modified by this work.
- Production Supabase must never be accessed or migrated.
- Development work targets the ecommerce development branch only.
- Never commit passwords, API secrets, OTP secrets, payment keys, shipping credentials, or service-role keys.
- Integrations must use server-side environment variables and provider adapters.
- If a live credential is unavailable, implement and test the adapter with mocks; do not block the rest of the application.

## Current baseline
The project already contains the Next.js application, Prisma foundation, catalog/order helpers, customer/admin route areas, and a basic Admin 1 dashboard. Build on these pieces rather than replacing them.

## Target modules
1. Customer authentication and sessions
2. Catalog/product detail and configurable pricing
3. Cart and checkout
4. Customer addresses and account/order history
5. Order lifecycle and unique order numbers
6. Payment abstraction: Razorpay + COD
7. Shipping abstraction: Shipmozo + tracking events
8. Branches and branch-scoped inventory
9. Coupons and server-side discount engine
10. Admin 1 dashboard
11. Staff RBAC: Super Admin, Admin, Branch Manager, Branch Employee
12. Customers, orders, products, inventory, coupons, payments and shipments management
13. Notifications abstraction: WhatsApp/SMS/email
14. Audit logs
15. Validation, error handling, rate limiting and security controls
16. Automated tests, typecheck, lint and production build

## Commercial rules
- Product: ValuVeda Wellness Karela Jamun Powder, 200g.
- Current displayed MRP: ₹2,499.
- Current offer price: ₹1,499.
- Configurable first-order discount: ₹100.
- Configurable pack-of-2 discount: ₹250.
- Configurable pack-of-3 discount: ₹500.
- Do not hard-code discounts into the UI; calculate them server-side and make them admin-configurable.
- Use only verified product-label claims/content; never invent medical claims, certifications or ingredients.

## Order architecture
Keep Order, Payment and Shipment as separate state machines linked to the order. The ValuVeda database creates the master order first. A payment-provider order/reference is created afterward. Webhooks must be idempotent and verified server-side.

## Branch architecture
Every inventory-affecting operation must have a branch context. Branch managers/employees can only access authorized branches. Super Admin/Admin can manage all branches according to role permissions.

## Definition of done
- No placeholder buttons for core workflows.
- Every core admin module has real server-side data operations or an explicit, documented provider-mock boundary.
- Customer can browse product, add to cart, checkout, select COD/online payment, create an order, and view order status when configured.
- Admin can manage products, orders, customers, inventory, coupons, payments, shipments, branches and staff permissions.
- Tests cover pricing/discounts, inventory reservation, order creation, authorization and webhook idempotency.
- `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- Database migration generation/validation must not contain destructive reset/drop/truncate operations.

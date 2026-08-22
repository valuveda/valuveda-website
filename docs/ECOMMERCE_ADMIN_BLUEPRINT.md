# ValuVeda Ecommerce + Admin Blueprint

## Scope

This branch is the isolated foundation for the next ValuVeda ecommerce system. The existing static website remains preserved and is not the migration target.

## Customer identity

- Mobile OTP login and email/password or magic-link login are both supported paths.
- A customer may link both phone and email to one customer record.
- Guest checkout can be supported, with optional account creation after order placement.
- Never store OTPs or raw passwords in application tables.

## Order creation

Every successful checkout creates a ValuVeda master order before external payment/shipping operations.

Order ID format should be human-friendly and unique, for example `VV-YYYYMMDD-XXXXXX`. The implementation must enforce uniqueness in the database and must not use a timestamp alone.

Order record should retain:
- customer
- delivery address snapshot
- line-item snapshots
- subtotal
- discount
- shipping charge
- grand total
- payment method/status
- shipment/provider/status
- branch assignment
- timestamps

## Customer order tracking

Customer dashboard:
- My Orders
- Order ID
- order date
- items and quantity
- payment status
- fulfillment status
- shipment status
- tracking number when available
- courier/provider name
- tracking link when available
- invoice
- delivery address
- reorder
- support/contact action

A public tracking page may support Order ID + verified phone/email rather than exposing private customer data.

## Admin roles

### SUPER_ADMIN / ADMIN 1

Full control:
- dashboard
- products
- product media/content
- pricing
- inventory
- customers
- orders
- payments
- refunds
- coupons
- shipping providers
- courier selection
- branches
- employees
- roles/permissions
- reports
- settings
- audit logs

### BRANCH_MANAGER

Only assigned branch:
- branch orders
- branch inventory
- packing/dispatch operations
- branch customers when operationally necessary
- branch employees
- branch-level reports

Cannot manage global security, other branches, global payment settings, or production credentials unless explicitly granted.

### BRANCH_EMPLOYEE

Least-privilege operational access:
- view assigned branch orders
- update permitted fulfillment steps
- packing/dispatch checklist
- inventory actions allowed by role
- view limited customer delivery information needed for fulfillment

Cannot:
- change global prices
- manage coupons
- change payment credentials
- manage users/roles
- view other branches
- access secrets

## Permission model

Use RBAC plus branch scoping. Do not hard-code role checks throughout UI code.

Permission examples:
- orders.read
- orders.update
- orders.cancel
- payments.read
- refunds.create
- inventory.read
- inventory.adjust
- products.read
- products.write
- coupons.read
- coupons.write
- shipping.read
- shipping.dispatch
- customers.read
- staff.read
- staff.manage
- branches.manage
- settings.manage
- audit.read

Every sensitive admin mutation must create an audit event containing actor, action, target type/id, branch scope, timestamp and safe metadata. Never store secrets in audit logs.

## Shipping integration architecture

Do NOT couple the application permanently to Shipmozo.

Create a provider adapter interface such as:

- createShipment
- cancelShipment
- generateLabel
- getTracking
- getRates
- serviceability
- syncStatus

Shipmozo is the first provider adapter. Additional courier/aggregator providers can be added without changing the order model.

The shipment record should store provider name, provider shipment ID, AWB/tracking number, status, label reference, and safe provider metadata.

## Payment integration architecture

Use a payment adapter interface. Razorpay is the first provider, but the order system must not depend directly on Razorpay-specific fields.

Flow:
1. Create ValuVeda order.
2. Create external payment order.
3. Send checkout to customer.
4. Verify payment signature/server response.
5. Update payment state.
6. Only then progress fulfillment according to business rules.

Support future payment providers without changing the order lifecycle.

## Order lifecycle

Order, Payment and Shipment have separate state machines.

Order examples:
PENDING, CONFIRMED, PROCESSING, PACKED, SHIPPED, DELIVERED, CANCELLED, RETURNED

Payment examples:
PENDING, PAYMENT_PENDING, PAID, PAYMENT_FAILED, REFUNDED, COD_PENDING_VERIFICATION

Shipment examples:
PENDING, READY_TO_SHIP, SHIPPED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURNED, FAILED

Do not collapse these into one status column.

## Multi-branch architecture

Core entities should support a branch ID where operational ownership matters.

Initial branch model:
- branches
- branch_staff
- branch_inventory
- branch_order_assignment

A future branch must be addable through admin without rewriting the database design.

## Inventory

Track:
- product
- branch
- available quantity
- reserved quantity
- damaged quantity
- reorder threshold
- inventory movement history

Every manual adjustment records actor and reason.

## Coupons and pricing

Pricing engine should support rules rather than hard-coded buttons.

Current business rules discussed:
- first order: ₹100 discount
- pack of 2: ₹250 discount
- pack of 3: ₹500 discount

Rules must be validated server-side. The client cannot decide the final payable amount.

## Notifications

Use provider adapters for:
- WhatsApp
- SMS
- email

Events may include order created, payment received, packed, shipped, out for delivery, delivered, cancelled and refund updates.

## Security boundaries

- Production credentials are never used in this branch's development validation.
- Secrets only enter server-side runtime environments.
- Never commit `.env` files containing real values.
- Never log connection strings, passwords, tokens or OTPs.
- Admin routes require server-side authorization, not only hidden UI buttons.
- Branch employees must be filtered server-side by branch scope.
- Customer data returned by tracking endpoints must be minimized.

## Build order

1. Preserve existing website.
2. Establish application shell and design system.
3. Establish Prisma/domain model in Development.
4. Implement authentication foundation.
5. Implement products/catalog.
6. Implement cart and pricing engine.
7. Implement order creation and Order ID generation.
8. Implement customer orders/tracking.
9. Implement Admin 1.
10. Implement Branch Manager/Employee permissions.
11. Implement payment provider adapter.
12. Implement shipping provider adapter.
13. Implement notifications.
14. Add audit logs and reporting.
15. Run typecheck/lint/tests/build and end-to-end validation.

## Non-goals for this isolated branch

- No Production migration.
- No Production database writes.
- No replacement of the existing live website before the new system is reviewed and verified.
- No Phase 2 work unless explicitly authorized after the current foundation is accepted.

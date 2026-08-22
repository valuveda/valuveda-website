# ValuVeda Next Website & Admin Foundation

This branch is intentionally separate from the currently working public website.

## Goal
Build a premium, long-form ValuVeda Wellness ecommerce experience inspired by the information depth and conversion flow of leading Ayurvedic product pages, while using original ValuVeda branding, content and assets.

## Public experience
- Premium sticky header and mobile navigation
- High-impact product hero with authentic product photography
- MRP ₹2,499 and current offer price ₹1,499
- Buy Now / WhatsApp / Amazon CTAs
- Trust strip: 15+ herbs, No Added Sugar where label confirms, GMP/FSSAI/lab-tested claims only where documented
- Ingredient storytelling for the approved 15+ herb formulation
- Product benefits expressed as responsible wellness support, never disease-cure guarantees
- How-to-use section using approved label directions
- Quality/manufacturing trust section
- Product gallery
- Shipping and replacement information
- FAQ accordion
- Customer reviews only when genuine/approved
- Strong final CTA and premium footer
- Mobile-first responsive design
- Lightweight botanical motion/video support

## Ecommerce foundation
Next-generation application should be prepared for:
- Customer mobile/OTP authentication
- Product catalog
- Product variants/packs
- Cart
- Coupon rules
- Checkout
- Orders
- Payments
- Shipping
- Notifications
- Inventory
- Customer order history
- Admin dashboard
- Staff roles/RBAC
- Audit logs
- Analytics

## Order architecture
Keep Order, Payment and Shipment state machines separate.

Order states may include:
PENDING, CONFIRMED, PROCESSING, PACKED, CANCELLED, RETURNED.

Payment states may include:
PENDING, PAYMENT_PENDING, PAYMENT_FAILED, PAID, COD_PENDING_VERIFICATION.

Shipment states may include:
PROCESSING, SHIPPED, IN_TRANSIT, DELIVERED, RETURNED.

## Integrations
- Razorpay: ValuVeda creates the master order first, then Razorpay order/payment is created and verified.
- Shipmozo: shipping creation, AWB, tracking and shipment lifecycle.
- Amazon: external purchase option where appropriate.
- WhatsApp: direct assisted-order CTA.

## Admin panel
Admin should eventually provide:
- Dashboard
- Products
- Inventory
- Orders
- Customers
- Coupons
- Payments
- Shipments
- Staff/Roles/Permissions
- Audit log
- Settings

## Database foundation
Use PostgreSQL + Prisma.
Planned domains include:
customers, products, inventory, carts, orders, payments, shipments, coupons, staff_users, roles, permissions, audit_logs.

## Safety boundary
- This branch must not replace the existing public website until separately reviewed.
- Never touch Production Supabase.
- Never expose secrets.
- Never start Phase 2 work from the Phase 1 branch.
- Never invent medical claims, reviews, certifications or product information.
- Use approved label/product data as the source of truth.

## Existing public website
The current public website remains the source of truth while this new experience is developed. Do not delete or rewrite the existing public pages merely to build the next version.

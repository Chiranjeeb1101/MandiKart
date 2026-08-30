# FarmDirect — Project Master Guide
**SIH 26033 · Ministry of Consumer Affairs, Food & Public Distribution (DoCA)**
**Theme:** Agriculture, FoodTech & Rural Development

> This is the single source of truth for the whole team. Frontend and backend devs each have their own deep-dive guide (`01_FRONTEND_DEV_GUIDE.md`, `02_BACKEND_DEV_GUIDE.md`) — **but everyone reads this file first.** It defines the things that must never diverge between apps: the order state machine, the data model, the API contract shape, and the team workflow.

---

## 1. Problem → Solution, in one paragraph

Farmers lose margin to intermediaries; consumers pay inflated prices; nobody has visibility into the supply chain. FarmDirect is a 4-surface digital marketplace — **Farmer App, Buyer App (consumer + bulk), Logistics Web, Admin Web** — connected through one backend, that lets farmers list produce directly, lets buyers (retail or bulk) discover and negotiate with farmers/FPOs, and lets an AI-assisted logistics layer aggregate scattered pickups into optimized, freshness-aware delivery routes. Admin gets full-platform visibility and dispute/finance control.

**The one-line pitch:** *"We don't just connect farmers and buyers — we help farmers decide what to sell, at what price, to whom, and how to get it delivered efficiently."*

---

## 2. System Architecture (canonical)

```
                    ┌────────────────────┐   ┌────────────────────┐
                    │   FARMER APP        │   │  BUYER APP          │
                    │ (RN + Expo)          │   │ (RN + Expo)          │
                    │ consumer + bulk modes│
                    └──────────┬──────────┘   └──────────┬──────────┘
                               │                          │
                               │        REST/HTTPS         │
                               ▼                          ▼
                    ┌──────────────────────────────────────────┐
                    │            BACKEND API (Node.js)           │
                    │  Auth · Users · Products · Orders ·        │
                    │  Negotiations · Payments · Logistics ·     │
                    │  Notifications · Disputes · AI-gateway     │
                    └───────────────────┬────────────────────────┘
                                         │
                     ┌───────────────────┼───────────────────┐
                     ▼                   ▼                   ▼
              ┌─────────────┐    ┌───────────────┐   ┌────────────────┐
              │  SUPABASE    │    │  AI SERVICE    │   │  ADMIN WEB /    │
              │  Postgres    │    │  (forecast,    │   │  LOGISTICS WEB   │
              │  Auth        │    │  matching,     │   │  (React, Vite)   │
              │  Storage     │    │  routing)      │   └────────────────┘
              └─────────────┘    └───────────────┘
```

**Hard rule:** No app talks to Supabase directly for writes that affect other apps' data (e.g. order state, payments, inventory). All cross-entity writes go through the backend API so business rules and the state machine are enforced in one place. Read-only, user-scoped reads (e.g. a farmer reading their own profile) *may* go via Supabase client SDK + Row Level Security (RLS) directly — see Backend Guide §4 for exactly which reads are allowed to bypass the API.

**Why this fixes a real gap:** in the original feature docs, Admin, Farmer, Buyer, and Logistics each described order status independently with different labels. If each app is allowed to write order status directly to Supabase, you will get four different, contradictory pictures of the same order live on stage. The backend is the only writer of order state. Full stop.

---

## 3. Canonical Order State Machine

This is the **single state machine** every app must map its UI onto. Internally, only these states exist. Each app can *label* them differently for its audience, but the underlying `order_status` enum is fixed.

```
PLACED
  → CONFIRMED          (farmer/suppliers accept)
  → PICKUP_SCHEDULED    (logistics assigns vehicle/driver)
  → PICKUP_IN_PROGRESS
  → COLLECTED           (all required pickups done — relevant for aggregated bulk orders)
  → IN_TRANSIT
  → DELIVERED           (proof of delivery captured: OTP/photo/signature)
  → COMPLETED            (payment settled, ratings allowed)

Side states (can be entered from most points above):
  CANCELLED
  FAILED            (pickup or delivery failed — triggers Exception Management)
  DISPUTED          (raised by buyer or farmer — freezes COMPLETED until resolved)
```

| Internal state | Farmer App label | Buyer App label | Logistics label | Admin label |
|---|---|---|---|---|
| PLACED | New Order | Placed | Order Received | New |
| CONFIRMED | Accepted | Confirmed | Pickup Required | Confirmed |
| PICKUP_SCHEDULED | Ready for Pickup | Packed | Vehicle/Driver Assigned | Preparing |
| PICKUP_IN_PROGRESS | Pickup in progress | Packed | Pickup | Pickup |
| COLLECTED | Picked Up | Out for Delivery (prep) | Collected | In Transit (staging) |
| IN_TRANSIT | In Transit | Out for Delivery | In Transit | In Transit |
| DELIVERED | Delivered | Delivered | Delivered | Delivered |
| COMPLETED | Payment Received | Completed | — | Completed |

**Bulk order nuance:** an aggregated bulk order (multiple farmers → one buyer requirement) has a parent `order_id` and N child `pickup_id`s, each with its own sub-state (`PICKUP_SCHEDULED → PICKUP_IN_PROGRESS → COLLECTED`). The parent order only advances to `COLLECTED` when all child pickups reach `COLLECTED`. This is the piece of engineering to prototype earliest — see §7 Phase Plan.

---

## 4. Canonical Data Model (entity summary)

Full column-level schema lives in the Backend Guide. This is the shape every dev needs in their head:

- **User** (base identity) → has role: `farmer | consumer | bulk_buyer | logistics_staff | admin`
- **Farmer** (extends User) → farm_location, verification_status, fpo_id (nullable)
- **FPO** → members[Farmer], collective inventory
- **Buyer** (extends User) → mode: `consumer | bulk`, business_details (nullable, for bulk)
- **Product** (a farmer's listing) → crop, quantity, price, quality_grade, harvest_date, status
- **Negotiation** → product_id, buyer_id, farmer_id, offer_history[], status (`open|accepted|rejected`), links to Order once accepted
- **Order** → buyer_id, status (canonical enum above), total_amount, delivery_address, `is_bulk` flag
- **OrderItem / Pickup** → order_id, farmer_id, product_id, quantity, pickup_location, pickup_status
- **Payment** → order_id, amount, status, settlement_to (farmer payout), method
- **Vehicle**, **Driver**, **Route** → logistics-owned entities, referenced by Pickup/Order
- **Dispute** → order_id, raised_by, category, evidence[], resolution
- **Notification** → user_id, type, payload, read_status
- **AI outputs** (not user-editable): DemandForecast, PriceSuggestion, SpoilageRisk, MatchScore, OptimizedRoute — all keyed to product_id / order_id, generated by the AI service, stored for the frontend to read

**Gap fixed:** the original docs never defined which entity *owns* a negotiation record or how it becomes an order. Rule: a `Negotiation` is a pre-order object. When `status = accepted`, the backend atomically creates an `Order` (and `OrderItem`s) referencing the agreed price/quantity, and marks the negotiation `closed`. Never let the frontend create an Order directly from a negotiation UI — always through the `/negotiations/:id/accept` endpoint, which does this atomically.

---

## 5. Role & Module Ownership Matrix

| Module | Owner | Notes |
|---|---|---|
| Vehicle/Driver assignment (create/reassign) | **Logistics Web only** | Admin can *view and request* reassignment, never assign directly |
| Order status transitions | **Backend only** (triggered by role-scoped endpoints) | No app writes `order_status` directly to DB |
| Dispute resolution (final) | **Admin only** | Farmer/Buyer/Logistics can raise & attach evidence, not resolve |
| Product listing approval | **Admin** (moderation), **Farmer** (creation) | |
| Payment settlement trigger | **Backend**, on `DELIVERED` + no open dispute → auto-queues farmer payout | Admin can manually override/hold |
| FPO collective inventory | **Farmer App** (member-facing), aggregated view in **Admin** | |

---

## 6. Team Coordination Workflow (Antigravity + Git)

### 6.1 What "Antigravity" is in this project's context
Antigravity is the agentic dev environment/IDE the team is building in. Treat every Antigravity session as a *scoped agent task*, not a free-form chat — give it a clearly bounded objective, the relevant file paths, and the contract (API shape / state machine / schema) it must not violate. The "path finder" pattern below is how every team member should open a task.

### 6.2 The Path-Finder Prompt (use this to start every Antigravity task)
Copy, fill in the brackets, paste as the first message of any Antigravity session:

```
CONTEXT: FarmDirect (SIH 26033) — [Farmer App | Buyer App | Logistics Web | Admin Web | Backend API]
REPO ROOT: [path]
RELEVANT DOCS: 00_PROJECT_MASTER_GUIDE.md §[section], 0[1|2]_[FRONTEND|BACKEND]_DEV_GUIDE.md §[section]
GOAL: [one sentence — the single outcome of this session]
SCOPE (files/folders this task is allowed to touch): [list]
DO NOT TOUCH: [list — e.g. "order_status enum, auth middleware, shared /types folder"]
CONTRACT CONSTRAINTS:
  - Order state machine must match 00_PROJECT_MASTER_GUIDE.md §3 exactly
  - API request/response shapes must match 02_BACKEND_DEV_GUIDE.md §5
  - [any endpoint/schema this task depends on]
DEFINITION OF DONE: [bullet list — e.g. "screen renders with mock data", "endpoint returns 200 with shape X", "unit test passes"]
```

This prevents the single most common agentic-coding failure mode on multi-app projects: an agent "helpfully" renaming an enum, changing a response shape, or inventing a new order status because it wasn't told the contract is fixed.

### 6.3 Branching & PR discipline
```
main                    → always demoable
  ├── feature/farmer-*       (Farmer App)
  ├── feature/buyer-*        (Buyer App)
  ├── feature/logistics-*    (Logistics Web)
  ├── feature/admin-*        (Admin Web)
  └── feature/api-*          (Backend)
```
- Any change to `order_status` enum, the shared TypeScript types package, or Supabase schema **requires a PR reviewed by both a frontend and a backend dev**, tagged `contract-change`.
- Backend merges to `main` should be tagged with a short CHANGELOG entry so frontend devs know when to re-pull generated types.

### 6.4 Shared contract source of truth
Keep one `shared/types` (or OpenAPI/Postman collection) package that both frontend apps and backend import from / validate against, so a status enum or field rename can't silently drift between a React Native screen and an Express route. This is the single highest-leverage fix for the inconsistencies found in the original docs.

---

## 7. Security Review Checklist (project-wide)

| Area | Risk if ignored | Required control |
|---|---|---|
| Auth tokens | Token replay, session hijack | Short-lived JWT + refresh token rotation via Supabase Auth; never store raw tokens in AsyncStorage unencrypted — use `expo-secure-store` |
| OTP verification | OTP brute force | Rate-limit OTP requests per phone number (e.g. 3/10min), 6-digit OTP, 5-min expiry, server-side attempt counter |
| Role-based access | Farmer editing another farmer's product, buyer viewing another buyer's orders | Every backend route enforces `req.user.id` ownership + Supabase RLS policies mirror the same rule (defense in depth) |
| File/image uploads (produce photos, delivery proof, ID docs) | Malicious file upload, unbounded storage cost | Validate MIME type + size server-side (not just client), store in Supabase Storage buckets with per-role RLS, generate signed URLs with short expiry rather than public buckets |
| Payment data | PCI exposure | Never store raw card/UPI credentials — use a payment gateway (Razorpay/Stripe) tokenized flow; backend only stores transaction refs and status |
| Admin panel | Privilege escalation | Admin role check server-side on every admin route, not just hidden UI; log all admin actions (audit trail) for dispute/finance actions |
| Negotiation/chat | Price manipulation, spam | Server validates offer values are within sane bounds before persisting; rate-limit offer creation |
| Location data | Farmer/buyer location leaked to unrelated parties | Only expose precise farm/delivery coordinates to the counterparties of an active order, not in public listings (public listings show approximate area/distance only) |
| API surface | Injection, mass-assignment | Input validation (zod/Joi) on every endpoint; never spread raw `req.body` into a DB write |
| Secrets | Leaked keys in mobile bundle | Supabase anon key is fine client-side (RLS protects it), but service-role key, AI API keys, payment gateway secret keys must **never** ship in the RN/Expo bundle — backend-only |
| CORS | Admin/Logistics web open to any origin | Lock CORS to known frontend origins in production |

---

## 8. Scalability & System Design Notes

- **Read-heavy endpoints** (product search/browse) — add pagination + indexed filters (crop, location, price) from day one; don't let this become a full-table scan as listings grow.
- **AI service isolation** — run demand forecasting / route optimization / matching as a separate service (or serverless function) behind an internal API, not inline in the main request path. Route optimization especially can be slow; make it async (job queue → notify when ready) rather than blocking an HTTP request.
- **Notifications** — use a queue (even a simple Postgres-backed job table or Supabase Edge Function + cron) rather than firing pushes synchronously inside business-logic requests.
- **Bulk order aggregation** — this is the most write-contention-prone flow (multiple farmers confirming pickups against one parent order concurrently). Use DB transactions / row locks when updating aggregate quantity collected, to avoid race conditions under concurrent pickups.
- **Caching** — cache read-mostly reference data (crop categories, regional price averages) with a short TTL; don't hit Postgres for static lookups on every screen load.
- **Horizontal readiness** — keep the Node backend stateless (no in-memory session state) so it can scale horizontally behind a load balancer later even if you run a single instance for the demo.

---

## 9. Phase-by-Phase Plan

### Phase 0 — Foundation (before any feature UI)
- Finalize Supabase schema + RLS policies (Backend Guide §3–4)
- Stand up shared `types` package (order states, entities, API response shapes)
- Auth flow working end-to-end (register/login/OTP) for one role, reused for others
- CI: lint + type-check on PR for all 4 apps + backend

### Phase 1 — V1 Core Marketplace (demo-critical path)
Goal: **Registration → Add Produce → Discover → Negotiate → Order → Pickup → Deliver → Payment status → Admin view** works end-to-end for one non-bulk order.
- Farmer: auth, profile, add/edit product, view orders
- Buyer (consumer mode): browse/search, product detail, cart, place order
- Negotiation (both apps): offer/counter/accept → auto-creates Order
- Logistics: manual pickup/delivery status updates (no optimization yet)
- Admin: dashboard, order list/detail, farmer/buyer verification
- **Milestone demo:** one full order lifecycle, correct status shown consistently across all 4 apps

### Phase 2 — Bulk + AI differentiators (your competitive edge)
- Bulk buyer requirement posting + supplier discovery
- Order aggregation engine (parent order + child pickups, concurrency-safe)
- AI: demand forecasting, price intelligence, spoilage risk, buyer/supplier matching
- Logistics: route optimization (multi-pickup), freshness-aware prioritization
- **Milestone demo:** one bulk order fulfilled by 2–3 farmers, optimized route shown

### Phase 3 — Trust, payments, polish
- Digital payments integration (gateway) + farmer settlement
- Dispute management (raise → evidence → admin resolve)
- Ratings & reviews
- Live tracking (map) for delivery
- Notifications (push) across all flows
- Advanced analytics dashboards (Admin, Farmer earnings, Bulk buyer procurement)

### Phase 4 — Build hardening (pre-submission)
- EAS build config finalized for both RN apps (see Frontend Guide §6 for APK pitfalls)
- Security checklist (§7 above) walked line-by-line
- Load-test critical endpoints (order placement, negotiation accept)
- Final demo script rehearsed against the canonical state machine (no surprises live)

---

## 10. Open Items / Decisions Needed From You
- Payment gateway choice (Razorpay is the common default for India-based SIH projects — confirm)
- Whether AI features are genuinely ML-served or rule-based/mocked for the hackathon (perfectly fine to mock intelligently for a demo — just be honest about it in the pitch)
- Whether Admin Web and Logistics Web are two separate React apps or one app with role-based routing (recommend: **one React app, two role-gated route groups** — less duplication, still satisfies "2 web dashboards" requirement visually)

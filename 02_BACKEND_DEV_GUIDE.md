# FarmDirect — Backend Developer Guide
**Reads with:** `00_PROJECT_MASTER_GUIDE.md` (canonical state machine + data model — this file implements it)

---

## 1. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Runtime/framework | Node.js + Express (or Fastify) + TypeScript | TypeScript is not optional here — the shared `types` package only pays off if the backend is typed too |
| Database | Supabase Postgres | Use real relational schema + foreign keys, not a document dump — this project has real relational integrity needs (orders ↔ pickups ↔ payments) |
| Auth | Supabase Auth (phone/OTP for farmers/buyers, email/password acceptable for admin/logistics staff) | Backend still owns role assignment — Supabase Auth handles identity, your `users` table + RLS handles authorization |
| Storage | Supabase Storage | Buckets: `produce-photos`, `delivery-proof`, `kyc-docs` — each with distinct RLS policies (see §4) |
| Validation | `zod` on every route input | |
| Background jobs | Postgres-backed job table + a worker process, or Supabase Edge Functions + `pg_cron` | For notifications, settlement queueing, AI job dispatch |
| AI service | Separate service/module behind an internal API (`/internal/ai/*`), called async where possible | Keeps route optimization / forecasting from blocking user-facing requests |
| API docs | OpenAPI spec (or a well-maintained Postman collection) checked into the repo | This *is* the shared contract frontend teams build against |

---

## 2. Canonical Order State Machine — Implementation

Enforce Master Guide §3 as an actual Postgres enum + a state-transition function, not just application-layer `if` statements scattered across routes:

```sql
CREATE TYPE order_status AS ENUM (
  'PLACED', 'CONFIRMED', 'PICKUP_SCHEDULED', 'PICKUP_IN_PROGRESS',
  'COLLECTED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED',
  'CANCELLED', 'FAILED', 'DISPUTED'
);
```

Centralize allowed transitions in one function/module (`orderStateMachine.ts`) that every route calls — e.g. `canTransition(current, next)` — so no single route can silently move an order into an invalid state. This is the single most important piece of backend discipline on this project, because four separate frontends all depend on this enum never drifting.

**Bulk order rule (implementation detail):** parent `Order.status` is derived, not directly settable, once it has child `Pickup` rows — a trigger or application-layer aggregation recomputes parent status whenever a child pickup status changes (e.g. parent → `COLLECTED` only when `count(pickups where status != COLLECTED) = 0`). Wrap child-pickup status updates in a transaction with the parent recompute to avoid race conditions under concurrent farmer confirmations.

---

## 3. Core Schema (summary — expand per-table in your migration files)

```
users (id, phone, email, role, created_at)
farmers (user_id FK, farm_location, verification_status, fpo_id FK nullable)
fpos (id, name, region)
buyers (user_id FK, mode['consumer'|'bulk'], business_details jsonb nullable)
products (id, farmer_id FK, crop, quantity, price, quality_grade, harvest_date, status)
negotiations (id, product_id FK, buyer_id FK, farmer_id FK, status, offer_history jsonb)
orders (id, buyer_id FK, status order_status, total_amount, delivery_address, is_bulk bool)
pickups (id, order_id FK, farmer_id FK, product_id FK, quantity, status, vehicle_id FK nullable, driver_id FK nullable)
payments (id, order_id FK, amount, status, method, settlement_to FK nullable)
vehicles (id, reg_number, type, capacity, status)
drivers (id, name, contact, status, current_vehicle_id FK nullable)
disputes (id, order_id FK, raised_by FK, category, evidence jsonb, status, resolution)
notifications (id, user_id FK, type, payload jsonb, read_at)
ai_outputs (id, type['forecast'|'price'|'spoilage'|'match'|'route'], ref_id, payload jsonb, computed_at)
```

Index at minimum: `products(crop, status)`, `orders(buyer_id, status)`, `pickups(order_id, status)`, `negotiations(product_id, status)` — these back every list screen in the frontend guide.

---

## 4. Row Level Security (RLS) — Authorization Baseline

RLS is your **defense-in-depth layer**, not your only layer — every route also checks ownership server-side. Baseline policies:

- `products`: public `SELECT` for `status='active'`; `INSERT/UPDATE/DELETE` only where `farmer_id = auth.uid()`
- `orders`: `SELECT` only where `buyer_id = auth.uid()` OR the requester is a farmer with a pickup on that order OR requester role is `admin`/`logistics_staff`
- `pickups`: `SELECT/UPDATE` restricted to the assigned farmer, or `logistics_staff`/`admin`
- `payments`: `SELECT` only own records; **no client-side `INSERT`/`UPDATE` at all** — only the backend service role writes payment rows, after gateway webhook confirmation
- Storage buckets: `produce-photos` — public read, owner-only write; `delivery-proof` — read restricted to order's buyer+farmer+admin+logistics; `kyc-docs` — read restricted to owner + admin only, never public

---

## 5. API Contract Conventions

- REST, resource-based paths: `/api/v1/products`, `/api/v1/orders/:id`, `/api/v1/negotiations/:id/accept`
- Every list endpoint supports `?page=&limit=&filter[...]` — never return unbounded result sets
- Every response follows one envelope shape:
```json
{ "data": {...}, "meta": { "page": 1, "total": 42 }, "error": null }
```
- Status transition endpoints are explicit actions, not generic PATCH: `POST /orders/:id/confirm`, `POST /pickups/:id/collect`, `POST /disputes/:id/resolve` — this is what makes the state machine enforceable server-side (§2) instead of trusting arbitrary field updates from clients.
- Version the API (`/api/v1/...`) from day one — cheap now, painful to retrofit.

---

## 6. Security Checklist (backend-specific — pairs with Master Guide §7)

- [ ] Every route validates input with `zod` before touching the DB — no raw `req.body` spreads into queries
- [ ] Every route checks `req.user.role` and resource ownership server-side, even where RLS also applies
- [ ] Rate limiting middleware on: OTP request, login, negotiation offer creation, order placement
- [ ] Payment writes only from a verified gateway webhook (signature-verified), never trust a client "I paid" call
- [ ] File upload routes validate MIME + size server-side; virus/malware scan if budget allows, at minimum re-encode images server-side rather than trusting the uploaded bytes as-is
- [ ] Secrets (`SUPABASE_SERVICE_ROLE_KEY`, AI provider keys, payment gateway secret) live only in backend environment variables — confirm none are present in any mobile/web bundle (grep the built bundles before shipping)
- [ ] CORS restricted to known frontend origins in production config
- [ ] Admin actions (suspend user, resolve dispute, override payment) write to an `audit_log` table with actor, action, timestamp, reason
- [ ] JWT expiry short (e.g. 1h access / 30d refresh with rotation), refresh handled via Supabase Auth's standard flow
- [ ] SQL access exclusively through parameterized queries / Supabase client — no string-concatenated SQL anywhere

---

## 7. Scalability & AI Service Design

- **AI service as a separate concern**: expose `/internal/ai/forecast`, `/internal/ai/match`, `/internal/ai/route`, `/internal/ai/spoilage` behind an internal-only API (not reachable from mobile/web directly). The main API calls these async and stores results in `ai_outputs`; frontend reads pre-computed results, never triggers a slow model call inline on a user-facing request.
- **Route optimization** in particular can be slow (combinatorial). Trigger it on order-aggregation completion via a background job, notify Logistics Web via websocket/poll when the route is ready, rather than making the pickup-management screen wait on a synchronous call.
- **Pagination everywhere** — product search, order lists, negotiation history.
- **Idempotency keys** on order-placement and payment-confirmation endpoints, so a flaky mobile network retry doesn't create duplicate orders/payments.
- **Stateless API processes** — session/auth state lives in JWT + Supabase, not in-memory — so you can run multiple instances behind a load balancer without sticky sessions if needed later.
- **Webhook reliability** — payment gateway webhooks should be idempotent-safe (dedupe by gateway transaction id) since gateways commonly retry.

---

## 8. Antigravity Prompt Templates for Backend Tasks

**New endpoint:**
```
GOAL: Implement [METHOD /path] per 02_BACKEND_DEV_GUIDE.md §5 contract conventions.
SCHEMA: use tables defined in §3 — do not add new columns/tables without flagging as a contract-change PR.
STATE MACHINE: if this endpoint changes order/pickup status, it MUST go through orderStateMachine.ts canTransition() — never a direct status field write.
VALIDATION: zod schema for input, matching the shared /types package shape.
AUTH: enforce role + ownership check server-side per §6, in addition to existing RLS.
TESTS: at least one happy-path and one unauthorized-access test.
```

**Schema/migration change:**
```
GOAL: [describe schema change]
IMPACT CHECK: does this affect the order_status enum, or any field consumed by the shared /types package used by all 4 frontends? If yes, this is a contract-change — flag explicitly and update 00_PROJECT_MASTER_GUIDE.md §4 in the same PR.
MIGRATION: additive/backward-compatible where possible (add nullable column, don't rename in place) to avoid breaking frontend builds mid-sprint.
```

---

## 9. Phase-by-Phase Backend Plan (mirrors Master Guide §9)

- **Phase 0:** Schema + RLS + auth end-to-end; `orderStateMachine.ts` scaffolded; shared types package published/linked; OpenAPI skeleton.
- **Phase 1:** Full V1 CRUD + negotiation-accept-creates-order flow + basic pickup/delivery status endpoints (manual, no AI/optimization yet).
- **Phase 2:** Bulk order aggregation (parent/child pickups + concurrency-safe recompute), AI service endpoints wired (forecast/price/spoilage/match/route), async job dispatch.
- **Phase 3:** Payment gateway integration + webhook handling + settlement job, disputes endpoints, notifications delivery, ratings.
- **Phase 4:** Security checklist (§6) walked line-by-line, load test order-placement + negotiation-accept under concurrent load, finalize API docs for the demo/judges packet.

# MandiKart — Global Architecture & Shared Services Guide
**Local root:** `D:\Mandikart\MandiKart`
**Repo:** https://github.com/Chiranjeeb1101/MandiKart
**Reads with:** `00_PROJECT_MASTER_GUIDE.md` (canonical state machine + data model — unchanged, still authoritative), `FarmerApp/Backend.md` (Farmer backend deep-dive)

> This file exists because the repo has 4 independent backends (`FarmerApp/backend`, `UserApp/backend`, `Admin/backend`, `Logistic/backend`) that all touch the **same Supabase database**. Without a clear global/specific split, you get four teams quietly reimplementing auth, four slightly different order-status validators, and eventually a demo where the apps disagree with each other. This file is the rulebook that prevents that.

---

## 1. Actual Repo Layout (as of now)

```
D:\Mandikart\MandiKart\
├── .agents/                        ← Antigravity / agent config (session scoping lives here)
├── .planning/                      ← planning docs, specs-in-progress
├── FarmerApp\
│   ├── frontend\                   (RN + Expo)
│   ├── backend\                    (Node/Express/TS — see FarmerApp\backend\Backend.md)
│   ├── Frontend.md
│   └── Backend.md
├── UserApp\
│   ├── frontend\                   (RN + Expo — consumer + bulk buyer modes)
│   ├── backend\
│   ├── Frontend.md
│   └── Backend.md
├── Admin\
│   ├── frontend\                   (React + Vite)
│   ├── backend\
│   ├── Frontend.md
│   └── Backend.md
├── Logistic\
│   ├── frontend\                   (React + Vite)
│   ├── backend\
│   ├── Frontend.md
│   └── Backend.md
├── packages\                        ← NEW — shared code lives here (see §3)
│   ├── shared-types\
│   ├── shared-core\
│   └── shared-config\
├── 00_PROJECT_MASTER_GUIDE.md
├── 01_FRONTEND_DEV_GUIDE.md
├── 02_BACKEND_DEV_GUIDE.md
├── GLOBAL_SHARED_SERVICES.md         ← this file
├── pnpm-workspace.yaml               ← NEW — makes the repo a real monorepo
├── package.json                      ← NEW — root workspace manifest
└── README.md
```

The `packages/` folder and the two root workspace files are the only structural additions this doc introduces. Everything else already exists in your repo.

---

## 2. The Core Rule: One Database, Four Writers, One Contract

All four backends connect to the **same Supabase project** (same Postgres instance, same Auth, same Storage). That means:

- **The canonical `order_status` enum, the state-transition rules, and the core schema (`00_PROJECT_MASTER_GUIDE.md` §3–4) apply identically no matter which backend is doing the writing.** A Farmer backend accepting an order and a Logistics backend marking a pickup collected must run through the *exact same* transition-validation code — not two separately-written copies of "is this transition legal" logic.
- This is why the state machine engine, the DB client, and the Zod schemas for shared entities (`Order`, `Product`, `User`) are **global**, not duplicated per app.
- Anything that is genuinely one app's private business (farmer KYC document parsing, buyer cart UX logic, logistics route-optimization heuristics) stays **specific** to that backend.

---

## 3. Global (Shared) Services — `packages/`

These live once, get imported by all four backends, and are versioned together so a fix in one place fixes it everywhere.

### `packages/shared-types`
- TypeScript types/interfaces for every core entity: `User`, `Farmer`, `Buyer`, `Product`, `Order`, `OrderItem`, `Pickup`, `Payment`, `Dispute`, `Notification`
- The `OrderStatus` enum (single source of truth — must match the Postgres enum exactly, char for char)
- Zod schemas for request/response validation of shared entities
- API response envelope type: `{ data, meta, error }`

### `packages/shared-core`
- **Supabase client factory** — one place that configures the Postgres/Auth/Storage client, so connection config, RLS-aware helpers, and retry/timeout logic aren't reinvented 4 times
- **Order State Machine engine** (`canTransition(current, next, actorRole)`) — the single function every backend's order-status endpoint calls. No backend is allowed to mutate `orders.status` except through this function.
- **Auth middleware** — JWT verification, role extraction, "does this user own this resource" helper functions
- **Notification dispatcher** — a thin interface (`notify(userId, type, payload)`) that queues a notification; the actual push/SMS/WhatsApp delivery mechanism lives behind this one interface so it can change without every backend changing
- **Audit logger** — `auditLog(actorId, action, resourceType, resourceId, meta)` — every admin/state-changing action across all 4 backends writes through this one function into `audit_log`
- **Idempotency middleware** — reads `Idempotency-Key` header, dedupes repeated writes (critical given rural network flakiness — flagged in the Farmer backend doc)
- **Market price service** — the APMC/Agmarknet aggregator. This is logically "Farmer-facing" but is genuinely global: Buyer App will also want to show market context on product listings later, and Admin wants it for price-intelligence monitoring. Build once, expose via `GET /api/v1/market/rates` from a global module, mounted into whichever backend needs it (or run as its own micro-service if you want to isolate scraping load — see §5).

### `packages/shared-config`
- Environment variable schema/validation (so a missing `SUPABASE_SERVICE_ROLE_KEY` fails fast at boot, not silently at first request)
- Shared constants: rate-limit thresholds, OTP expiry, JWT expiry, file-size limits

---

## 4. Specific (Per-App) Services

Each backend keeps everything that is genuinely its own domain logic. Nothing here should leak into `packages/`.

| App backend | Owns |
|---|---|
| **FarmerApp/backend** | Farmer profile/KYC, produce listing CRUD, inventory reservation logic, farmer-side order actions (accept/reject/ready-for-pickup), farmer dashboard aggregation, farmer bank-details/payout config, negotiation counter-offers from farmer side |
| **UserApp/backend** | Buyer profile, browse/search/cart, consumer checkout, bulk requirement posting, supplier discovery, buyer-side negotiation offers, order placement (creates the `Order` row — the *only* backend allowed to `INSERT` into `orders`, since only buyers place orders) |
| **Admin/backend** | User verification/suspension, dispute resolution (final), platform analytics aggregation, moderation of listings, audit log viewing, manual overrides (always via the shared audit logger) |
| **Logistic/backend** | Vehicle/driver management, pickup/route assignment, route optimization calls, exception/delay handling, proof-of-delivery capture, live-tracking data ingestion |

**Ownership rule, stated precisely:** a table can be *read* by any backend that has a legitimate reason to (via RLS-scoped queries), but each table has exactly one backend (or the shared engine) that is allowed to *write* its primary lifecycle field:
- `orders.status` → only via `shared-core`'s state machine, called from whichever backend's action legitimately triggers that transition (Farmer backend calls it for `CONFIRMED`, Logistic backend calls it for `PICKUP_SCHEDULED`→`DELIVERED`, Admin backend calls it for dispute resolutions)
- `orders` row creation → UserApp/backend only
- `products` → FarmerApp/backend only
- `payments` → nobody except a backend-to-backend webhook handler (recommend hosting this in whichever backend owns payment gateway integration — Admin or a small dedicated service; document the choice once you make it)

---

## 5. System Design — How the Four Backends Coexist

```
                         ┌───────────────────────────────────────┐
                         │              packages/                 │
                         │  shared-types · shared-core ·           │
                         │  shared-config                          │
                         └───────────────┬─────────────────────────┘
                                          │ imported by all 4
        ┌───────────────┬────────────────┼────────────────┬───────────────┐
        ▼               ▼                ▼                ▼               
┌───────────────┐ ┌───────────────┐┌───────────────┐┌───────────────┐
│ FarmerApp/     │ │ UserApp/       ││ Admin/         ││ Logistic/      │
│ backend         │ │ backend         ││ backend         ││ backend         │
│ (Express/TS)    │ │ (Express/TS)    ││ (Express/TS)    ││ (Express/TS)    │
└───────┬────────┘ └───────┬────────┘└───────┬────────┘└───────┬────────┘
        │                  │                  │                  │
        └──────────────────┴────────┬─────────┴──────────────────┘
                                     ▼
                        ┌────────────────────────┐
                        │   SUPABASE (shared)      │
                        │  Postgres · Auth · Storage│
                        └────────────────────────┘
```

- Each backend is deployed as its own process (own port in dev, own service in prod) — genuinely independent, can be built/deployed/scaled separately.
- If two backends need to call each other directly (e.g. Logistic backend needs to notify UserApp backend that a delivery happened so a push can be sent) — **prefer going through the database + shared notification dispatcher, not direct HTTP calls between backends.** Keeps the system loosely coupled and avoids a tangle of internal service-to-service auth. Only add direct backend-to-backend HTTP calls where there's a real synchronous need (e.g. Admin backend calling Logistic backend's route-optimization endpoint on demand).

---

## 6. Local Dev Setup (Windows paths)

```
D:\Mandikart\MandiKart>                    pnpm install          # installs all workspace packages
D:\Mandikart\MandiKart\packages\shared-core>  pnpm build          # if shared packages are compiled, not just TS-referenced
D:\Mandikart\MandiKart\FarmerApp\backend>     pnpm dev            # runs Farmer backend, e.g. on :4001
D:\Mandikart\MandiKart\UserApp\backend>       pnpm dev            # e.g. :4002
D:\Mandikart\MandiKart\Admin\backend>         pnpm dev            # e.g. :4003
D:\Mandikart\MandiKart\Logistic\backend>      pnpm dev            # e.g. :4004
```

`pnpm-workspace.yaml` at root:
```yaml
packages:
  - "FarmerApp/backend"
  - "UserApp/backend"
  - "Admin/backend"
  - "Logistic/backend"
  - "packages/*"
```

Each backend's `package.json` references shared packages as workspace dependencies:
```json
{
  "dependencies": {
    "@mandikart/shared-types": "workspace:*",
    "@mandikart/shared-core": "workspace:*",
    "@mandikart/shared-config": "workspace:*"
  }
}
```

This means: a fix in `shared-core`'s state machine is instantly available to all 4 backends on next `pnpm install`/rebuild — no copy-pasting, no version drift.

**Env files:** each backend has its own `.env` (its own port, its own service-specific secrets), but all four share the same `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (the service-role key only ever lives server-side, never in any frontend bundle — per the security checklist in `02_BACKEND_DEV_GUIDE.md`).

---

## 7. Antigravity Path-Finder Prompt — Global vs Specific Edition

Extend the template from `00_PROJECT_MASTER_GUIDE.md` §6.2 with one explicit line for this repo shape:

```
SCOPE TYPE: [GLOBAL (packages/*) | SPECIFIC ([FarmerApp|UserApp|Admin|Logistic]/backend)]
IF GLOBAL: this change affects all 4 backends — flag as contract-change, requires review from
           at least one dev per affected app before merge.
IF SPECIFIC: confirm this task does NOT need a new shared type/schema. If it does, stop and
             raise a GLOBAL task first — do not inline a copy of shared logic into one app's backend.
```

This one line is the guardrail against the most likely failure mode of a 4-backend + shared-package repo: an agent (or a rushed dev) "just quickly" duplicating a validator or type into one app's backend instead of touching the shared package, which is exactly how the four apps end up disagreeing again.

---

## 8. Open Decision Needed From You
- **Payment webhook home:** which backend actually receives the payment gateway webhook and writes to `payments`? Recommend Admin/backend (finance-adjacent) or a 5th tiny `packages/payment-service` if you want it fully isolated — confirm and I'll document it precisely in the next pass.
- **Deployment target** (Render/Railway/VPS/Vercel functions, etc.) — affects whether "4 independent processes" becomes "4 independent deployments" or "4 serverless function groups." Not urgent for the hackathon build, but worth deciding before submission-week.

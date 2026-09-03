# MandiKart — FarmerApp Backend — Final Specification
**Local path:** `D:\Mandikart\MandiKart\FarmerApp\backend`
**Reads with:** `GLOBAL_SHARED_SERVICES.md` (what's shared vs specific), `00_PROJECT_MASTER_GUIDE.md` (canonical state machine), `02_BACKEND_DEV_GUIDE.md` (general backend conventions)

> This finalizes and hardens the PRD/system-design draft already produced for the Farmer surface. It keeps everything that was good in that draft (screen-to-API mapping, schema, Mermaid diagrams, OTP-based pickup verification) and fixes the places where it needs to line up with the rest of the platform — mainly: importing the *shared* order-state-machine and types instead of re-defining them locally, and tightening security/concurrency/scalability to production-grade.

---

## 1. Scope

FarmerApp/backend is the service that owns everything a farmer does: identity/KYC, produce listings, inventory, farmer-side order actions, negotiation responses, dashboard aggregation, bank/payout details, and (globally-sourced) market price display. It does **not** own order creation (UserApp/backend does that) or payment settlement execution (see `GLOBAL_SHARED_SERVICES.md` §8 — open decision) or logistics assignment (Logistic/backend does that) — it only triggers the transitions that are legitimately the farmer's to make.

---

## 2. Folder Structure

```
D:\Mandikart\MandiKart\FarmerApp\backend\
├── src\
│   ├── routes\
│   │   ├── auth.routes.ts
│   │   ├── farmers.routes.ts
│   │   ├── products.routes.ts
│   │   ├── orders.routes.ts
│   │   └── market.routes.ts          (thin wrapper calling shared-core market service)
│   ├── controllers\
│   │   ├── auth.controller.ts
│   │   ├── farmers.controller.ts
│   │   ├── products.controller.ts
│   │   └── orders.controller.ts
│   ├── services\
│   │   ├── inventory.service.ts       (reservation logic — specific, see §6)
│   │   ├── negotiation.service.ts     (farmer-side counter-offer logic)
│   │   ├── dashboard.service.ts       (aggregation queries)
│   │   └── kyc.service.ts             (Aadhaar/land-doc handling — see §7 security)
│   ├── middleware\
│   │   └── (imports auth + idempotency + validation from @mandikart/shared-core,
│   │        only Farmer-specific middleware lives here, e.g. KYC-required guard)
│   ├── validators\                    (zod schemas specific to Farmer endpoints;
│   │                                     shared entity schemas come from @mandikart/shared-types)
│   ├── db\
│   │   └── client.ts                  (thin re-export of shared-core's Supabase client,
│   │                                     configured with this service's own role/scopes)
│   ├── config\
│   │   └── env.ts                     (validates this service's .env via shared-config schema)
│   └── index.ts                       (Express app entry, port from env, e.g. 4001)
├── migrations\                        (SQL migrations owned by this app's tables — see §3)
├── tests\
├── .env                               (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PORT=4001, ...)
├── package.json                       (depends on @mandikart/shared-types, shared-core, shared-config)
├── tsconfig.json
└── Backend.md                         (living doc — keep in sync with this file)
```

---

## 3. Database Schema (Farmer-owned tables)

This is the schema from the original PRD, kept largely as-is (it was well designed) with the changes marked **[CHANGED]**.

```sql
-- Shared enums live in a shared migration, not duplicated here.
-- [CHANGED] order_status, user_role now come from the GLOBAL migration set
-- (packages/shared-core/migrations) — do not redefine them in this app's migrations folder.
-- produce_grade and buyer_target are Farmer/Product-domain enums and DO belong here.

CREATE TYPE produce_grade AS ENUM ('A', 'B', 'C');
CREATE TYPE buyer_target AS ENUM ('RETAIL', 'BULK', 'BOTH');

-- 1. Farmers Profile Table
CREATE TABLE public.farmers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100),
  preferred_language VARCHAR(5) DEFAULT 'en',
  avatar_url TEXT,
  aadhaar_number_encrypted TEXT,          -- [CHANGED] store encrypted, never plaintext (see §7)
  aadhaar_last4 VARCHAR(4),                -- [CHANGED] safe-to-display reference without decrypting
  is_verified BOOLEAN DEFAULT FALSE,
  state VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  taluka VARCHAR(50),
  village VARCHAR(50),
  farm_size_acres NUMERIC(6, 2) DEFAULT 0.0,
  ownership_type VARCHAR(30) DEFAULT 'Owner',
  primary_crops TEXT[] DEFAULT '{}',
  upi_id VARCHAR(50),
  bank_account_number_encrypted TEXT,      -- [CHANGED] encrypted at rest (see §7)
  bank_account_last4 VARCHAR(4),           -- [CHANGED]
  bank_ifsc VARCHAR(15),
  bank_account_name VARCHAR(100),
  fpo_id UUID REFERENCES public.fpos(id),  -- [CHANGED] added — was missing FPO link from original draft
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products / Produce Batches Table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  crop_name VARCHAR(100) NOT NULL,
  crop_variety VARCHAR(100),
  grade produce_grade DEFAULT 'A',
  category VARCHAR(50) NOT NULL,
  total_quantity NUMERIC(10, 2) NOT NULL,
  available_quantity NUMERIC(10, 2) NOT NULL,
  reserved_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0.0,   -- [CHANGED] made explicit, was implied only in prose
  quantity_unit VARCHAR(10) NOT NULL DEFAULT 'kg',
  base_price_per_unit NUMERIC(10, 2) NOT NULL,
  min_order_quantity NUMERIC(10, 2) DEFAULT 1.0,
  target_buyer buyer_target DEFAULT 'BOTH',
  images TEXT[] DEFAULT '{}',
  pickup_address TEXT,
  pickup_latitude NUMERIC(9, 6),
  pickup_longitude NUMERIC(9, 6),
  is_active BOOLEAN DEFAULT TRUE,
  harvest_date DATE,
  shelf_life_days INT DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_quantity_nonneg CHECK (available_quantity >= 0 AND reserved_quantity >= 0),  -- [CHANGED]
  CONSTRAINT chk_reserved_within_total CHECK (reserved_quantity <= total_quantity)             -- [CHANGED]
);

-- Orders, order_items, order_status_history, market_prices:
-- [CHANGED] these are GLOBAL/shared tables (multiple backends write/read them), so their canonical
-- definition now lives in packages/shared-core/migrations, matching 00_PROJECT_MASTER_GUIDE.md §3–4.
-- FarmerApp/backend reads and writes them via the shared client + shared state machine,
-- but does not own their migration files.
```

**Why the encryption/last4 change matters:** Aadhaar numbers and bank account numbers are exactly the kind of field that, stored in plaintext, turns a routine DB leak into a regulatory incident. Store them encrypted (`pgcrypto` or app-layer AES-256-GCM before insert), and keep a `*_last4` column for anything the UI needs to display ("Account ending 4417") without ever decrypting on a read path that doesn't need the full value.

---

## 4. Canonical Order State Machine — Farmer-side Transitions Only

Full state machine lives in `00_PROJECT_MASTER_GUIDE.md` §3 / `packages/shared-core`. FarmerApp/backend is only ever the **trigger** for these specific transitions, always via the shared `canTransition()` function — never a direct `UPDATE orders SET status = ...`:

| Action (Farmer app) | From | To |
|---|---|---|
| `ACCEPT` | `PLACED` | `CONFIRMED` |
| `REJECT` | `PLACED` | `CANCELLED` |
| `READY_FOR_PICKUP` | `CONFIRMED` | `PICKUP_SCHEDULED`* |
| `VERIFY_PICKUP` (farmer provides/confirms pickup OTP to driver) | `PICKUP_IN_PROGRESS` | `COLLECTED` |

\* *Note: in the original draft, `READY_FOR_PICKUP` moved the order straight to `PICKUP_SCHEDULED`, implying the farmer's "ready" action itself schedules logistics. In practice, logistics vehicle/driver assignment is Logistic/backend's job (per the ownership matrix in `GLOBAL_SHARED_SERVICES.md` §4). Recommended fix: `READY_FOR_PICKUP` should move the order to an interim signal (either stay in `CONFIRMED` with a `ready_for_pickup_at` timestamp, or you formally add this as accepted platform behavior where Farmer's "ready" auto-triggers the Logistic backend's assignment job). Pick one and document it in this table before you build — this is exactly the kind of cross-app boundary ambiguity that's cheap to fix now and expensive to fix after both backends are built against different assumptions.*

---

## 5. API Endpoints (finalized)

Conventions: JSON envelope `{ data, meta, error }`, versioned under `/api/v1`, all mutating endpoints require `Idempotency-Key` header (enforced by shared middleware), all require `Authorization: Bearer <jwt>` except signup/login/OTP.

### Auth & Profile
- `POST /api/v1/auth/signup` — `{ phone, fullName, password, method }` → `{ status: "PENDING_OTP", tempSessionToken }`
- `POST /api/v1/auth/verify-otp` — `{ phone, otp }` → `{ token, farmer }`
- `POST /api/v1/auth/login` — `{ phone, password }` → `{ token, farmer }`
- `POST /api/v1/auth/logout`
- `GET /api/v1/farmers/me`
- `PUT /api/v1/farmers/profile` — `{ aadhaarNumber, state, district, taluka, village }` — **server encrypts `aadhaarNumber` before storage, response never echoes it back in full** (see §7)
- `PUT /api/v1/farmers/farm-details` — `{ farmSizeAcres, ownershipType, primaryCrops, irrigationType }`
- `PUT /api/v1/farmers/preferences` — `{ preferredLanguage }`
- `GET / PUT /api/v1/farmers/bank-details` — GET response returns only `upiId`, `bankAccountLast4`, `bankIfsc`, `bankAccountName`, `verified` — never the full account number
- `POST / GET /api/v1/farmers/documents` — KYC doc upload/list (see §7 for upload security)

### Produce Management
- `GET /api/v1/products?farmerId=self&status=active&page=&limit=`
- `POST /api/v1/products` — creates listing; `reserved_quantity` defaults 0
- `PATCH /api/v1/products/:id/stock` — `{ availableQuantity, isActive }` — **must go through inventory.service.ts, which checks `available_quantity >= reserved_quantity` invariant, not a raw field set**
- `DELETE /api/v1/products/:id` — soft delete (`is_active = false`), never hard-delete a product with order history

### Orders (farmer-side actions only)
- `GET /api/v1/orders?status=&page=` — scoped to `farmer_id = auth.uid()`
- `POST /api/v1/orders/:id/accept` — calls shared state machine `ACCEPT`
- `POST /api/v1/orders/:id/reject` — `{ reason }` — calls shared state machine `REJECT`, releases reserved inventory
- `POST /api/v1/orders/:id/ready-for-pickup` — calls shared state machine `READY_FOR_PICKUP` (see §4 note)
- `POST /api/v1/orders/:id/verify-pickup` — `{ pickupOtp }` — calls shared state machine `VERIFY_PICKUP`
- `POST /api/v1/orders/:id/negotiate` — `{ counterPricePerUnit, remarks }` — farmer-side counter-offer

**[CHANGED from original draft]:** the original used one generic `PATCH /orders/:id/status` with an `action` field in the body. Finalized version uses explicit action endpoints (`POST /orders/:id/accept`, etc.) — this matches the convention already set in `02_BACKEND_DEV_GUIDE.md` §5, and is meaningfully safer: each endpoint can have its own auth/role/payload validation instead of one endpoint branching on an arbitrary string, which is easy to get wrong and harder to rate-limit/audit precisely.

### Market Intelligence (thin proxy to global service)
- `GET /api/v1/market/rates?district=&commodity=`
- `GET /api/v1/farmers/dashboard-summary`

---

## 6. Concurrency & Inventory Design (System Design detail)

The single trickiest correctness problem in this backend is **inventory reservation under concurrent orders** — two buyers ordering the last 50kg of tomatoes at the same moment.

**Design:**
1. When UserApp/backend creates an order, it calls a shared `reserveInventory(productId, qty)` function (lives in `inventory.service.ts` here, exposed to other backends via the DB — see below) that runs as a single atomic SQL statement:
   ```sql
   UPDATE products
   SET reserved_quantity = reserved_quantity + $qty,
       available_quantity = available_quantity - $qty
   WHERE id = $productId
     AND available_quantity >= $qty
   RETURNING *;
   ```
   If this returns zero rows, the reservation failed (not enough stock) — the calling backend must roll back the order creation in the same transaction/flow. This single `UPDATE ... WHERE ... RETURNING` pattern avoids a check-then-write race condition entirely — no separate `SELECT` to check stock first.
2. On `REJECT` or `CANCELLED`, the reverse happens: `reserved_quantity -= qty`, `available_quantity += qty`.
3. A **15-minute reservation TTL** (from the original draft) should be enforced by a background job (in `packages/shared-core` or a small cron) that releases reservations for orders still `PLACED` past the TTL — otherwise an abandoned order silently locks stock forever.
4. Because `reserveInventory` is called from UserApp/backend but mutates a Farmer-owned table, this is a good candidate to expose as **one shared function in `packages/shared-core`** rather than Farmer/backend having to expose an internal HTTP endpoint for another backend to call — simpler, and avoids backend-to-backend network calls for something this latency-sensitive (see `GLOBAL_SHARED_SERVICES.md` §5 principle on preferring the DB over direct service calls).

---

## 7. Security (Farmer-backend specific, on top of `02_BACKEND_DEV_GUIDE.md` §6)

| Area | Control |
|---|---|
| **Aadhaar number** | Encrypt at rest (`pgcrypto` `pgp_sym_encrypt` or app-layer AES-256-GCM with a key in a secrets manager, not `.env` in plaintext for production). Store `aadhaar_last4` separately for display. Never log the full number, never return it in any API response after initial submission — only return a masked form (`XXXX-XXXX-9012`) |
| **Bank account number** | Same pattern — encrypted, `*_last4` for display, never returned in full via API |
| **KYC document uploads** (Aadhaar photo, land document) | Server-side MIME + size validation, re-encode/strip EXIF metadata from images before storage (location metadata in a photo is a real leak vector), Supabase Storage bucket `kyc-docs` with RLS restricted to owner + Admin only, signed URLs with short expiry for any read, never a public bucket |
| **OTP (signup/login)** | 6-digit, 5-minute expiry, max 5 verify attempts per OTP, rate-limit OTP *send* to 3 per phone number per 10 minutes, invalidate previous OTP on resend |
| **Inventory/price manipulation** | Server validates `basePricePerUnit` and quantities are within sane bounds (>0, below a configurable sanity ceiling) — prevents a compromised/buggy client from creating a ₹0 or negative-price listing |
| **Ownership checks** | Every product/order mutation checks `farmer_id = auth.uid()` server-side in the controller, in addition to RLS — defense in depth, not either/or |
| **Idempotency** | `Idempotency-Key` required on `accept`, `reject`, `verify-pickup`, and `stock` PATCH — rural network retries must not double-accept an order or double-verify a pickup |
| **Rate limiting** | Negotiation counter-offer endpoint rate-limited per farmer (prevents offer spam that could be used to harass a buyer or manipulate a negotiation thread) |
| **RLS baseline** | `farmers`: owner read/write own row, admin read all. `products`: public read where `is_active = true`, owner-only write. `orders`/`order_items`: farmer can read/act only on orders containing their own `order_items` |

---

## 8. Scalability

- **Dashboard summary** (`/farmers/dashboard-summary`) is an aggregation query hit on every home-screen load — cache it per-farmer with a short TTL (30–60s) rather than recomputing from scratch on every request; invalidate on order/product mutation if you want it always-fresh, or accept slight staleness for the performance win.
- **Market rates** — this data changes at most daily (APMC updates), cache aggressively (hours, not seconds); the scraper/aggregator job (global service) should run on a schedule, not be triggered per-request.
- **Product listing search** — index `(crop_name, is_active)`, `(farmer_id, is_active)`; paginate everything; never return all of a farmer's historical listings on one call.
- **Image uploads** — use Supabase Storage presigned URLs so images upload directly from the mobile client to storage, not proxied through this backend's process (keeps the Node process from being a bandwidth bottleneck).
- **order_status_history** grows unbounded by design (audit trail) — fine for Postgres at hackathon+early-production scale, but index `(order_id)` and `(created_at)` for later admin querying.
- **Stateless service** — no in-memory session; safe to run multiple instances of FarmerApp/backend behind a load balancer later without sticky sessions, since auth state is JWT + Supabase.

---

## 9. Shareability Summary (what to extract to `packages/` first)

If you're retrofitting the shared-package structure onto an already-started Farmer backend, extract in this order (highest cross-app value first):

1. `OrderStatus` enum + `canTransition()` — needed the moment UserApp/backend exists and both backends touch orders
2. Supabase client factory + auth middleware — needed by all 4 immediately
3. Zod schemas for `Order`, `Product`, `User` — needed once Admin/Logistic backends start reading these shapes
4. Notification dispatcher — needed once more than one backend needs to trigger a notification for the same event (e.g. order accepted → notify buyer, which UserApp/backend consumes)
5. Market price service — lowest urgency, Farmer-only until Buyer/Admin want it too

Everything else (KYC handling, inventory reservation SQL, dashboard aggregation, negotiation logic) is legitimately Farmer-specific and should stay in `FarmerApp/backend`.

---

## 10. Open Items / Confirm Before Building
- **`READY_FOR_PICKUP` transition ownership** (§4) — decide now whether this auto-triggers Logistic/backend or just flags readiness for logistics staff to pick up manually in V1.
- **Payment webhook home** — carried over from `GLOBAL_SHARED_SERVICES.md` §8, affects whether `payments.settlement_to` gets written from this backend or elsewhere.
- **Encryption key management** — confirm where the encryption key for Aadhaar/bank fields will live (Supabase Vault, a cloud KMS, or an env secret for hackathon scope) — flagging so it's a conscious choice, not an afterthought before a public demo.

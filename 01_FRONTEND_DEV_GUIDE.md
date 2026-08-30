# FarmDirect — Frontend Developer Guide
**Reads with:** `00_PROJECT_MASTER_GUIDE.md` (canonical state machine + data model — do not diverge from it)

Covers 4 surfaces:
- **Farmer App** — React Native + Expo (Expo Go during dev, EAS build for APK)
- **Buyer App** — React Native + Expo (consumer + bulk buyer modes in one app)
- **Admin Web** — React (Vite), role-gated
- **Logistics Web** — React (Vite), role-gated (can share the same React project as Admin — see Master Guide §10)

---

## 1. Tech Stack & Conventions

| Layer | Choice | Notes |
|---|---|---|
| Mobile framework | React Native + Expo (SDK, managed workflow) | Use Expo Router for file-based navigation — reduces boilerplate and matches Antigravity's file-path reasoning well |
| Web framework | React + Vite + TypeScript | Not CRA — faster builds, better DX |
| State/data fetching | TanStack Query (React Query) for all server state; local UI state via `useState`/`zustand` if needed | Never hand-roll fetch+useEffect caching — leads to stale-order-status bugs |
| Styling | Mobile: `nativewind` (Tailwind for RN) or StyleSheet with a shared design tokens file; Web: Tailwind | One design tokens file (colors, spacing, type scale) shared conceptually across mobile and web, even if not literally shared code |
| Forms | `react-hook-form` + `zod` resolver | Validate client-side, but **never trust client validation alone** — backend re-validates everything |
| Navigation (mobile) | Expo Router, role-based route groups (`(farmer)`, `(buyer)`) | |
| Navigation (web) | React Router, role-gated route groups (`/admin/*`, `/logistics/*`) | |
| API client | Single typed API client wrapping `fetch`/`axios`, generated from or validated against the shared `types` package (Master Guide §6.4) | All 4 apps import the same client shape — one place to fix a broken contract |
| Maps | `react-native-maps` (mobile), Google Maps JS API or Mapbox (web) | Needed for Logistics route view, live tracking, delivery address picking |
| Secure storage (mobile) | `expo-secure-store` for tokens — never AsyncStorage for anything auth-related | |
| Push notifications | Expo Notifications (`expo-notifications`) | Requires EAS build (not available in Expo Go for remote push in newer SDKs — confirm current SDK docs before Phase 3) |

---

## 2. Repo / Folder Structure (per app)

```
app-name/
├── app/                      # Expo Router screens (mobile) or /pages+/routes (web)
│   ├── (auth)/
│   ├── (farmer)/  or  (buyer)/  or  admin/  or  logistics/
│   └── _layout.tsx
├── components/
│   ├── ui/                   # generic design-system components
│   └── feature/               # feature-specific composed components
├── api/                       # typed API client + per-domain hooks (useOrders, useProducts...)
├── hooks/
├── stores/                    # zustand stores if any (auth session, cart)
├── types/                     # imports/re-exports from shared types package
├── constants/                 # order status label maps (Master Guide §3 table!), theme tokens
├── utils/
└── assets/
```

**Non-negotiable:** `constants/orderStatusLabels.ts` in every app must be generated from — or manually kept in exact sync with — the table in Master Guide §3. This is the #1 place demo inconsistency bugs come from. Add a comment linking back to that section.

---

## 3. Screen-by-Screen Build Criteria

Use this as your Definition-of-Done checklist per screen — an Antigravity task should reference the relevant row.

### Farmer App
| Screen | Must include | Acceptance criteria |
|---|---|---|
| Auth (OTP) | Phone entry, OTP entry, resend timer | Handles invalid OTP, expired OTP, resend cooldown UI |
| Dashboard | Today's sales, active orders count, low-stock alert, quick "Add Produce" | Loads from cached query, pull-to-refresh |
| Add/Edit Produce | Crop, photo upload, quantity, price, quality grade, harvest date | Client validation via zod; photo compressed before upload; disabled submit while uploading |
| Inventory | Available / reserved / sold split | Reflects backend-computed values, never locally recomputed |
| Order list/detail | Status shown via canonical label map | Status colors consistent with design tokens; tapping order shows full negotiation + pickup history |
| Negotiation/chat | Offer, counter, accept, reject | Optimistic UI only for the message send, **not** for accept (must wait for backend confirmation since accept creates an Order) |
| Earnings (P3) | Total, pending, by-crop breakdown | |

### Buyer App (consumer + bulk mode toggle)
| Screen | Must include | Acceptance criteria |
|---|---|---|
| Home (consumer) | Search, categories, nearby produce | Debounced search input (300ms) |
| Product detail | Farmer info, price, quality, harvest date, distance | Distance computed server-side, not client GPS math |
| Cart/checkout (consumer) | Quantity, delivery address, payment | Address must be geocoded before order placement |
| Bulk requirement form | Product, quantity, max price, quality, required-by date, delivery location | Server re-validates required-by is a future date |
| Supplier discovery (bulk) | List/match of farmers+FPOs against requirement | Distinguish AI-matched suggestions from full manual browse clearly in UI (label "AI suggested" badge) |
| Order tracking | Canonical status, per-farmer pickup progress for bulk | Bulk view must show `collected/total` progress bar (parent+child state from Master Guide §3) |

### Admin Web
| Screen | Must include | Acceptance criteria |
|---|---|---|
| Dashboard | Platform KPIs, today's activity, attention-required list | Numbers from real aggregation endpoints, not hardcoded |
| Farmer/Buyer management | Search, verify, suspend | Every destructive action (suspend) requires a confirm modal + reason field, logged server-side |
| Order monitoring | Full list/detail, canonical status | Read-only for status — Admin never force-sets order_status directly; only "escalate"/"flag" actions |
| Dispute management | Evidence viewer, resolution actions | Resolution action calls a dedicated `/disputes/:id/resolve` endpoint, never a generic order update |
| AI insights | Demand, price, spoilage panels | Clearly labeled as AI-generated with a timestamp of last computation |

### Logistics Web
| Screen | Must include | Acceptance criteria |
|---|---|---|
| Dashboard | Vehicles, orders, deliveries, issues KPIs | |
| Pickup management | Multi-pickup view for bulk orders | Shows each child pickup's own status independently |
| Route view (map) | Optimized route with stops | Falls back gracefully (ordered list) if map/AI service is slow or down — never block the screen on it |
| Vehicle/Driver management | CRUD + status | Only Logistics role can write here (enforced both client-hidden-UI and server) |
| Exception handling | Flag delayed/failed pickups | Triggers notification to affected farmer/buyer via backend, not client-side push |

---

## 4. Cross-App Coordination Rules (frontend-specific)

- **Never hardcode a status string in a screen.** Always import from the shared label map (§2). If a new status needs to be shown, that's a `contract-change` PR touching the Master Guide table first.
- **Optimistic UI is allowed for**: sending a chat/negotiation message, toggling a favorite, local form state. **Never** for: order status changes, payment confirmation, accept/reject actions that mutate backend state other apps depend on.
- **Loading/error states are mandatory on every data-fetching screen** — a blank screen during a live demo is the single most common hackathon failure. Always have a skeleton loader + retry-on-error UI.
- **Role guard at the router level, not just hidden buttons** — an Admin route accidentally reachable by a logistics_staff account (even with hidden buttons) is a real bug to avoid, not just cosmetic.

---

## 5. Antigravity Prompt Templates for Frontend Tasks

**New screen:**
```
GOAL: Build the [screen name] screen for [app].
REFERENCE: 01_FRONTEND_DEV_GUIDE.md §3 table row for this screen (acceptance criteria).
DATA SOURCE: use the typed API client in /api — do not call fetch directly in the component.
STATE: server state via TanStack Query hook (create one in /api if it doesn't exist); do not introduce a new state library.
STATUS LABELS: must use constants/orderStatusLabels.ts — do not inline status strings.
OUTPUT: component in /components/feature or /app route file, with loading/error/empty states.
DO NOT: touch shared /types, change navigation structure outside this screen, add new dependencies without flagging them in the PR description.
```

**Bug fix / status inconsistency:**
```
GOAL: [screen] shows [wrong status/behavior] — should match Master Guide §3 canonical state [X].
INVESTIGATE: is the label map out of sync, or is the API returning a status not in the canonical enum?
FIX SCOPE: constants/orderStatusLabels.ts and/or the specific component — do not modify backend enum from a frontend task.
```

---

## 6. Build & APK Guidance (avoid EAS/Expo build failures)

This is where most "everything worked in Expo Go, APK build breaks" pain comes from. Checklist before you ever try a production build:

1. **Use EAS Build, not classic `expo build`** — classic build service is deprecated; EAS is the current supported path.
2. **Run `expo-doctor` before every build attempt** — catches dependency/version mismatches early.
3. **Native modules parity check** — anything working in Expo Go must also be confirmed compatible with a custom dev client / bare build if you use any library requiring native code not in the Expo Go runtime (e.g. certain payment SDKs, some map providers). If a library needs native config, you need a **development build** (`expo-dev-client`), not Expo Go, from that point on — plan this switch early, not the week of submission.
4. **`app.json`/`app.config.ts` completeness** — package name (`android.package`), version code, permissions (camera for produce photos/delivery proof, location for pickup/delivery, notifications) must all be declared *before* the first EAS build, or the build will fail or the APK will crash at runtime when a permission is requested but undeclared.
5. **Environment variables** — use `EAS Secrets` / `.env` + `expo-constants` for the API base URL and Supabase anon key; **never hardcode a localhost URL** that only works on your dev machine — this is the #1 cause of "APK builds fine but nothing loads" bugs.
6. **Icon/splash/asset sizes** — verify all required icon sizes exist; missing assets are a common silent build failure.
7. **Test the actual APK on a real/emulated device before demo day** — Expo Go behavior (JS-only) can differ from a compiled APK (native modules, permissions prompts, deep links). Budget at least one full day for "build → install → click through every core flow on the real APK" before submission, not the night before.
8. **Two apps, two EAS projects** — Farmer App and Buyer App are separate Expo projects with separate `eas.json` profiles (`development`, `preview`, `production`) — don't try to conditionally brand one app as both; keep them as genuinely separate builds even if they share component/library code via a shared package.
9. **Signing** — let EAS manage your Android keystore unless you have a specific reason not to; losing a manually-managed keystore mid-project is unrecoverable for that app's identity.

---

## 7. Phase-by-Phase Frontend Plan (mirrors Master Guide §9)

- **Phase 0:** Auth flow (both mobile apps + both web apps) against real backend; shared types package wired in; design tokens file created.
- **Phase 1:** All V1 screens from §3 tables above, using real (not mocked) backend endpoints for the core order lifecycle.
- **Phase 2:** Bulk buyer flow, AI-surfacing UI (matching badges, demand/price/spoilage panels), route map view.
- **Phase 3:** Payments UI, disputes, ratings, live tracking map, notifications.
- **Phase 4:** EAS build hardening (§6), full-device walkthrough, demo script rehearsal on the actual APK (not Expo Go).

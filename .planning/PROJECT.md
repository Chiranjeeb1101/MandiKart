# MandiKart (FarmDirect - SIH 26033)
**Theme**: Agriculture, FoodTech & Rural Development

## Core Idea
A 4-surface digital marketplace removing intermediaries. Helps farmers decide what to sell, at what price, to whom, and ensures efficient delivery.
1. **Farmer App** (React Native/Expo): List produce, negotiate, track orders.
2. **Buyer App** (React Native/Expo): Consumer & Bulk modes. Discover, negotiate, order.
3. **Logistics Web** (React/Vite): AI-assisted route optimization, vehicle/driver assignment.
4. **Admin Web** (React/Vite): Full visibility, dispute resolution, verification.

## Architecture
- **Backend**: Node.js + Express/Fastify + TypeScript. Single source of truth for Order State and cross-entity writes.
- **Database**: Supabase (Postgres, Auth, Storage, RLS).
- **AI Service**: Async internal API for forecasting, matching, routing, and spoilage risk.

## Canonical Order State Machine
`PLACED → CONFIRMED → PICKUP_SCHEDULED → PICKUP_IN_PROGRESS → COLLECTED → IN_TRANSIT → DELIVERED → COMPLETED`
*(Side states: CANCELLED, FAILED, DISPUTED)*
*Bulk Orders*: Parent order advances to `COLLECTED` only when all child pickups reach `COLLECTED`.

## Critical Constraints & Rules
- **No Direct Supabase Writes**: Apps must NOT write to Supabase directly if it affects other apps (e.g., order state). All cross-entity writes MUST go via Backend API.
- **Shared Types**: Use a single shared `types` package for frontend and backend to avoid contract drift.
- **Optimistic UI**: Allowed for chat/negotiation. NEVER for order status, accept/reject, or payments.
- **State Machine**: The backend is the ONLY writer of order state. Ensure exact mapping of UI labels to the internal enum.

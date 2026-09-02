# Codebase Map - MandiKart

## Directory Structure
- `/Admin`: Admin Web App (React + Vite + TS)
- `/FarmerApp`: Farmer Mobile App (React Native + Expo)
- `/BuyerApp`: Buyer Mobile App (Consumer + Bulk) (React Native + Expo) - *Note: Check if merged or separate directory*
- `/Logistic`: Logistics Web App (React + Vite + TS)
- `/backend`: Node.js API (Express/Fastify + TS) - *Note: Needs to be set up*
- `/shared`: Shared Types and Contracts (TS) - *Note: Needs to be set up*

## Phase Plan (Current Status: Pre-Phase 0)
- **Phase 0 (Foundation)**: Supabase schema, shared types, Auth flow, CI setup.
- **Phase 1 (V1 Core)**: Basic CRUD, Negotiation -> Order flow, Manual Logistics.
- **Phase 2 (Bulk + AI)**: Bulk requirements, Order aggregation engine, AI integration (demand, route).
- **Phase 3 (Polish)**: Payments, Disputes, Ratings, Live tracking.

## Technical Details
- **Frontend Stack**: TanStack Query (Server State), Zustand (Local State), React Hook Form + Zod, Tailwind/Nativewind.
- **Backend Stack**: Zod Validation, Supabase Postgres with RLS, Background Jobs.

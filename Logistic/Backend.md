# Logistic - Backend

## Overview
This backend supports logistics operations for assigning pickups, tracking vehicle movement, managing routes, and updating fulfillment statuses.

## Core Features
- Vehicle and driver APIs
- Pickup scheduling and reassignment
- Route and delivery status tracking
- Exception reporting and escalation
- Coordination with orders and farmer/buyer events

## Suggested stack
- Node.js + Express or Fastify
- TypeScript
- Supabase/PostgreSQL
- Real-time status management
- Validation and role controls

## Responsibilities
- Enforce logistics-only assignments
- Synchronize pickup and delivery status changes
- Expose route-related data for dashboard and web views
- Trigger notifications for failed or delayed fulfillment

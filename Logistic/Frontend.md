# Logistic - Frontends

The MandiKart Logistics ecosystem consists of two integrated frontend applications:

## 1. Logistics Web Dashboard (`Logistic/frontend`)
Web dashboard for dispatchers, hub managers, and logistics administrators.
- **Stack**: React 19 + Vite + TypeScript + Tailwind CSS + Leaflet Maps
- **Features**:
  - Fleet & vehicle tracking with capacity monitoring
  - Route planning and optimization map view
  - Multi-stop pickup verification and schedule management
  - Order milestone tracking mapped to canonical state machine
  - Exception & Bad Delivery dispute handling

## 2. Delivery Partner Mobile App (`Logistic/partner-app`)
Native mobile application for on-ground delivery partners and drivers.
- **Stack**: React Native (Expo SDK 57) + React Navigation
- **Features**:
  - Secure biometric & credential login/logout flow
  - Today's earnings dashboard & live online/offline toggle
  - Turn-by-turn live GPS navigation & farm pickup manifests
  - Digital Proof of Delivery (POD) with photo & receiver OTP
  - Bad Delivery dispute protection workflow & 24/7 Mandi helpline
  - 5-tab clean bottom navigation (Home, Deliveries, Earnings, Ranking, Profile)

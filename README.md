# MandiKart

MandiKart is an agriculture marketplace project designed to connect farmers, users/buyers, administrators, and logistics teams in a single digital ecosystem.

## Project Overview
The platform is divided into four major app modules:

1. FarmerApp
   - Farmer-facing marketplace and inventory management
2. UserApp
   - Buyer-facing experience for browsing, ordering, and tracking
3. Admin
   - Platform oversight, moderation, and analytics
4. Logistic
   - Delivery, route, and fulfillment coordination

Each module contains two code subfolders:
- frontend
- backend

## Folder Structure

```text
MandiKart/
├── FarmerApp/
│   ├── frontend/
│   ├── backend/
│   ├── Frontend.md
│   └── Backend.md
├── UserApp/
│   ├── frontend/
│   ├── backend/
│   ├── Frontend.md
│   └── Backend.md
├── Admin/
│   ├── frontend/
│   ├── backend/
│   ├── Frontend.md
│   └── Backend.md
├── Logistic/
│   ├── frontend/
│   ├── backend/
│   ├── Frontend.md
│   └── Backend.md
├── README.md
├── 00_PROJECT_MASTER_GUIDE.md
├── 01_FRONTEND_DEV_GUIDE.md
├── 02_BACKEND_DEV_GUIDE.md
└── ...
```

## Module Responsibilities

### FarmerApp
- Manage produce listings
- Track inventory and crop availability
- View and respond to buyer requests
- Manage sales and fulfillment visibility

### UserApp
- Discover produce
- Compare prices and listings
- Place buyer orders
- Track delivery status

### Admin
- Manage platform users
- Monitor orders and disputes
- Review analytics and business insights
- Control verification and moderation flows

### Logistic
- Handle pickup scheduling
- Coordinate transport and route planning
- Update delivery status
- Manage exceptions and delays

## Development Approach
This repository follows a modular development setup where every domain has separate frontend and backend responsibilities. The docs in the root folder provide the master plan, frontend guidance, and backend guidance for the full project lifecycle.

## Notes
- Frontend and backend modules are kept separate for clean team ownership
- Each app is designed around role-based access and workflow-specific functionality
- The project is structured to support future growth, API integration, and operational monitoring

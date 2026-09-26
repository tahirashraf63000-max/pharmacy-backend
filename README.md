# Pharmacy POS — Backend

Node.js + Express + MongoDB (Mongoose) REST API for the Pharmacy POS system.
Layered OOP architecture: Route → Controller → Service → Repository → Model.

## Setup

```bash
cd backend
npm install
```

Update `.env` if needed (defaults shown below):

```
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/pharmacy_pos
JWT_SECRET=pharmacy_pos_super_secret_change_me
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

Make sure MongoDB is running locally (or point MONGO_URL to your own instance).

## Seed a default admin + categories

```bash
npm run seed
```

Creates:
- Admin login: `admin@pharmacy.com` / `Admin@123`
- Default categories: Pain Relief, Antibiotics, Vitamins, Cold & Flu, Digestive, Skin Care

## Run

```bash
npm run dev     # auto-restart on file changes
# or
npm start
```

API available at `http://localhost:5000/api`. Health check: `GET /api/health`.

## Folder structure

```
src/
├── config/        # database connection
├── models/        # Mongoose schemas
├── repositories/   # data access layer (BaseRepository + specific repos)
├── services/       # business logic
├── controllers/     # HTTP request/response handling
├── routes/         # Express routers
├── middleware/      # auth, role, validation, error handling
├── validators/      # manual request validators
└── utils/          # ApiError, ApiResponse, asyncHandler, pagination, invoice numbers
```

## Roles

- `admin` — full access
- `cashier` — POS + own sales
- `inventory_manager` — medicines, purchases, suppliers, inventory reports

Every route is protected by `authenticateUser` + `authorizeRoles(...)` middleware —
the frontend hides unauthorized UI, but the backend independently rejects
unauthorized requests regardless of what the frontend sends.

## Important security/business notes

- Selling price during a sale is **always** read from the database — never trusted from the client.
- Sales and purchases run inside MongoDB transactions so stock updates and the record creation succeed or fail together.
- Passwords are hashed with bcrypt and never returned in API responses.

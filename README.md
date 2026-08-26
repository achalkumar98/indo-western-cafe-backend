# Indo Western Cafe — Backend API

REST API for the Indo Western Cafe & Restaurant website — built with **Express**, **MongoDB** (Mongoose), **JWT authentication**, **Joi validation**, and **Swagger** docs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Joi |
| Docs | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| Security | Helmet, express-mongo-sanitize, express-rate-limit, CORS |
| Logging | Winston (console + rotating log files in production) |
| Linting | ESLint 8 |
| Formatting | Prettier |
| Git hooks | Husky pre-push (runs lint + prettier before every push) |

---

## Project Structure

```
backend/
├── server.js                   # Express entry point, route registration
├── .env                        # Environment variables (never commit)
├── .eslintrc.json              # ESLint config
├── .prettierrc.json            # Prettier config
├── .husky/pre-push             # Pre-push hook: lint + prettier
└── src/
    ├── config/
    │   ├── db.js               # Mongoose connection
    │   ├── index.js            # JWT secret, admin credentials
    │   └── swagger.js          # OpenAPI spec builder
    ├── controllers/            # Thin HTTP layer — calls services, sends JSON
    │   ├── authController.js
    │   ├── adminUserController.js
    │   ├── bannerController.js
    │   ├── galleryController.js
    │   ├── menuController.js
    │   ├── reservationController.js
    │   ├── settingsController.js
    │   └── statsController.js
    ├── middleware/
    │   ├── asyncHandler.js     # Wraps async handlers, forwards errors
    │   ├── auth.js             # JWT protect middleware
    │   ├── errorHandler.js     # Global 404 + error handler
    │   ├── rateLimiter.js      # form (20/15m) + auth (10/15m) limiters
    │   └── validate.js         # Joi schema middleware factory
    ├── models/
    │   ├── Banner.js           # Hero banner (title, subtitle, imageUrl, isActive)
    │   ├── GalleryItem.js      # Gallery photo (imageUrl, label, span, sortOrder)
    │   ├── MenuItem.js         # Menu item (category, name, price, isVeg, imageUrl…)
    │   ├── Reservation.js      # Table booking request
    │   ├── Settings.js         # Singleton — all public restaurant info + popularTimes
    │   └── User.js             # Admin account (username, passwordHash)
    ├── routes/
    │   ├── auth.js             # POST /register, POST /login, GET /me
    │   ├── adminUsers.js       # GET /admin/users, DELETE /admin/users/:id
    │   ├── banners.js          # Public: GET /banners/active — Admin CRUD
    │   ├── gallery.js          # Public: GET /gallery — Admin CRUD
    │   ├── menu.js             # Public: GET /menu — Admin CRUD
    │   ├── reservations.js     # Public: POST /reservations — Admin: list + update
    │   ├── reviews.js          # Google Places proxy: GET /reviews
    │   ├── settings.js         # Public: GET /settings — Admin: PATCH /settings/admin
    │   └── stats.js            # Admin: GET /admin/stats/summary, /trends
    ├── services/               # Business logic — called by controllers
    │   ├── adminUserService.js
    │   ├── authService.js
    │   ├── bannerService.js
    │   ├── galleryService.js
    │   ├── menuService.js
    │   ├── reservationService.js
    │   ├── settingsService.js
    │   └── statsService.js
    ├── validations/            # Joi schemas for every route
    │   ├── authValidation.js
    │   ├── bannerValidation.js
    │   ├── galleryValidation.js
    │   ├── menuValidation.js
    │   ├── reservationValidation.js
    │   └── settingsValidation.js
    └── utils/
        ├── logger.js           # Winston logger
        └── seed.js             # One-time DB seed (menu, banner, settings, gallery)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy the example and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/indo_western_cafe

CLIENT_URL=http://localhost:3000

# JWT
JWT_SECRET=your-strong-secret-here
JWT_EXPIRES_IN=12h

# Bootstrap admin (used if no DB admin exists yet)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password-here
ADMIN_SIGNUP_CODE=your-signup-code-here

# Google Places API (optional — for live reviews)
GOOGLE_PLACE_ID=ChIJ...
GOOGLE_MAPS_API_KEY=AIza...
```

### 3. Seed the database

Populates menu items, hero banner, default settings, and gallery photos.  
**Does NOT seed reservations** — those come from real guest bookings.

```bash
npm run seed
```

### 4. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

---

## API Reference

Interactive Swagger docs are available at:

```
http://localhost:5000/api/docs
```

### Public endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/settings` | Restaurant info, hours, highlights, popularTimes |
| GET | `/api/menu` | All available items grouped by category |
| GET | `/api/banners/active` | Currently active hero banner |
| GET | `/api/gallery` | All visible gallery photos |
| GET | `/api/reviews` | Google Places reviews proxy |
| POST | `/api/reservations` | Submit a table booking request |
| POST | `/api/auth/register` | Create admin account (requires signup code) |
| POST | `/api/auth/login` | Admin login → JWT |

### Admin endpoints (JWT required)

| Method | Path | Description |
|---|---|---|
| GET | `/api/auth/me` | Current admin info |
| GET | `/api/reservations` | List reservations (paginated, filterable) |
| PATCH | `/api/reservations/:id/status` | Update reservation status |
| DELETE | `/api/reservations/:id` | Delete reservation |
| GET | `/api/menu/admin` | All menu items (flat list) |
| POST | `/api/menu/admin` | Create menu item |
| PUT | `/api/menu/admin/:id` | Update menu item |
| DELETE | `/api/menu/admin/:id` | Delete menu item |
| GET | `/api/banners/admin` | All banners |
| POST | `/api/banners/admin` | Create banner |
| PUT | `/api/banners/admin/:id` | Update banner |
| DELETE | `/api/banners/admin/:id` | Delete banner |
| GET | `/api/gallery/admin` | All gallery items |
| POST | `/api/gallery/admin` | Add gallery photo |
| PUT | `/api/gallery/admin/:id` | Update gallery photo |
| DELETE | `/api/gallery/admin/:id` | Delete gallery photo |
| PATCH | `/api/settings/admin` | Update restaurant settings |
| GET | `/api/admin/stats/summary` | Dashboard KPIs |
| GET | `/api/admin/stats/trends` | Monthly booking trends |
| GET | `/api/admin/users` | List all admin accounts |
| DELETE | `/api/admin/users/:id` | Delete an admin account |

---

## Authentication

The API uses **Bearer JWT**. Include the token in every admin request:

```
Authorization: Bearer <token>
```

A bootstrap admin is always available via the `.env` credentials (`ADMIN_USERNAME` / `ADMIN_PASSWORD`) — useful for first login before any DB admin exists. New admins register via `POST /api/auth/register` with the `signupCode` from `.env`.

Usernames accept both plain handles (`admin`) and full email addresses (`achalkumar@gmail.com`).

---

## Menu Categories

The menu supports 11 categories (matching the physical menu board):

`Beverages` · `Starters` · `Egg` · `Dal` · `Rice` · `Roti` · `Naan` · `Biryani` · `Mains` · `Salads` · `Desserts`

Each item has: `category`, `name`, `price`, `isVeg`, `signature`, `available`, `sortOrder`, `imageUrl`.

---

## Google Reviews Setup

The `/api/reviews` endpoint proxies the Google Places API. Without credentials it returns a 503 with setup instructions. To enable:

1. Get a [Google Maps Platform API key](https://developers.google.com/maps/documentation/places/web-service/get-api-key)
2. Find your Place ID at [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
3. Add both to `.env`:

```env
GOOGLE_PLACE_ID=ChIJxxxxxxxxxxxxxxxx
GOOGLE_MAPS_API_KEY=AIzaxxxxxxxxxxxxxxxx
```

---

## Code Quality

```bash
# Check linting
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Check formatting
npm run prettier

# Auto-fix formatting
npm run prettier:fix

# Fix everything at once
npm run format
```

The Husky pre-push hook runs `npm run lint` and `npm run prettier` automatically before every `git push`. If either fails, the push is blocked.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `CLIENT_URL` | No | CORS allowed origin(s), comma-separated |
| `JWT_SECRET` | **Yes** | Strong random secret for signing tokens |
| `JWT_EXPIRES_IN` | No | Token TTL (default: `12h`) |
| `ADMIN_USERNAME` | No | Bootstrap admin username (default: `admin`) |
| `ADMIN_PASSWORD` | No | Bootstrap admin password |
| `ADMIN_SIGNUP_CODE` | No | Shared secret for new admin registration |
| `GOOGLE_PLACE_ID` | No | Google Maps Place ID (for reviews proxy) |
| `GOOGLE_MAPS_API_KEY` | No | Google Maps API key (for reviews proxy) |

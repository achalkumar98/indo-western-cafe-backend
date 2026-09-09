# Indo Western Cafe — Backend API

REST API for the Indo Western Cafe & Restaurant website.

---

## License

This project is proprietary software developed for a private client.  
All rights reserved. Unauthorized copying, distribution, or modification is strictly prohibited.

© 2024–2026 Indo Western Cafe & Restaurant. All rights reserved.

---

## Tech Stack

- **Runtime** — Node.js 20+
- **Framework** — Express 4
- **Database** — MongoDB via Mongoose 8
- **Auth** — JWT + bcryptjs
- **Docs** — Swagger UI
- **Deployment** — Render

---

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Create a `.env` file with the required variables (see Environment Variables below).

### 3. Seed the database

```bash
npm run seed
```

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGODB_URI` | **Yes** | MongoDB connection string |
| `CLIENT_URL` | No | CORS allowed origin |
| `JWT_SECRET` | **Yes** | Strong secret for signing tokens |
| `JWT_EXPIRES_IN` | No | Token TTL (default: `12h`) |
| `ADMIN_USERNAME` | No | Bootstrap admin username |
| `ADMIN_PASSWORD` | No | Bootstrap admin password |
| `ADMIN_SIGNUP_CODE` | No | Secret required to register new admins |
| `GOOGLE_PLACE_ID` | No | Google Maps Place ID (for reviews) |
| `GOOGLE_MAPS_API_KEY` | No | Google Maps API key (for reviews) |

---

## API Docs

Interactive Swagger docs (development only):

```
http://localhost:5000/v1/docs
```

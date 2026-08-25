require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./src/config/db");
const swaggerSpec = require("./src/config/swagger");
const logger = require("./src/utils/logger");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/auth");
const reservationRoutes = require("./src/routes/reservations");
const reviewRoutes = require("./src/routes/reviews");
const menuRoutes = require("./src/routes/menu");
const bannerRoutes = require("./src/routes/banners");
const settingsRoutes = require("./src/routes/settings");
const statsRoutes = require("./src/routes/stats");
const adminUserRoutes = require("./src/routes/adminUsers");

const app = express();
connectDB();

/**
 * CORS origin policy.
 * - Production: only the origins listed in CLIENT_URL (comma-separated).
 * - Development: those origins plus any localhost / 127.0.0.1 port.
 * - Requests without an Origin header are always allowed.
 */
function buildCorsOrigin() {
  const allowlist = (process.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isDev = process.env.NODE_ENV !== "production";
  const localhostRe = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

  return (origin, callback) => {
    if (!origin) {return callback(null, true);}
    if (allowlist.includes("*") || allowlist.includes(origin)) {return callback(null, true);}
    if (isDev && localhostRe.test(origin)) {return callback(null, true);}
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  };
}

app.use(helmet());
app.use(cors({ origin: buildCorsOrigin(), credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Health check
app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

// Interactive API docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "Indo Western API" }));
app.get("/api/docs.json", (req, res) => res.json(swaggerSpec));

// ─── Public routes ────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/settings", settingsRoutes);

// ─── Admin routes ─────────────────────────────────────────────────────────────
app.use("/api/admin/stats", statsRoutes);
app.use("/api/admin/users", adminUserRoutes);
// Admin sub-resources share the same router as their public counterparts but
// mount at /api/<resource>/admin* — handled inside each route file.

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`));

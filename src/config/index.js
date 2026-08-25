// Centralised runtime config. Values come from .env with safe dev fallbacks so
// the API still boots locally without a filled-in environment file.
module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || "indo-western-dev-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "12h",
  },
  admin: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "indowestern2026",
    // Shared secret required to register a new admin via POST /auth/register.
    signupCode: process.env.ADMIN_SIGNUP_CODE || "indo-western-admin",
  },
};

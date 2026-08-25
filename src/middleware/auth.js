const jwt = require("jsonwebtoken");
const config = require("../config");
const asyncHandler = require("./asyncHandler");

// Guards admin-only routes. Expects `Authorization: Bearer <token>`.
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — admin sign-in required");
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.admin = { username: decoded.username, role: decoded.role };
    next();
  } catch {
    res.status(401);
    throw new Error("Session expired or invalid — please sign in again");
  }
});

module.exports = { protect };

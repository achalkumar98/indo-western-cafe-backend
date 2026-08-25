const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const { loginSchema, registerSchema } = require("../validations/authValidation");
const authController = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Admin authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new admin (requires signup code)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, signupCode]
 *             properties:
 *               name: { type: string, example: Priya Sharma }
 *               username: { type: string, example: priya }
 *               password: { type: string, minLength: 8, example: strongpass123 }
 *               signupCode: { type: string, example: indo-western-admin-2026 }
 *     responses:
 *       201: { description: Admin created — token returned }
 *       400: { description: Validation failed }
 *       403: { description: Invalid signup code }
 *       409: { description: Username already taken }
 */
router.post("/register", authLimiter, validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin login — returns a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: admin }
 *               password: { type: string, example: indowestern2026 }
 *     responses:
 *       200: { description: Authenticated — token returned }
 *       401: { description: Invalid credentials }
 */
router.post("/login", authLimiter, validate(loginSchema), authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Return the admin decoded from the bearer token
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current admin info }
 *       401: { description: Not authorized }
 */
router.get("/me", protect, authController.me);

module.exports = router;

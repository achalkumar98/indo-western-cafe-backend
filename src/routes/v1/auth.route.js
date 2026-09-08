const express = require('express');
const { protect } = require('../../middlewares/auth');
const { authLimiter } = require('../../middlewares/rateLimiter');
const validate = require('../../middlewares/validate');
const { authValidation } = require('../../validations');
const { authController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Admin authentication — register, login, token introspection
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new admin account
 *     description: >
 *       Creates a new admin user. Requires a shared `signupCode` that is set
 *       in the server `.env` file (`ADMIN_SIGNUP_CODE`).
 *       Usernames accept plain handles (`priya`) **or** full email addresses
 *       (`priya@example.com`).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, signupCode]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Priya Sharma
 *                 description: Display name (optional)
 *               username:
 *                 type: string
 *                 example: achalkumar@gmail.com
 *                 description: Plain handle or full email address
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: strongpass123
 *               signupCode:
 *                 type: string
 *                 example: indo-western-admin-2026
 *                 description: Shared secret from ADMIN_SIGNUP_CODE env variable
 *     responses:
 *       201:
 *         description: Admin created — JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         description: Invalid signup code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Username already taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.post(
  '/register',
  authLimiter,
  validate({ body: authValidation.registerSchema }),
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin sign-in — returns a JWT
 *     description: >
 *       Authenticates an admin against the database **or** the bootstrap
 *       `.env` credentials (`ADMIN_USERNAME` / `ADMIN_PASSWORD`) if no DB
 *       admin exists yet.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 format: password
 *                 example: indowestern2026
 *     responses:
 *       200:
 *         description: Authenticated — JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.post(
  '/login',
  authLimiter,
  validate({ body: authValidation.loginSchema }),
  authController.login
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Return the admin decoded from the bearer token
 *     description: Introspects the JWT and returns the current admin's username and role.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/AdminUser'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/me', protect, authController.me);

module.exports = router;

const express = require('express');
const validate = require('../../middlewares/validate');
const { authLimiter } = require('../../middlewares/rateLimiter');
const { protect } = require('../../middlewares/auth');
const { authValidation } = require('../../validations');
const { authController } = require('../../controllers');

const router = express.Router();

router.post('/register', authLimiter, validate({ body: authValidation.registerSchema }), authController.register);
router.post('/login', authLimiter, validate({ body: authValidation.loginSchema }), authController.login);
router.get('/me', protect, authController.me);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - signupCode
 *             properties:
 *               name:
 *                 type: string
 *                 example: Priya Sharma
 *               username:
 *                 type: string
 *                 example: priya
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: strongpass123
 *               signupCode:
 *                 type: string
 *                 example: indo-western-admin
 *     responses:
 *       "201":
 *         description: Admin created — token returned
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

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
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: indowestern2026
 *     responses:
 *       "200":
 *         description: Authenticated — token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Return the current admin from bearer token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Current admin info
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const settingsController = require("../controllers/settingsController");
const { settingsUpdateSchema } = require("../validations/settingsValidation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: Restaurant contact & operational settings
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get public restaurant settings (phone, address, hours, etc.)
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Settings object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Settings' }
 */
router.get("/", settingsController.getSettings);

/**
 * @swagger
 * /admin/settings:
 *   patch:
 *     summary: Update restaurant settings (admin)
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Settings' }
 *     responses:
 *       200: { description: Settings updated }
 *       400: { description: Validation failed }
 *       401: { description: Not authorized }
 */
router.patch("/admin", protect, validate(settingsUpdateSchema), settingsController.updateSettings);

module.exports = router;

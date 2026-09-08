const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { settingsValidation } = require('../../validations');
const { settingsController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: >
 *       Restaurant operational settings — singleton document that powers the
 *       entire public site: phone, address, opening hours, pricing, social
 *       links, highlights, popular times chart, and the overview text.
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get all public restaurant settings (public)
 *     description: >
 *       Returns the singleton settings document. If no document exists yet,
 *       one is created with the schema defaults automatically.
 *
 *       Consumed by every section of the public site — Hero, Overview,
 *       Footer, ActionBar, PopularTimes, and Booking page all read from
 *       this endpoint.
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Full settings object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Settings'
 */
router.get('/', settingsController.getSettings);

/**
 * @swagger
 * /settings/admin:
 *   patch:
 *     summary: Update restaurant settings — partial update (admin)
 *     description: >
 *       Partial update — only the fields supplied are changed. All fields are
 *       optional; at least one must be present.
 *
 *       **`popularTimes`** accepts a partial day map — you can update a single
 *       day without supplying all 7:
 *       ```json
 *       { "popularTimes": { "Sat": [20,32,40,58,82,95,90,75,55,40,28,14] } }
 *       ```
 *       Each day's value is a 12-element array representing hourly busyness
 *       (0–100) from 11 AM to 10 PM.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SettingsUpdateInput'
 *     responses:
 *       200:
 *         description: Settings updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Settings updated
 *                 data:
 *                   $ref: '#/components/schemas/Settings'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch(
  '/admin',
  protect,
  validate({ body: settingsValidation.settingsUpdateSchema }),
  settingsController.updateSettings
);

module.exports = router;

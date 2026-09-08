const express = require('express');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth');
const { settingsValidation } = require('../../validations');
const { settingsController } = require('../../controllers');

const router = express.Router();

router.get('/', settingsController.getSettings);
router.patch('/admin', protect, validate({ body: settingsValidation.settingsUpdateSchema }), settingsController.updateSettings);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Restaurant contact and operational settings
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get public restaurant settings (public)
 *     tags: [Settings]
 *     responses:
 *       "200":
 *         description: Settings object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *                     closesAt:
 *                       type: string
 *                     isOpenNow:
 *                       type: boolean
 *                     priceRange:
 *                       type: string
 *                     rating:
 *                       type: number
 *                     reviewCount:
 *                       type: integer
 */

/**
 * @swagger
 * /settings/admin:
 *   patch:
 *     summary: Update restaurant settings (admin)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               closesAt:
 *                 type: string
 *                 example: "10:00 PM"
 *               isOpenNow:
 *                 type: boolean
 *               priceRange:
 *                 type: string
 *               rating:
 *                 type: number
 *               reviewCount:
 *                 type: integer
 *               highlights:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       "200":
 *         description: Settings updated
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

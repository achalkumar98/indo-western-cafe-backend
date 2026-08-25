const express = require("express");
const { protect } = require("../middleware/auth");
const statsController = require("../controllers/statsController");

const router = express.Router();
router.use(protect);

/**
 * @swagger
 * tags:
 *   - name: Stats
 *     description: Admin dashboard analytics
 */

/**
 * @swagger
 * /admin/stats/summary:
 *   get:
 *     summary: Headline KPIs, status breakdown (admin)
 *     tags: [Stats]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Summary metrics }
 *       401: { description: Not authorized }
 */
router.get("/summary", statsController.getSummary);

/**
 * @swagger
 * /admin/stats/trends:
 *   get:
 *     summary: Monthly reservation time-series (admin)
 *     tags: [Stats]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: months, schema: { type: integer, default: 6 } }
 *     responses:
 *       200: { description: Monthly series }
 *       401: { description: Not authorized }
 */
router.get("/trends", statsController.getTrends);

module.exports = router;

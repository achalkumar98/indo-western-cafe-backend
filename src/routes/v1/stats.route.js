const express = require('express');
const { protect } = require('../../middlewares/auth');
const { statsController } = require('../../controllers');

const router = express.Router();

// All stats routes require a valid JWT
router.use(protect);

/**
 * @swagger
 * tags:
 *   - name: Stats
 *     description: Admin dashboard analytics — KPI tiles and monthly time-series charts
 */

/**
 * @swagger
 * /admin/stats/summary:
 *   get:
 *     summary: Headline KPIs for the dashboard (admin)
 *     description: >
 *       Runs 6 parallel MongoDB aggregation queries and returns:
 *       - Total reservations, this-month vs last-month with MoM growth %
 *       - Status breakdown (pending / confirmed / cancelled)
 *       - Total guests served and guests this month (sum of `partySize`)
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary KPIs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/StatsSummary'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/summary', statsController.getSummary);

/**
 * @swagger
 * /admin/stats/trends:
 *   get:
 *     summary: Monthly reservation time-series (admin)
 *     description: >
 *       Returns a zero-filled month-by-month series for the past N months
 *       (default 6, max 24). Every month in the range is included even if
 *       there were no bookings — this ensures charts always render a
 *       continuous axis.
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 24
 *           default: 6
 *         description: Number of months to look back
 *     responses:
 *       200:
 *         description: Monthly time-series array
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TrendPoint'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/trends', statsController.getTrends);

module.exports = router;

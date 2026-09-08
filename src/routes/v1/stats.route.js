const express = require('express');
const { protect } = require('../../middlewares/auth');
const { statsController } = require('../../controllers');

const router = express.Router();

router.use(protect);
router.get('/summary', statsController.getSummary);
router.get('/trends', statsController.getTrends);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Admin dashboard analytics
 */

/**
 * @swagger
 * /admin/stats/summary:
 *   get:
 *     summary: Headline KPIs and status breakdown (admin)
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Summary metrics
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
 *                     reservations:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         thisMonth:
 *                           type: integer
 *                         lastMonth:
 *                           type: integer
 *                         growthPct:
 *                           type: number
 *                         byStatus:
 *                           type: object
 *                     customers:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         thisMonth:
 *                           type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /admin/stats/trends:
 *   get:
 *     summary: Monthly reservation time-series (admin)
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of months to return
 *     responses:
 *       "200":
 *         description: Monthly series
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       year:
 *                         type: integer
 *                       bookings:
 *                         type: integer
 *                       guests:
 *                         type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

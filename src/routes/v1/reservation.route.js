const express = require('express');
const { protect } = require('../../middlewares/auth');
const { formLimiter } = require('../../middlewares/rateLimiter');
const validate = require('../../middlewares/validate');
const { reservationValidation } = require('../../validations');
const { reservationController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reservations
 *     description: Table booking requests — public submission, admin management
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Submit a table booking request (public)
 *     description: >
 *       Rate-limited to 20 requests per 15 minutes per IP.
 *       The booking starts with status `pending`; admin confirms by phone.
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       201:
 *         description: Reservation request received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reservation request received — we'll confirm by phone shortly.
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *
 *   get:
 *     summary: List all reservations — paginated and filterable (admin)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, confirmed, cancelled]
 *         description: Filter by status (omit or pass `all` for no filter)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search on name, phone, or email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [-createdAt, createdAt, date, -date]
 *           default: -createdAt
 *     responses:
 *       200:
 *         description: Paginated list of reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReservations'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/',
  formLimiter,
  validate({ body: reservationValidation.reservationSchema }),
  reservationController.create
);
router.get(
  '/',
  protect,
  validate({ query: reservationValidation.listQuerySchema }),
  reservationController.list
);

/**
 * @swagger
 * /reservations/{id}/status:
 *   patch:
 *     summary: Update a reservation's status (admin)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Reservation MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
  '/:id/status',
  protect,
  validate({
    params: reservationValidation.idParamSchema,
    body: reservationValidation.statusUpdateSchema,
  }),
  reservationController.updateStatus
);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete a reservation (admin)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Reservation deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/:id',
  protect,
  validate({ params: reservationValidation.idParamSchema }),
  reservationController.remove
);

module.exports = router;

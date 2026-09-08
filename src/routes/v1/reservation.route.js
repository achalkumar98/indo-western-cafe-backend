const express = require('express');
const validate = require('../../middlewares/validate');
const { formLimiter } = require('../../middlewares/rateLimiter');
const { protect } = require('../../middlewares/auth');
const { reservationValidation } = require('../../validations');
const { reservationController } = require('../../controllers');

const router = express.Router();

router.post('/', formLimiter, validate({ body: reservationValidation.reservationSchema }), reservationController.create);
router.get('/', protect, validate({ query: reservationValidation.listQuerySchema }), reservationController.list);
router.patch('/:id/status', protect, validate({ params: reservationValidation.idParamSchema, body: reservationValidation.statusUpdateSchema }), reservationController.updateStatus);
router.delete('/:id', protect, validate({ params: reservationValidation.idParamSchema }), reservationController.remove);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Table booking requests
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Submit a table request (public)
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - customerMobileNumber
 *               - tableSize
 *               - date
 *               - time
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Rahul
 *               lastName:
 *                 type: string
 *                 example: Kumar
 *               customerMobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *               tableSize:
 *                 type: integer
 *                 example: 4
 *               date:
 *                 type: string
 *                 example: "2026-08-30"
 *               time:
 *                 type: string
 *                 example: "19:30"
 *               occasion:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Reservation request received
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *   get:
 *     summary: List reservations (admin)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, confirmed, cancelled]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Paginated reservations
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /reservations/{id}/status:
 *   patch:
 *     summary: Update a reservation status (admin)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *     responses:
 *       "200":
 *         description: Updated
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

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
 *     responses:
 *       "200":
 *         description: Deleted
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { formLimiter } = require("../middleware/rateLimiter");
const reservationController = require("../controllers/reservationController");
const {
  reservationSchema,
  listQuerySchema,
  statusUpdateSchema,
  idParamSchema,
} = require("../validations/reservationValidation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reservations
 *     description: Table booking requests
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
 *             required: [name, phone, partySize, date, time]
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               partySize: { type: integer, example: 4 }
 *               date: { type: string, example: "2026-08-30" }
 *               time: { type: string, example: "19:30" }
 *               occasion: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Reservation request received }
 *       400: { description: Validation failed }
 *   get:
 *     summary: List reservations (admin)
 *     tags: [Reservations]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string, enum: [all, pending, confirmed, cancelled] } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *       - { in: query, name: sort, schema: { type: string } }
 *     responses:
 *       200: { description: Paginated reservations }
 *       401: { description: Not authorized }
 */
router.post("/", formLimiter, validate(reservationSchema), reservationController.create);
router.get("/", protect, validate(listQuerySchema, "query"), reservationController.list);

/**
 * @swagger
 * /reservations/{id}/status:
 *   patch:
 *     summary: Update a reservation's status (admin)
 *     tags: [Reservations]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [pending, confirmed, cancelled] }
 *     responses:
 *       200: { description: Updated }
 *       401: { description: Not authorized }
 *       404: { description: Not found }
 */
router.patch(
  "/:id/status",
  protect,
  validate(idParamSchema, "params"),
  validate(statusUpdateSchema),
  reservationController.updateStatus
);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete a reservation (admin)
 *     tags: [Reservations]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Deleted }
 *       401: { description: Not authorized }
 *       404: { description: Not found }
 */
router.delete("/:id", protect, validate(idParamSchema, "params"), reservationController.remove);

module.exports = router;

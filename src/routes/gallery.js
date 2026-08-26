const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const galleryController = require("../controllers/galleryController");
const {
  galleryItemSchema,
  galleryItemUpdateSchema,
  idParamSchema,
} = require("../validations/galleryValidation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Gallery
 *     description: Restaurant photo gallery
 */

/**
 * @swagger
 * /gallery:
 *   get:
 *     summary: Get all visible gallery photos (public)
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: Array of gallery items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       imageUrl: { type: string }
 *                       label: { type: string }
 *                       span: { type: string, enum: [normal, tall, wide] }
 *                       sortOrder: { type: integer }
 */
router.get("/", galleryController.listPublic);

/**
 * @swagger
 * /admin/gallery:
 *   get:
 *     summary: List all gallery items (admin)
 *     tags: [Gallery]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: All gallery items }
 *       401: { description: Not authorized }
 *   post:
 *     summary: Add a gallery photo (admin)
 *     tags: [Gallery]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [imageUrl]
 *             properties:
 *               imageUrl: { type: string }
 *               label: { type: string }
 *               span: { type: string, enum: [normal, tall, wide] }
 *               sortOrder: { type: integer }
 *               visible: { type: boolean }
 *     responses:
 *       201: { description: Gallery item created }
 *       401: { description: Not authorized }
 */
router.get("/admin", protect, galleryController.listAll);
router.post("/admin", protect, validate(galleryItemSchema), galleryController.create);

/**
 * @swagger
 * /admin/gallery/{id}:
 *   put:
 *     summary: Update a gallery photo (admin)
 *     tags: [Gallery]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Updated }
 *       401: { description: Not authorized }
 *       404: { description: Not found }
 *   delete:
 *     summary: Delete a gallery photo (admin)
 *     tags: [Gallery]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Deleted }
 *       401: { description: Not authorized }
 *       404: { description: Not found }
 */
router.put(
  "/admin/:id",
  protect,
  validate(idParamSchema, "params"),
  validate(galleryItemUpdateSchema),
  galleryController.update
);
router.delete(
  "/admin/:id",
  protect,
  validate(idParamSchema, "params"),
  galleryController.remove
);

module.exports = router;

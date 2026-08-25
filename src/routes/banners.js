const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const bannerController = require("../controllers/bannerController");
const {
  bannerSchema,
  bannerUpdateSchema,
  idParamSchema,
} = require("../validations/bannerValidation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Banners
 *     description: Hero banner management
 */

/**
 * @swagger
 * /banners/active:
 *   get:
 *     summary: Get the currently active banner (public)
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Active banner or null
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Banner' }
 */
router.get("/active", bannerController.getActive);

/**
 * @swagger
 * /admin/banners:
 *   get:
 *     summary: List all banners (admin)
 *     tags: [Banners]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: All banners }
 *       401: { description: Not authorized }
 *   post:
 *     summary: Create a banner (admin)
 *     tags: [Banners]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Banner' }
 *     responses:
 *       201: { description: Banner created }
 *       400: { description: Validation failed }
 *       401: { description: Not authorized }
 */
router.get("/admin", protect, bannerController.listAll);
router.post("/admin", protect, validate(bannerSchema), bannerController.create);

/**
 * @swagger
 * /admin/banners/{id}:
 *   put:
 *     summary: Update a banner (admin)
 *     tags: [Banners]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Banner' }
 *     responses:
 *       200: { description: Updated }
 *       401: { description: Not authorized }
 *       404: { description: Not found }
 *   delete:
 *     summary: Delete a banner (admin)
 *     tags: [Banners]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Deleted }
 *       401: { description: Not authorized }
 *       404: { description: Not found }
 */
router.put("/admin/:id", protect, validate(idParamSchema, "params"), validate(bannerUpdateSchema), bannerController.update);
router.delete("/admin/:id", protect, validate(idParamSchema, "params"), bannerController.remove);

module.exports = router;

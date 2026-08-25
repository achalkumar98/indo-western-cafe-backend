const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const menuController = require("../controllers/menuController");
const {
  menuItemSchema,
  menuItemUpdateSchema,
  idParamSchema,
} = require("../validations/menuValidation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Menu
 *     description: Restaurant menu management
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all available menu items grouped by category (public)
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Menu items grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category: { type: string }
 *                       items:
 *                         type: array
 *                         items: { $ref: '#/components/schemas/MenuItem' }
 */
router.get("/", menuController.listPublic);

/**
 * @swagger
 * /admin/menu:
 *   get:
 *     summary: List all menu items flat (admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: category, schema: { type: string, enum: [Beverages, Starters, Mains, Desserts] } }
 *     responses:
 *       200: { description: All menu items }
 *       401: { description: Not authorized }
 *   post:
 *     summary: Create a menu item (admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MenuItem' }
 *     responses:
 *       201: { description: Menu item created }
 *       400: { description: Validation failed }
 *       401: { description: Not authorized }
 */
router.get("/admin", protect, menuController.listAll);
router.post("/admin", protect, validate(menuItemSchema), menuController.create);

/**
 * @swagger
 * /admin/menu/{id}:
 *   put:
 *     summary: Update a menu item (admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MenuItem' }
 *     responses:
 *       200: { description: Updated }
 *       401: { description: Not authorized }
 *       404: { description: Not found }
 *   delete:
 *     summary: Delete a menu item (admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Deleted }
 *       401: { description: Not authorized }
 *       404: { description: Not found }
 */
router.put("/admin/:id", protect, validate(idParamSchema, "params"), validate(menuItemUpdateSchema), menuController.update);
router.delete("/admin/:id", protect, validate(idParamSchema, "params"), menuController.remove);

module.exports = router;

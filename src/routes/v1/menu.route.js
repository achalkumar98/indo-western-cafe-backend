const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { menuValidation } = require('../../validations');
const { menuController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Menu
 *     description: Restaurant menu — public grouped view, admin full CRUD
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all available menu items grouped by category (public)
 *     description: >
 *       Returns only items where `available: true`, sorted by category then
 *       `sortOrder`. The response groups items by category for easy rendering
 *       in tabbed menus.
 *
 *       **Categories (in display order):**
 *       Beverages · Starters · Egg · Dal · Rice · Roti · Naan · Biryani ·
 *       Mains · Salads · Desserts
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Menu items grouped by category
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
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Biryani
 *                       items:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/MenuItem'
 */
router.get('/', menuController.listPublic);

/**
 * @swagger
 * /menu/admin:
 *   get:
 *     summary: List all menu items flat — includes unavailable (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Beverages, Starters, Egg, Dal, Rice, Roti, Naan, Biryani, Mains, Salads, Desserts]
 *         description: Filter by a single category
 *     responses:
 *       200:
 *         description: Flat array of all menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     summary: Create a new menu item (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItemInput'
 *     responses:
 *       201:
 *         description: Menu item created
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
 *                   $ref: '#/components/schemas/MenuItem'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/admin', protect, menuController.listAll);
router.post(
  '/admin',
  protect,
  validate({ body: menuValidation.menuItemSchema }),
  menuController.create
);

/**
 * @swagger
 * /menu/admin/{id}:
 *   put:
 *     summary: Update a menu item (admin)
 *     description: Partial update — only the fields supplied are changed.
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItemUpdateInput'
 *     responses:
 *       200:
 *         description: Menu item updated
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
 *                   $ref: '#/components/schemas/MenuItem'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a menu item (admin)
 *     tags: [Menu]
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
 *         description: Menu item deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  '/admin/:id',
  protect,
  validate({ params: menuValidation.idParamSchema, body: menuValidation.menuItemUpdateSchema }),
  menuController.update
);
router.delete(
  '/admin/:id',
  protect,
  validate({ params: menuValidation.idParamSchema }),
  menuController.remove
);

module.exports = router;

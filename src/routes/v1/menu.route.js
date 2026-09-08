const express = require('express');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth');
const { menuValidation } = require('../../validations');
const { menuController } = require('../../controllers');

const router = express.Router();

router.get('/', menuController.listPublic);
router.get('/admin', protect, menuController.listAll);
router.post('/admin', protect, validate({ body: menuValidation.menuItemSchema }), menuController.create);
router.put('/admin/:id', protect, validate({ params: menuValidation.idParamSchema, body: menuValidation.menuItemUpdateSchema }), menuController.update);
router.delete('/admin/:id', protect, validate({ params: menuValidation.idParamSchema }), menuController.remove);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Restaurant menu management
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all available menu items grouped by category (public)
 *     tags: [Menu]
 *     responses:
 *       "200":
 *         description: Menu items grouped by category
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
 *                       category:
 *                         type: string
 *                       items:
 *                         type: array
 */

/**
 * @swagger
 * /menu/admin:
 *   get:
 *     summary: List all menu items flat (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Beverages, Starters, Mains, Desserts, Egg, Dal, Rice, Roti, Naan, Biryani, Salads]
 *     responses:
 *       "200":
 *         description: All menu items
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a menu item (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - name
 *               - price
 *               - isVeg
 *             properties:
 *               category:
 *                 type: string
 *                 example: Starters
 *               name:
 *                 type: string
 *                 example: Chicken Chilli
 *               price:
 *                 type: number
 *                 example: 220
 *               isVeg:
 *                 type: boolean
 *                 example: false
 *               signature:
 *                 type: boolean
 *               available:
 *                 type: boolean
 *               sortOrder:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Menu item created
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /menu/admin/{id}:
 *   put:
 *     summary: Update a menu item (admin)
 *     tags: [Menu]
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
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: Updated
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
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
 *     responses:
 *       "200":
 *         description: Deleted
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

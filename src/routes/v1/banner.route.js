const express = require('express');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth');
const { bannerValidation } = require('../../validations');
const { bannerController } = require('../../controllers');

const router = express.Router();

router.get('/active', bannerController.getActive);
router.get('/admin', protect, bannerController.listAll);
router.post('/admin', protect, validate({ body: bannerValidation.bannerSchema }), bannerController.create);
router.put('/admin/:id', protect, validate({ params: bannerValidation.idParamSchema, body: bannerValidation.bannerUpdateSchema }), bannerController.update);
router.delete('/admin/:id', protect, validate({ params: bannerValidation.idParamSchema }), bannerController.remove);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Hero banner management
 */

/**
 * @swagger
 * /banners/active:
 *   get:
 *     summary: Get the currently active banner (public)
 *     tags: [Banners]
 *     responses:
 *       "200":
 *         description: Active banner or null
 */

/**
 * @swagger
 * /banners/admin:
 *   get:
 *     summary: List all banners (admin)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: All banners
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a banner (admin)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Indo Western
 *               subtitle:
 *                 type: string
 *               tagline:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       "201":
 *         description: Banner created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /banners/admin/{id}:
 *   put:
 *     summary: Update a banner (admin)
 *     tags: [Banners]
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
 *               title:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: Updated
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a banner (admin)
 *     tags: [Banners]
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

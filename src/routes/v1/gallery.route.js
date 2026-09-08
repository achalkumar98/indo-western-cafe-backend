const express = require('express');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth');
const { galleryValidation } = require('../../validations');
const { galleryController } = require('../../controllers');

const router = express.Router();

router.get('/', galleryController.listPublic);
router.get('/admin', protect, galleryController.listAll);
router.post('/admin', protect, validate({ body: galleryValidation.galleryItemSchema }), galleryController.create);
router.put('/admin/:id', protect, validate({ params: galleryValidation.idParamSchema, body: galleryValidation.galleryItemUpdateSchema }), galleryController.update);
router.delete('/admin/:id', protect, validate({ params: galleryValidation.idParamSchema }), galleryController.remove);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Restaurant photo gallery
 */

/**
 * @swagger
 * /gallery:
 *   get:
 *     summary: Get all visible gallery photos (public)
 *     tags: [Gallery]
 *     responses:
 *       "200":
 *         description: Array of gallery items
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       label:
 *                         type: string
 *                       span:
 *                         type: string
 *                         enum: [normal, tall, wide]
 *                       sortOrder:
 *                         type: integer
 */

/**
 * @swagger
 * /gallery/admin:
 *   get:
 *     summary: List all gallery items (admin)
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: All gallery items
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Add a gallery photo (admin)
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *             properties:
 *               imageUrl:
 *                 type: string
 *               label:
 *                 type: string
 *               span:
 *                 type: string
 *                 enum: [normal, tall, wide]
 *               sortOrder:
 *                 type: integer
 *               visible:
 *                 type: boolean
 *     responses:
 *       "201":
 *         description: Gallery item created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /gallery/admin/{id}:
 *   put:
 *     summary: Update a gallery photo (admin)
 *     tags: [Gallery]
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
 *               label:
 *                 type: string
 *               span:
 *                 type: string
 *               visible:
 *                 type: boolean
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       "200":
 *         description: Updated
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a gallery photo (admin)
 *     tags: [Gallery]
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

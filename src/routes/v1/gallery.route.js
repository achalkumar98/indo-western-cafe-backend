const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { galleryValidation } = require('../../validations');
const { galleryController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Gallery
 *     description: Restaurant photo gallery — public visible photos, admin full CRUD with ordering
 */

/**
 * @swagger
 * /gallery:
 *   get:
 *     summary: Get all visible gallery photos (public)
 *     description: >
 *       Returns only items where `visible: true`, sorted by `sortOrder` then
 *       `createdAt`. Each item includes a `span` field (`normal` · `tall` ·
 *       `wide`) that controls its position in the CSS grid mosaic.
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: Visible gallery photos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 6
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GalleryItem'
 */
router.get('/', galleryController.listPublic);

/**
 * @swagger
 * /gallery/admin:
 *   get:
 *     summary: List all gallery items including hidden (admin)
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All gallery items
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
 *                     $ref: '#/components/schemas/GalleryItem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     summary: Add a new gallery photo (admin)
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GalleryItemInput'
 *     responses:
 *       201:
 *         description: Gallery photo added
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
 *                   $ref: '#/components/schemas/GalleryItem'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/admin', protect, galleryController.listAll);
router.post(
  '/admin',
  protect,
  validate({ body: galleryValidation.galleryItemSchema }),
  galleryController.create
);

/**
 * @swagger
 * /gallery/admin/{id}:
 *   put:
 *     summary: Update a gallery photo (admin)
 *     description: >
 *       Partial update. Use this to toggle `visible`, change `sortOrder` for
 *       reordering, update the `label`, or change the `span` grid layout.
 *     tags: [Gallery]
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
 *             $ref: '#/components/schemas/GalleryItemUpdateInput'
 *     responses:
 *       200:
 *         description: Gallery photo updated
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
 *                   $ref: '#/components/schemas/GalleryItem'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
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
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Gallery photo deleted
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
  validate({
    params: galleryValidation.idParamSchema,
    body: galleryValidation.galleryItemUpdateSchema,
  }),
  galleryController.update
);
router.delete(
  '/admin/:id',
  protect,
  validate({ params: galleryValidation.idParamSchema }),
  galleryController.remove
);

module.exports = router;

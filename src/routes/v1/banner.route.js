const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { bannerValidation } = require('../../validations');
const { bannerController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Banners
 *     description: Hero banner management — public active-banner fetch, admin full CRUD
 */

/**
 * @swagger
 * /banners/active:
 *   get:
 *     summary: Get the currently active hero banner (public)
 *     description: >
 *       Returns the most recently updated banner where `isActive: true`.
 *       Returns `null` in `data` when no active banner exists — the frontend
 *       falls back to a default Unsplash image in that case.
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Active banner or null
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Banner'
 *                     - type: 'null'
 */
router.get('/active', bannerController.getActive);

/**
 * @swagger
 * /banners/admin:
 *   get:
 *     summary: List all banners (admin)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All banners sorted by creation date descending
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
 *                     $ref: '#/components/schemas/Banner'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     summary: Create a new hero banner (admin)
 *     description: Set isActive to true to make this banner live on the homepage. Only one banner should be active at a time.
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BannerInput'
 *     responses:
 *       201:
 *         description: Banner created
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
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/admin', protect, bannerController.listAll);
router.post(
  '/admin',
  protect,
  validate({ body: bannerValidation.bannerSchema }),
  bannerController.create
);

/**
 * @swagger
 * /banners/admin/{id}:
 *   put:
 *     summary: Update a banner (admin)
 *     description: >
 *       Partial update — supply only the fields to change.
 *       To activate a banner, set isActive to true. Deactivate others manually if needed.
 *     tags: [Banners]
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
 *             $ref: '#/components/schemas/BannerUpdateInput'
 *     responses:
 *       200:
 *         description: Banner updated
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
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
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
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Banner deleted
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
  validate({ params: bannerValidation.idParamSchema, body: bannerValidation.bannerUpdateSchema }),
  bannerController.update
);
router.delete(
  '/admin/:id',
  protect,
  validate({ params: bannerValidation.idParamSchema }),
  bannerController.remove
);

module.exports = router;

const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { settingsValidation } = require('../../validations');
const { adminUserController } = require('../../controllers');

const router = express.Router();

// All admin-user routes require a valid JWT
router.use(protect);

/**
 * @swagger
 * tags:
 *   - name: AdminUsers
 *     description: Admin account management — list all admins, delete a specific admin
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all admin accounts (admin)
 *     description: >
 *       Returns all registered admin users sorted by creation date descending.
 *       `passwordHash` is never included in the response.
 *
 *       **Note:** The bootstrap admin from `.env` (`ADMIN_USERNAME`) is not
 *       stored in MongoDB and will not appear in this list.
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of admin users
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
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminUser'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', adminUserController.listAdmins);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete an admin account (admin — cannot self-delete)
 *     description: >
 *       Permanently deletes the admin. The currently authenticated admin
 *       **cannot delete their own account** — a 403 is returned if attempted.
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         description: Admin MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Admin deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Cannot delete your own account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/:id',
  validate({ params: settingsValidation.idParamSchema }),
  adminUserController.removeAdmin
);

module.exports = router;

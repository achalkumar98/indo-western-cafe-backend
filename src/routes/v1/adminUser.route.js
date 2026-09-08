const express = require('express');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth');
const { settingsValidation } = require('../../validations');
const { adminUserController } = require('../../controllers');

const router = express.Router();

router.use(protect);
router.get('/', adminUserController.listAdmins);
router.delete('/:id', validate({ params: settingsValidation.idParamSchema }), adminUserController.removeAdmin);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: AdminUsers
 *   description: Admin account management
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all admin accounts (admin)
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Array of admin users
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
 *                       username:
 *                         type: string
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete an admin account (cannot self-delete)
 *     tags: [AdminUsers]
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
 *         description: Admin deleted
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

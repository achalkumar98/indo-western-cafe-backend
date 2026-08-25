const express = require("express");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const adminUserController = require("../controllers/adminUserController");
const { idParamSchema } = require("../validations/settingsValidation");

const router = express.Router();

// All routes are admin-only
router.use(protect);

/**
 * @swagger
 * tags:
 *   - name: AdminUsers
 *     description: Admin account management
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all admin accounts (admin)
 *     tags: [AdminUsers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Array of admin users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 *       401: { description: Not authorized }
 */
router.get("/", adminUserController.listAdmins);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete an admin account (admin, cannot self-delete)
 *     tags: [AdminUsers]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Admin deleted }
 *       401: { description: Not authorized }
 *       403: { description: Cannot delete your own account }
 *       404: { description: Not found }
 */
router.delete("/:id", validate(idParamSchema, "params"), adminUserController.removeAdmin);

module.exports = router;

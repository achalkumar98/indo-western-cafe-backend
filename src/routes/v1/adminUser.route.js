const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { settingsValidation } = require('../../validations');
const { adminUserController } = require('../../controllers');

const router = express.Router();

router.use(protect);
router.get('/', adminUserController.listAdmins);
router.delete('/:id', validate({ params: settingsValidation.idParamSchema }), adminUserController.removeAdmin);

module.exports = router;

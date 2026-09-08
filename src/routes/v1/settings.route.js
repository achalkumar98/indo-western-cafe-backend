const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { settingsValidation } = require('../../validations');
const { settingsController } = require('../../controllers');

const router = express.Router();

router.get('/', settingsController.getSettings);
router.patch('/admin', protect, validate({ body: settingsValidation.settingsUpdateSchema }), settingsController.updateSettings);

module.exports = router;

const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { bannerValidation } = require('../../validations');
const { bannerController } = require('../../controllers');

const router = express.Router();

router.get('/active', bannerController.getActive);
router.get('/admin', protect, bannerController.listAll);
router.post('/admin', protect, validate({ body: bannerValidation.bannerSchema }), bannerController.create);
router.put('/admin/:id', protect, validate({ params: bannerValidation.idParamSchema, body: bannerValidation.bannerUpdateSchema }), bannerController.update);
router.delete('/admin/:id', protect, validate({ params: bannerValidation.idParamSchema }), bannerController.remove);

module.exports = router;

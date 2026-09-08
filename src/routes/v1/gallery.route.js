const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { galleryValidation } = require('../../validations');
const { galleryController } = require('../../controllers');

const router = express.Router();

router.get('/', galleryController.listPublic);
router.get('/admin', protect, galleryController.listAll);
router.post('/admin', protect, validate({ body: galleryValidation.galleryItemSchema }), galleryController.create);
router.put('/admin/:id', protect, validate({ params: galleryValidation.idParamSchema, body: galleryValidation.galleryItemUpdateSchema }), galleryController.update);
router.delete('/admin/:id', protect, validate({ params: galleryValidation.idParamSchema }), galleryController.remove);

module.exports = router;

const express = require('express');
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { menuValidation } = require('../../validations');
const { menuController } = require('../../controllers');

const router = express.Router();

router.get('/', menuController.listPublic);
router.get('/admin', protect, menuController.listAll);
router.post('/admin', protect, validate({ body: menuValidation.menuItemSchema }), menuController.create);
router.put('/admin/:id', protect, validate({ params: menuValidation.idParamSchema, body: menuValidation.menuItemUpdateSchema }), menuController.update);
router.delete('/admin/:id', protect, validate({ params: menuValidation.idParamSchema }), menuController.remove);

module.exports = router;

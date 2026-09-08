const express = require('express');
const { protect } = require('../../middlewares/auth');
const { formLimiter } = require('../../middlewares/rateLimiter');
const validate = require('../../middlewares/validate');
const { reservationValidation } = require('../../validations');
const { reservationController } = require('../../controllers');

const router = express.Router();

router.post('/', formLimiter, validate({ body: reservationValidation.reservationSchema }), reservationController.create);
router.get('/', protect, validate({ query: reservationValidation.listQuerySchema }), reservationController.list);
router.patch('/:id/status', protect, validate({ params: reservationValidation.idParamSchema, body: reservationValidation.statusUpdateSchema }), reservationController.updateStatus);
router.delete('/:id', protect, validate({ params: reservationValidation.idParamSchema }), reservationController.remove);

module.exports = router;

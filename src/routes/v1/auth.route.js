const express = require('express');
const { protect } = require('../../middlewares/auth');
const { authLimiter } = require('../../middlewares/rateLimiter');
const validate = require('../../middlewares/validate');
const { authValidation } = require('../../validations');
const { authController } = require('../../controllers');

const router = express.Router();

router.post('/register', authLimiter, validate({ body: authValidation.registerSchema }), authController.register);
router.post('/login', authLimiter, validate({ body: authValidation.loginSchema }), authController.login);
router.get('/me', protect, authController.me);

module.exports = router;

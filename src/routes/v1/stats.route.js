const express = require('express');
const { protect } = require('../../middlewares/auth');
const { statsController } = require('../../controllers');

const router = express.Router();

router.use(protect);
router.get('/summary', statsController.getSummary);
router.get('/trends', statsController.getTrends);

module.exports = router;

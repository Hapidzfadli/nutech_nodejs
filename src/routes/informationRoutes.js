const express = require('express');
const router = express.Router();
const {getBanners, getServices} = require('../controllers/informationController');
const { authenticate } = require('../middlewares/auth');

router.get('/banner', getBanners);
router.get('/services', authenticate, getServices);

module.exports = router;
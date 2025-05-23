
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { getFilteredPoojaImages } = require('../controllers/bannerController');

router.get('/allimages', getFilteredPoojaImages);
module.exports = router;

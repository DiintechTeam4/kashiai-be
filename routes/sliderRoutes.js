
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadSliderImages,getAllSliderImages } = require('../controllers/sliderController');

router.post('/upload', uploadSliderImages);
router.get('/images', getAllSliderImages);
module.exports = router;

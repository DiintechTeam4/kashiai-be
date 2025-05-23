const express = require('express');
const router = express.Router();
const {createYatra,getYatraBookingsByUser} = require('../controllers/yatraController');

router.post('/:userId', createYatra);
router.get('/history/:userId',getYatraBookingsByUser)
module.exports = router;

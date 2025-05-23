const express = require('express');
const router = express.Router();
const { getOrderHistoryForPoojas,getApprovedPoojas,getDonePoojas } = require('../controllers/poojaorderhistoryController');

router.get('/:user_id', getOrderHistoryForPoojas);
router.get('/order-history/approved', getApprovedPoojas);
router.get('/order-history/done', getDonePoojas);
module.exports = router;

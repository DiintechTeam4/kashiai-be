const express = require('express');
const router = express.Router();
const { getOrderHistoryForProducts } = require('../controllers/productorderhistoryController');

router.get('/:user_id', getOrderHistoryForProducts);

module.exports = router;

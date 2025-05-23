
const express = require('express');
const productpaymentController = require('../controllers/productpaymentController');

const router = express.Router();

router.post('/initiate/:user_id/:cart_id', productpaymentController.initiatePayment);


router.post('/response', productpaymentController.handlePaymentResponse);

module.exports = router;

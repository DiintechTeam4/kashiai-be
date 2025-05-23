const express = require('express');
const poojapaymentController = require('../controllers/poojapaymentController');

const router = express.Router();


router.post('/initiate/:user_id/:cart_id', poojapaymentController.initiatePayment);


router.post('/response', poojapaymentController.handlePaymentResponse);

module.exports = router;

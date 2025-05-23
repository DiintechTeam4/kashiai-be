const express = require('express');
const router = express.Router();

const { confirmPoojaPayment, confirmProductPayment } = require('../controllers/paymentstatusController');


router.get('/confirm-pooja-payment/:cartId', confirmPoojaPayment);


router.get('/confirm-product-payment/:cartId', confirmProductPayment);

module.exports = router;

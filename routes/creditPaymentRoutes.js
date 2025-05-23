const express = require("express");
const router = express.Router();
const creditPaymentController = require("../controllers/creditPaymentController");

router.post("/initiate/:user_id/:credit_id", creditPaymentController.initiateCreditPayment);
router.post("/response", creditPaymentController.handlePaymentResponse);

module.exports = router;


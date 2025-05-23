const express = require("express");
const router = express.Router();
const { getOrderHistoryForCredits } = require("../controllers/orderHistoryController");

router.get("/:user_id", getOrderHistoryForCredits);

module.exports = router;

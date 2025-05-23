const express = require("express");
const router = express.Router();
const { sendPujaRequest } = require("../controllers/ondemandPoojaController");


router.post("/:userId/:poojaId", sendPujaRequest);


module.exports = router;

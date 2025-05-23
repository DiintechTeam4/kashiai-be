const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.post("/:userId", addressController.createAddress);
router.get("/:userId", addressController.getUserAddresses);
router.put("/:userId", addressController.updateAddress);
router.delete("/:userId", addressController.deleteAddress);

module.exports = router;

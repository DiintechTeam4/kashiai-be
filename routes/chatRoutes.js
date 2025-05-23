const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/session/:userId", chatController.createSession);
router.post("/:userId/:sessionId", chatController.storeChat);
router.get("/:userId/:sessionId", chatController.getChatsByUser);

module.exports = router;

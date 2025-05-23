const express = require("express");
const router = express.Router();
const voiceChatController = require("../controllers/voiceChatController");

router.post("/:userId", voiceChatController.storeVoiceChat);


router.get("/:userId", voiceChatController.getVoiceChatsByUser);

module.exports = router;

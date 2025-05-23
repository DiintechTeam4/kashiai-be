const mongoose = require("mongoose");

const voiceChatSessionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    sessionId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("VoiceChatSession", voiceChatSessionSchema);

const mongoose = require("mongoose");

const voiceChatSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    sender: { type: String, enum: ["user", "agent"], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VoiceChat", voiceChatSchema);

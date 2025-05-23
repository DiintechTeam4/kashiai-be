const mongoose = require("mongoose");

const userActionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    astroId: { type: mongoose.Schema.Types.ObjectId, ref: "Astro", required: true },
    actionType: { type: String, enum: ["call", "chat"], required: true },
    action_status: { type: String, enum: ["APPROVED", "PENDING", "DONE"], default: "APPROVED" },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserAction", userActionSchema);

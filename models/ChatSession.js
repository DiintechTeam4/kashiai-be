const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    sessionId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Session", sessionSchema);

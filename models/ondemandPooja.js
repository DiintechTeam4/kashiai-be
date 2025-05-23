const mongoose = require("mongoose");

const onDemandPoojaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    poojaId: { type: mongoose.Schema.Types.ObjectId, ref: "Pooja", required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "DONE"], default: "APPROVED" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("OnDemandPooja", onDemandPoojaSchema);

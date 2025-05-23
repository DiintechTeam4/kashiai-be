const mongoose = require("mongoose");

const creditPlanSchema = new mongoose.Schema({
    creditAmount: { type: Number, required: true },
    credit: { type: Number, required: true },
    questionPerCredit: { type: Number, required: false }, 
    voicePerMinute: { type: Number, required: false },
    description: { type: String, required: true },
    validUpto: { type: String, required: true },
    offer: { type: Number,default: 0 },
    extraCredit: { type: Number, default: 0 },
});

module.exports = mongoose.model("CreditPlan", creditPlanSchema);

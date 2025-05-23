const mongoose = require("mongoose");

const orderHistoryCreditSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    credit_id: { type: mongoose.Schema.Types.ObjectId, ref: "CreditPlan", required: true },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "CreditPayment", required: true },
    creditAmount: { type: Number, required: true },
    credit: { type: Number, required: true },
    extraCredit: { type: Number, default: 0},
    offer: { type: Number,default: 0 },
    payment_date: { type: Date, default: Date.now },
    validUpto: { type: String, required: true },
    voicePerMinute: { type: Number },  
    questionPerCredit: { type: Number },  
    description: { type: String, required: true }
});

module.exports = mongoose.model("OrderHistoryCredit", orderHistoryCreditSchema);

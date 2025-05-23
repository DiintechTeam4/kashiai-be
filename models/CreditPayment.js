const mongoose = require("mongoose");

const creditPaymentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    credit_id: { type: mongoose.Schema.Types.ObjectId, ref: "CreditPlan", required: true },
    
    creditAmount: { type: Number, required: true },
    credit: { type: Number, required: true }, 
    offer: { type: Number,default: 0 },
    extraCredit: { type: Number, default: 0 },
    payment_status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
    validUpto: { type: String, required: true },
    voicePerMinute: { type: Number }, 
    questionPerCredit: { type: Number },  
    description: { type: String, required: true },
    payment_date: { type: Date, default: Date.now },
    cashfree_order_id: { type: String, unique: true },
    payment_session_id: { type: String, unique: true }
});

module.exports = mongoose.model("CreditPayment", creditPaymentSchema);


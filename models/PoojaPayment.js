
const mongoose = require('mongoose');

const poojaPaymentSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CartPooja', required: true },
  pooja_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pooja', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: false },
  amount: { type: Number, required: true },
  payment_status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  cashfree_order_id: { type: String, unique: true, sparse: true },
  payment_date: { type: Date }
});

const PoojaPayment = mongoose.model('PoojaPayment', poojaPaymentSchema);

module.exports = PoojaPayment;

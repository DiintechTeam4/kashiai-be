
const mongoose = require('mongoose');

const productPaymentSchema = new mongoose.Schema({
  
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CartProduct', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  payment_status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  cashfree_order_id: { type: String, unique: true, sparse: true },
  payment_date: { type: Date }
});

const ProductPayment = mongoose.model('ProductPayment', productPaymentSchema);

module.exports = ProductPayment;

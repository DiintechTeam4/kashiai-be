
const mongoose = require('mongoose');

const OrderHistoryProductSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CartProduct', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    gst: { type: Number, required: true },
    images: { type: Array, default: [] }
  }],
  totalAmountBeforeGst: { type: Number, required: true },
  totalGstAmount: { type: Number, required: true },
  totalAmountAfterGst: { type: Number, required: true },
  payment_status: { type: String, default: 'SUCCESS' },
  payment_date: { type: Date, required: true },
  shipping_address: {
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    nearby: { type: String },
    pincode: { type: String, required: true },
  },
  order_status: { 
    type: String, 
    enum: ['SHIPPED', 'APPROVED', 'DELIVERED'], 
  default: 'APPROVED' 
  }
});

module.exports = mongoose.model('OrderHistoryProduct', OrderHistoryProductSchema);

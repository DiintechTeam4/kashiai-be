const mongoose = require('mongoose');


const OrderHistorySchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CartPooja', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package_price: { type: Number, required: true },  
  gst_percentage: { type: Number, required: true }, 
  pooja_name: { type: String, required: true },
  package_name: { type: String, required: true },
  date: { type: Date, required: true },  
  place: { type: String, required: true },
  images: { type: Array, default: [] }, 
  total_amount_before_gst: { type: Number, required: true },
  gst_amount: { type: Number, required: true },
  total_amount_after_gst: { type: Number, required: true },
  payment_status: { type: String, enum: ['SUCCESS', 'PENDING', 'FAILED'], default: 'SUCCESS' }, 
  payment_date: { type: Date, required: true },
  addons: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    addon_image: { type: String }
  }],
  poojaType: {
    type: String,
    enum: ['weekly', 'ondemand', 'special'],
    required: true
  },
  pooja_status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'DONE'],
    default: 'APPROVED' 
  },
  perform_pooja_date: { type: Date, default: null },
  perform_pooja_time: { type: String, default: "" },
  live_url: { type: String, default: "" }
});

module.exports = mongoose.model('OrderHistory', OrderHistorySchema);


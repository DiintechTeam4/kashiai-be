const mongoose = require('mongoose');


const CartPoojaSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pooja_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pooja', required: true },
  package_id: { type: String, required: true },
  package_price: { type: Number, required: true },
  gst_percentage: { type: Number, required: true },
  pooja_name: { type: String, required: true },
  total_amount_before_gst: { type: Number, required: true },
  gst_amount: { type: Number, required: true },
  total_amount_after_gst: { type: Number, required: true },
  addons: [{
    addon_id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String},
    price: { type: Number},
    addon_image: { type: String}
  }],
  images: { type: Array, default: [] },
  package_name: { type: String, required: true },
  date: { type: Date, required: true }, 
  place: { type: String, required: true } 
});


const CartPooja = mongoose.model('CartPooja', CartPoojaSchema);
module.exports = CartPooja;

const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  offer_price: { type: Number },
  description: { type: String },
  availability: { type: Boolean, required: true },
  

  images: { type: Array, default: [] },


  faqs: { type: Array, default: [] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

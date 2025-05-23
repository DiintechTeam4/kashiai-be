const mongoose = require('mongoose');
const { Schema } = mongoose;


const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  

  images: { type: Array, default: [] },
  gst_percentage: { type: Number, required: true, default: 0 }
});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

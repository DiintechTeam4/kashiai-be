const mongoose = require('mongoose');
const { Schema } = mongoose;
const AddonSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, 
  name: { type: String, required: true },
  description: { type: String }, 
  price: { type: Number, required: true },
  image: { type: String } 
});



const PoojaSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  date: { type: Date, required: true },
  availability: { type: Boolean, default: true },
  starting_price: { type: Number, required: true },
  valid_till: { type: Date, required: true },
  poojaType: {
    type: String,
    enum: ['weekly', 'ondemand', 'special'],
    required: true
  },

  
  packages: { type: Array, default: [] },


  images: { type: Array, default: [] },


  faqs: { type: Array, default: [] },


  addons: { type: [AddonSchema], default: [] },
  gst_percentage: { type: Number, required: true, default: 0 }
});
PoojaSchema.virtual("days_left").get(function () {
  const today = new Date();
  const expiryDate = new Date(this.valid_till);
  const timeDiff = expiryDate - today;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 
});


PoojaSchema.set("toJSON", { virtuals: true });
PoojaSchema.set("toObject", { virtuals: true });

const Pooja = mongoose.model('Pooja', PoojaSchema);

module.exports = { Pooja };

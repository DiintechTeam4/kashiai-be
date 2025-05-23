const mongoose = require('mongoose');

const SliderSchema = new mongoose.Schema({
  poojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pooja',
    required: true,
  },
  images:{
    type: String,
    required: true,
  },poojaType: {
    type: String,
    enum: ['weekly', 'ondemand', 'special'],
    required: true,
  }
});

module.exports = mongoose.model('Slider', SliderSchema);

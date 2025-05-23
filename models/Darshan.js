const mongoose = require('mongoose');
const { Schema } = mongoose;

const darshanSchema = new Schema({
  darshan_name: {
    type: String,
    required: true
  },
  darshan_image: {
    type: String,
    required: true
  },
  darshan_streaming_time: {
    type: String,
    required: true
  },
  live_streaming_link: {
    type: String,
    required: true
  },
  live: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Darshan', darshanSchema);
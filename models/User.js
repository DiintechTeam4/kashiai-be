const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: false },
  fullName: { type: String, required: false },
  email: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  birthTime: { type: String, required: false }, 
  birthPlace: { type: String, required: false },
  occupation: { type: String, required: false }, 
  gender: { type: String, enum: ["male", "female", "other"], required: false },
  address: { type: String, required: false },
  city: { type: String, required: false },
  pincode: { type: String, required: false },
  profileImage: { type: String, required: false },
  gotra: { type: String, required: false },
  available_credits: { type: Number, default: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

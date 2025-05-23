const mongoose = require('mongoose');

const panditSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String },
  profilePhoto: { type: String, required: true }, // Store file path or URL
  languagesSpoken: { type: [String], default: [] },
  panditCategory: { type: [String], required: true },
  specializations: { type: [String], required: true },
  yearsOfExperience: { type: Number, required: true },
  servicesOffered: { type: [String], required: true },
  modeOfService: { type: String, enum: ['Online', 'Offline', 'Both'], required: true },
  travelAvailability: { type: Boolean, default: false },
  serviceLanguages: { type: [String], default: [] },
  availableDays: { type: [String], default: [] },
  preferredTimeSlots: { type: String },
  consultationFee: { type: String },
  startingPrice: { type: Number },
  customPricingAvailable: { type: Boolean, default: false },
  preferredCommunication: { type: String, enum: ['Call', 'WhatsApp', 'Email'], required: true },
  readyForLiveConsultation: { type: Boolean, default: false },
  additionalInfo: { type: String },
}, { timestamps: true });

const Pandit = mongoose.model('Pandit', panditSchema);

module.exports = { Pandit };

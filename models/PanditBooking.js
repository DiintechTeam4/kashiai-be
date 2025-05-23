const mongoose = require('mongoose');

const PanditBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    userName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    houseNumber: { type: String},  
    nearLandmark: { type: String }, 
    address: { type: String},
    latitude: { type: Number},
    longitude: { type: Number},
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true }, 

    assignedPandit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pandit",
        default: null
      },
    assignedAt: { type: Date },
    status: { type: String, enum: ["APPROVED", "DONE", "PENDING"], default: "PENDING" },
});

module.exports = mongoose.model('PanditBooking', PanditBookingSchema);

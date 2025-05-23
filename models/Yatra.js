const mongoose = require('mongoose');

const YatraSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    numberOfPassengers: { type: Number, required: true },
    bookingDate: { type: Date, required: true }, 
    status: { type: String, enum: ['APPROVED', 'PENDING', 'DONE'], default: 'APPROVED' } 
});

module.exports = mongoose.model('Yatra', YatraSchema);

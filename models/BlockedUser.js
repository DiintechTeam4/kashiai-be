const mongoose = require('mongoose');

const BlockedUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true, 
  },
  reason: { type: String, required: true }
});

module.exports = mongoose.model('BlockedUser', BlockedUserSchema);

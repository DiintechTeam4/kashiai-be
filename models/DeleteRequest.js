const mongoose = require('mongoose');

const deleteRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: false },
  mobileNumber: { type: String, required: false }
});

const DeleteRequest = mongoose.model('DeleteRequest', deleteRequestSchema);

module.exports = DeleteRequest;

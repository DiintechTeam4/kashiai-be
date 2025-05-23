const BlockedUser = require('../models/BlockedUser');
const User = require('../models/User');
const Admin = require('../models/Admin');
const OrderHistoryCredit = require("../models/OrderHistoryCredit");
exports.blockUser = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { userId, reason } = req.body;

    if (!adminId || !userId || !reason) {
      return res.status(400).json({ message: 'Admin ID, User ID, and reason are required' });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isBlocked = await BlockedUser.findOne({ userId });
    if (isBlocked) {
      return res.status(400).json({ message: 'User is already blocked' });
    }

    const blockedUser = new BlockedUser({
      userId,
      blockedBy: adminId,
      reason,
    });

    await blockedUser.save();

    res.status(201).json({ message: 'User blocked successfully', blockedUser });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.checkBlockedUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const user = await User.findById(userId);
      const blockedUser = await BlockedUser.findOne({ userId }).populate('blockedBy', 'name email');

      const adminId = '67c03760292eef62e97bc126';
      const admin = await Admin.findById(adminId).select('openAIKey deepgramAPIKey lmntAPIKey');


      const successfulOrders = await OrderHistoryCredit.find({
        user_id: userId
    });

    let availableCredits = 0;
    successfulOrders.forEach(order => {
        availableCredits += (order.credit || 0) + (order.extraCredit || 0);
    });

    console.log("available credits", availableCredits)
    
    await User.findByIdAndUpdate(userId, { available_credits: availableCredits });





      if (blockedUser) {
        return res.status(423).json({  
          message: 'User is blocked',
          blockedUser,
          adminKeys: admin,
          availableCredits,
          role: user.role
        });
      }
  
      
      return res.status(200).json({ message: 'User is not blocked',adminKeys: admin,availableCredits,role:user.role });
    } catch (error) {
      console.error('Error checking blocked user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};

  exports.unblockUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const blockedUser = await BlockedUser.findOne({ userId });
      if (!blockedUser) {
        return res.status(404).json({ message: 'User is not blocked' });
      }
  
      await BlockedUser.deleteOne({ userId });
  
      res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
      console.error('Error unblocking user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
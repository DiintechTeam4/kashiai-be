const Admin = require('../models/Admin');
const mongoose = require("mongoose");
const User = require('../models/User');
const OrderHistory = require('../models/OrderHistory');
exports.getAdminKeys = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({
      message: 'Admin API keys fetched successfully',
      apiKeys: {
        openAIKey: admin.openAIKey || null,
        deepgramAPIKey: admin.deepgramAPIKey || null,
        lmntAPIKey: admin.lmntAPIKey || null
      },
    });
  } catch (error) {
    console.error('Error fetching admin keys:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateAdminKeys = async (req, res) => {
  try {
    const { adminId } = req.params;
    console.log(adminId)
    const { openAIKey, deepgramAPIKey, lmntAPIKey } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { openAIKey, deepgramAPIKey, lmntAPIKey },
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Admin API keys updated successfully',
      apiKeys: {
        openAIKey: admin.openAIKey,
        deepgramAPIKey: admin.deepgramAPIKey,
        lmntAPIKey: admin.lmntAPIKey
      }
    });
  } catch (error) {
    console.error('Error updating admin keys:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.updatePoojaDetails = async (req, res) => {
  try {
      const { adminId } = req.params;
      const { orderHistoryIds, perform_pooja_date, perform_pooja_time, live_url } = req.body;

      const admin = await Admin.findById(adminId);
      const adminUser = await User.findById(adminId);
              if (!(admin) && (!adminUser || adminUser.role !== "admin")) {
                  return res.status(403).json({ error: "Access denied" });
              }

      if (!Array.isArray(orderHistoryIds) || orderHistoryIds.length === 0) {
          return res.status(400).json({ message: 'Invalid orderHistoryIds. Must be a non-empty array.' });
      }
      const orders = await OrderHistory.find({ _id: { $in: orderHistoryIds } });

      if (orders.length === 0) {
          return res.status(404).json({ message: 'No matching orders found' });
      }

      for (let order of orders) {
          order.perform_pooja_date = perform_pooja_date || order.perform_pooja_date;
          order.perform_pooja_time = perform_pooja_time || order.perform_pooja_time;
          order.live_url = live_url || order.live_url;
          await order.save();
      }

      return res.status(200).json({ 
          message: 'Pooja details updated successfully for multiple orders'
      });

  } catch (error) {
      console.error('Error updating pooja details:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

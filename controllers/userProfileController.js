const User = require('../models/User');
const PoojaPayment = require('../models/PoojaPayment');
const OrderHistory = require('../models/OrderHistory');
const { Types } = require("mongoose");


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        res.status(200).json(users);
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

exports.getUserbyId = async (req, res) => {
  try {
      const userid=req.params.userid;
      const user = await User.findById(userid).select('-password'); 
      res.status(200).json(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
  } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
  }
};

exports.getPoojaPaymentsByUser = async (req, res) => {
    try {
      const payments = await PoojaPayment.find()
        .populate("user_id", "fullName")
        .populate("pooja_id", "name")
        .sort({ payment_date: -1 });
  
      
      if (!payments || payments.length === 0) {
        return res.status(404).json({ message: "No payments found" });
      }
  
      
      const groupedPayments = {};
      payments.forEach(payment => {
        const userId = payment.user_id?._id?.toString();
        const poojaId = payment.pooja_id?._id?.toString();
  
        
        if (!userId || !poojaId) {
          console.warn("Missing user or pooja reference in:", payment);
          return;
        }
  
        if (!groupedPayments[userId]) {
          groupedPayments[userId] = [];
        }
  
        groupedPayments[userId].push({
          pooja_id: poojaId,
          pooja_name: payment.pooja_id?.name || "Unknown Pooja",
          fullname: payment.user_id?.fullName || "Unknown User",
          payment_date: payment.payment_date,
          payment_status: payment.payment_status,
          payment_amount: payment.amount
        });
      });
  
      res.status(200).json(groupedPayments);
    } catch (error) {
      console.error("Error fetching pooja payments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

exports.getOrderHistoryByUser = async (req, res) => {
    try {
      const orders = await OrderHistory.find().populate("user_id");
  
      const formattedOrders = {};
  
      orders.forEach((order) => {
        const userId = order.user_id?._id.toString();
  
        if (!formattedOrders[userId]) {
          formattedOrders[userId] = [];
        }
  
        formattedOrders[userId].push({
          pooja_id: order._id,
          pooja_name: order.pooja_name,
          fullname: order.user_id?.fullName || "",
          payment_date: order.payment_date ? order.payment_date.toISOString() : "",
          payment_status: order.payment_status,
          payment_amount: order.total_amount_after_gst,
          pooja_status: order.pooja_status,
        });
      });
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching order history:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
 
  exports.getTotalUsers = async (req, res) => {
    try {
      const total = await User.countDocuments(); // counts all documents
      res.status(200).json({ totalUsers: total });
    } catch (err) {
      console.error('Error counting Poojas:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
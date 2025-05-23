const User = require('../models/User');
const OrderHistoryCredit = require("../models/OrderHistoryCredit");
const calculateAvailableCredits = async (userId) => {
  const successfulOrders = await OrderHistoryCredit.find({ user_id: userId });
  return successfulOrders.reduce((acc, order) => acc + (order.credit || 0) + (order.extraCredit || 0), 0);
};

const googleAuth = async (req, res) => {
  try {
    const { displayName, email, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }


    let user = await User.findOne({ email });

    if (user) {
      user.available_credits = await calculateAvailableCredits(user._id);
      await user.save();
      return res.status(200).json({
        message: 'User already exists',
        userId: user._id,
        userDetails: user,
      });
    }

    user = new User({
      fullName: displayName,
      email,
      profileImage: photoURL, 
    });

    await user.save();

    return res.status(201).json({
      message: 'New user created',
      userId: user._id,
      userDetails: user,
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const checkOrInsertUser = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    let user = await User.findOne({ mobileNumber });

    if (user) {


      // "_id": "67c6a309c32095fac3c51ed0",
      // "mobileNumber": "7660082733",
      // "__v": 0,
      // "email": "app.testv.1.1@gmail.com",
      // "fullName": "test_12",
      // "profileImage": "https://lh3.googleusercontent.com/a/ACg8ocK7ubiOF6OyA411fSIsBg45R8GS7gnqn2ac1tSBMi_vidBZPA=s96-c",
      // "available_credits": 260,
      // "role": "user",
      // "birthPlace": "New York",
      // "birthTime": "14:30",
      // "gender": "female",
      // "occupation": "Software Engineer"

      user.available_credits = await calculateAvailableCredits(user._id);
      await user.save();

      const userResponse = { 
        user_id: user._id,
        mobileNumber: user.mobileNumber,
        fullName: user.fullName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        profileImage: user.profileImage,
        gotra: user.gotra,
        occupation: user.occupation,
        gender:user.gender,
        birthPlace:user.birthPlace,
        birthTime:user.birthTime,
        role:user.role,
        available_credits:user.available_credits
      };
      return res.status(200).json({ success: true, message: 'User found', user:userResponse });
    }


    user = new User({ mobileNumber });

    await user.save();

    const newUserResponse = { 
      user_id: user._id,
      mobileNumber: user.mobileNumber
    };
    return res.status(201).json({ success: true, message: 'New user created', user: newUserResponse });
  } catch (error) {
    console.error('Error checking or inserting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { googleAuth,checkOrInsertUser };

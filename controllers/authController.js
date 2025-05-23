const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};


exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    console.log(adminExists)
    const admin = await Admin.create({ name, email, password });
    console.log(`admin created ${admin}`)
    res.status(201).json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id)
    });
  } catch (error) {
    console.error("Signup Error:", error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({
      message: 'Login Successful',
      id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id)
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

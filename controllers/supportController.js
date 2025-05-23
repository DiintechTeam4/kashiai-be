const Complaint = require('../models/Complaint');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SUPPORT_EMAIL, 
    pass: process.env.SUPPORT_PASSWORD, 
  },
});

exports.submitComplaint = async (req, res) => {
  try {
    const { userId } = req.params;
    const { subject, message } = req.body;

    if (!userId || !subject || !message) {
      return res.status(400).json({ message: 'User ID, subject, and message are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const complaint = new Complaint({
      userId,
      name: user.fullName,
      email: user.email,
      subject,
      message
    });

    await complaint.save();

    const mailOptions = {
      from: process.env.SUPPORT_EMAIL,
      to: user.email,
      subject: `Support Request Received - ${subject}`,
      text: `Dear ${user.fullName},\n\nThank you for reaching out! Our support team will get back to you soon.\n\nYour Message: ${message}\n\nBest Regards,\nKashi AI Support Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email Error:', error);
      } else {
        console.log('Email Sent:', info.response);
      }
    });

    res.status(201).json({ message: 'Complaint submitted successfully', complaint });

  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json({ complaints });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
};

exports.resolveComplaint = async (req, res) => {
    try {
      const { complaintId } = req.params;
  
      
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      complaint.status = 'Resolved';
      await complaint.save();

      const mailOptions = {
        from: process.env.SUPPORT_EMAIL,
        to: complaint.email,
        subject: `Your Complaint Has Been Resolved - ${complaint.subject}`,
        text: `Dear ${complaint.name},\n\nYour complaint regarding "${complaint.subject}" has been successfully resolved.\n\nThank you for your patience.\n\nBest Regards,\nKashi AI Support Team`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending resolution email:', error);
        } else {
          console.log('Resolution Email Sent:', info.response);
        }
      });
  
      res.status(200).json({ message: 'Complaint resolved successfully', complaint });
    } catch (error) {
      console.error('Error resolving complaint:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
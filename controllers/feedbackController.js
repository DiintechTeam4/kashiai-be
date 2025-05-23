const Feedback = require("../models/feedbackModel");

exports.submitFeedback = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rating, feedback } = req.body;

    if (!userId || !rating || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    const existingFeedback = await Feedback.findOne({ userId });
    if (existingFeedback) {
      return res.status(400).json({ message: "User has already submitted feedback" });
    }

    
    const newFeedback = new Feedback({ userId, rating, feedback });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback submitted successfully", newFeedback });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("userId", "name email");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.getUserFeedback = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedbacks = await Feedback.find({ userId });

    if (!feedbacks.length) {
      return res.status(404).json({ message: "No feedback found for this user" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

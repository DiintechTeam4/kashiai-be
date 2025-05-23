const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

router.post("/submit/:userId", feedbackController.submitFeedback);
router.get("/all", feedbackController.getAllFeedbacks);
router.get("/:userId", feedbackController.getUserFeedback);

module.exports = router;

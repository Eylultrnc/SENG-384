const express = require("express");
const { submitFeedback, getFeedbacks } = require("../controllers/feedback.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Submit new feedback (any logged-in user)
router.post("/", authMiddleware, submitFeedback);

// Get all feedbacks (should be protected by admin check, for now just auth)
router.get("/", authMiddleware, getFeedbacks);

module.exports = router;

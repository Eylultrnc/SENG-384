const pool = require("../db");

const submitFeedback = async (req, res) => {
  try {
    const { type, message } = req.body;
    const userId = req.user.userId;

    if (!type || !message) {
      return res.status(400).json({ message: "Type and message are required" });
    }

    const validTypes = ["BUG", "FEATURE", "GENERAL"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid feedback type" });
    }

    const result = await pool.query(
      `INSERT INTO feedbacks (user_id, type, message, status, created_at)
       VALUES ($1, $2, $3, 'NEW', NOW())
       RETURNING *`,
      [userId, type, message]
    );

    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: result.rows[0],
    });
  } catch (error) {
    console.error("SUBMIT FEEDBACK ERROR:", error);
    return res.status(500).json({ message: "Server error during feedback submission" });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    // Only admins should ideally access this, but we'll assume the route is protected
    const result = await pool.query(
      `SELECT f.*, u.full_name, u.email 
       FROM feedbacks f
       JOIN users u ON f.user_id = u.id
       ORDER BY f.created_at DESC`
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET FEEDBACKS ERROR:", error);
    return res.status(500).json({ message: "Server error fetching feedbacks" });
  }
};

module.exports = {
  submitFeedback,
  getFeedbacks,
};

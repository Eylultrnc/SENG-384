const pool = require("../db");

const getMessagesWithUser = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.userId;

    const result = await pool.query(
      `SELECT m.*, 
        s.full_name as sender_name,
        r.full_name as receiver_name
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2)
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at ASC`,
      [currentUserId, otherUserId]
    );

    await pool.query(
      `UPDATE messages
       SET is_read = true
       WHERE sender_id = $1 AND receiver_id = $2`,
      [otherUserId, currentUserId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    res.status(500).json({ message: "Server error fetching messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "receiverId and content are required" });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content, is_read)
       VALUES ($1, $2, $3, false)
       RETURNING *`,
      [senderId, receiverId, content]
    );

    const sentMessage = result.rows[0];

    // Auto-reply logic: Simulate a response from the receiver
    // This allows the user to test the DM messaging flow without needing a second active user.
    const mockResponses = [
      "Mock Data: Patient HR is 75 bpm, BP is 120/80 mmHg. No anomalies detected.",
      "Mock Data: Processing scan results... Lung nodules detected in upper right lobe (Confidence: 87%).",
      "Mock Data: User profile updated with the latest clinical trials matching 'Diabetes Risk Prediction'.",
      "Mock Data: Generating summary of recent EHR records: Patient has a history of mild hypertension and type 2 diabetes. Currently on Metformin.",
      "Mock Data: Found 3 new collaboration requests for 'EHR Data Analysis Tool'."
    ];
    const autoReplyContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // Insert the auto-reply asynchronously so we don't block the initial response
    setTimeout(async () => {
      try {
        await pool.query(
          `INSERT INTO messages (sender_id, receiver_id, content, is_read)
           VALUES ($1, $2, $3, false)`,
          [receiverId, senderId, autoReplyContent]
        );
      } catch (err) {
        console.error("AUTO REPLY ERROR:", err);
      }
    }, 1000); // 1 second delay to simulate typing/processing

    res.status(201).json(sentMessage);
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ message: "Server error sending message" });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const result = await pool.query(
      `SELECT COUNT(*) 
       FROM messages
       WHERE receiver_id = $1 AND is_read = false`,
      [currentUserId]
    );

    res.json({ count: Number(result.rows[0].count) });
  } catch (error) {
    console.error("GET UNREAD COUNT ERROR:", error);
    res.status(500).json({ message: "Server error fetching unread count" });
  }
};

module.exports = { getMessagesWithUser, sendMessage, getUnreadCount };
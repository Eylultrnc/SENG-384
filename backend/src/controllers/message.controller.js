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
      `INSERT INTO messages (sender_id, receiver_id, content) 
       VALUES ($1, $2, $3) RETURNING *`,
      [senderId, receiverId, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ message: "Server error sending message" });
  }
};

module.exports = { getMessagesWithUser, sendMessage };

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
      "Harika bir nokta! Bu konuyu biraz daha detaylandırabilir misin?",
      "Evet, kesinlikle katılıyorum. Peki sence bu sistem hastanelerde nasıl uygulanabilir?",
      "Bu çok ilginç bir yaklaşım. Veri gizliliği (HIPAA vb.) konusunda nasıl bir önlem almayı planlıyorsun?",
      "Şu an bahsettiğin detaylar mantıklı duruyor, bir sonraki aşamada ne gibi testler yapmalıyız sence?",
      "Anlıyorum. Peki sence mevcut yapay zeka modelleri bu işlemi ne kadar sürede tamamlar?",
      "Dediğin gibi yaparsak doğruluk payı artabilir. Buna ek olarak bir radyolog görüşü almak da faydalı olur.",
      "Kesinlikle. Ben de EHR verilerinin analizinde benzer sorunlarla karşılaşmıştım, çözüm önerin harika.",
      "İlginç... Bu anlattıklarını projenin bir sonraki fazına ekleyelim mi?",
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
    }, 10000); // 10 second delay to simulate typing/processing

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

    const latestMessage = await pool.query(
      `SELECT m.*, u.full_name as sender_name 
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.receiver_id = $1 AND m.is_read = false
       ORDER BY m.created_at DESC LIMIT 1`,
      [currentUserId]
    );

    res.json({ 
      count: Number(result.rows[0].count),
      latestMessage: latestMessage.rows[0] || null
    });
  } catch (error) {
    console.error("GET UNREAD COUNT ERROR:", error);
    res.status(500).json({ message: "Server error fetching unread count" });
  }
};

const sendCollaborationRequest = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, postId } = req.body;

    if (!receiverId || !postId) {
      return res.status(400).json({ message: "receiverId and postId are required" });
    }

    const existing = await pool.query(
      `SELECT id FROM collaboration_requests
       WHERE sender_id = $1 AND post_id = $2`,
      [senderId, postId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Already requested" });
    }

    const result = await pool.query(
      `INSERT INTO collaboration_requests (sender_id, receiver_id, post_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [senderId, receiverId, postId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("SEND REQUEST ERROR:", err);
    res.status(500).json({ message: "Error sending request" });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const result = await pool.query(
      `SELECT cr.*, 
              u.full_name AS sender_name,
              p.title AS post_title
       FROM collaboration_requests cr
       JOIN users u ON cr.sender_id = u.id
       JOIN posts p ON cr.post_id = p.id
       WHERE cr.receiver_id = $1 AND cr.status = 'PENDING'
       ORDER BY cr.created_at DESC`,
      [currentUserId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET REQUESTS ERROR:", err);
    res.status(500).json({ message: "Error fetching requests" });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const result = await pool.query(
      `UPDATE collaboration_requests
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [action, requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (action === "ACCEPTED") {
      const postId = result.rows[0].post_id;

      await pool.query(
        `UPDATE posts SET status = 'CLOSED' WHERE id = $1`,
        [postId]
      );

      await pool.query(
        `UPDATE collaboration_requests
         SET status = 'REJECTED'
         WHERE post_id = $1 AND id != $2 AND status = 'PENDING'`,
        [postId, requestId]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("RESPOND REQUEST ERROR:", err);
    res.status(500).json({ message: "Error responding request" });
  }
};

const getAcceptedRequests = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const result = await pool.query(
      `SELECT cr.*,
              u.full_name AS receiver_name,
              p.title AS post_title
       FROM collaboration_requests cr
       JOIN users u ON cr.receiver_id = u.id
       JOIN posts p ON cr.post_id = p.id
       WHERE cr.sender_id = $1 AND cr.status = 'ACCEPTED'
       ORDER BY cr.created_at DESC`,
      [currentUserId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET ACCEPTED REQUESTS ERROR:", err);
    res.status(500).json({ message: "Error fetching accepted requests" });
  }
};
const scheduleMeeting = async (req, res) => {
  try {
    const requesterId = req.user.userId;
    const { receiverId, postId, meetingTime } = req.body;

    const result = await pool.query(
      `INSERT INTO meetings (requester_id, receiver_id, post_id, meeting_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [requesterId, receiverId, postId, meetingTime]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("SCHEDULE MEETING ERROR:", err);
    res.status(500).json({ message: "Error scheduling meeting" });
  }
};
module.exports = {
  getMessagesWithUser,
  sendMessage,
  getUnreadCount,
  sendCollaborationRequest,
  getMyRequests,
  respondToRequest,
  getAcceptedRequests,
  scheduleMeeting
};
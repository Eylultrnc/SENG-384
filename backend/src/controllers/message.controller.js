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

module.exports = { getMessagesWithUser, sendMessage, getUnreadCount };
const pool = require("../db");
const logActivity = require("../utils/logActivity");
const getAdminUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, institution, status, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getAdminPosts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.full_name AS author_name, u.email AS author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("ADMIN GET POSTS ERROR:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

const deleteAdminPost = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
    await logActivity({
        userId: req.user.userId,
        role: req.user.role,
        actionType: "ADMIN_DELETE_POST",
        targetEntity: `post:${id}`,
        ipAddress: req.ip
    });
    res.json({ message: "Post removed by admin" });
  } catch (err) {
    console.error("ADMIN DELETE POST ERROR:", err);
    res.status(500).json({ message: "Error deleting post" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ACTIVE", "SUSPENDED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, full_name, email, role, status`,
      [status, id]
    );
    await logActivity({
        userId: req.user.userId,
        role: req.user.role,
        actionType: "ADMIN_UPDATE_USER_STATUS",
        targetEntity: `user:${id}:${status}`,
        ipAddress: req.ip
    });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("ADMIN UPDATE USER ERROR:", err);
    res.status(500).json({ message: "Error updating user" });
  }
};
const getAdminLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT al.*, u.full_name, u.email
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.timestamp DESC
       LIMIT 100`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("ADMIN GET LOGS ERROR:", err);
    res.status(500).json({ message: "Error fetching logs" });
  }
};
module.exports = {
  getAdminUsers,
  getAdminPosts,
  deleteAdminPost,
  updateUserStatus,
  getAdminLogs
};
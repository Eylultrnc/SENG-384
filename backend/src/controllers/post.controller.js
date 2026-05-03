const pool = require("../db");

const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      needed_expertise,
      working_domain,
      project_stage,
      collaboration_type,
      commitment_level,
      confidentiality_level,
      city,
      country,
      expiry_date,
    } = req.body;

    if (
      !title ||
      !description ||
      !needed_expertise ||
      !working_domain ||
      !project_stage ||
      !collaboration_type ||
      !commitment_level ||
      !confidentiality_level ||
      !city ||
      !country
    ) {
      return res.status(400).json({ message: "Missing required post fields" });
    }

    const result = await pool.query(
      `INSERT INTO posts
      (author_id, title, description, needed_expertise, working_domain, project_stage,
       collaboration_type, commitment_level, confidentiality_level, city, country, status, expiry_date, created_at, updated_at)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'DRAFT',$12,NOW(),NOW())
      RETURNING *`,
      [
        req.user.userId,
        title,
        description,
        needed_expertise,
        working_domain,
        project_stage,
        collaboration_type,
        commitment_level,
        confidentiality_level,
        city,
        country,
        expiry_date || null,
      ]
    );

    res.status(201).json({
      message: "Post created successfully",
      post: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ message: "Server error while creating post: " + error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { query, domain, expertise, status } = req.query;

    let sql = `
      SELECT p.*, u.full_name AS author_name, u.role AS author_role
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (query) {
      params.push(`%${query}%`);
      sql += ` AND (p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
    }

    if (domain) {
      params.push(`%${domain}%`);
      sql += ` AND p.working_domain ILIKE $${params.length}`;
    }

    if (expertise) {
      params.push(`%${expertise}%`);
      sql += ` AND p.needed_expertise ILIKE $${params.length}`;
    }

    if (status) {
      params.push(status);
      sql += ` AND p.status = $${params.length}`;
    }

    sql += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

const getPostById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.full_name AS author_name, u.role AS author_role
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET POST BY ID ERROR:", error);
    res.status(500).json({ message: "Server error while fetching post" });
  }
};

const updatePost = async (req, res) => {
  try {
    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [req.params.id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = postCheck.rows[0];

    if (post.author_id !== req.user.userId) {
      return res.status(403).json({ message: "You can only update your own post" });
    }

    const {
      title,
      description,
      needed_expertise,
      working_domain,
      project_stage,
      collaboration_type,
      commitment_level,
      confidentiality_level,
      city,
      country,
      expiry_date,
    } = req.body;

    const result = await pool.query(
      `UPDATE posts
       SET title = $1,
           description = $2,
           needed_expertise = $3,
           working_domain = $4,
           project_stage = $5,
           collaboration_type = $6,
           commitment_level = $7,
           confidentiality_level = $8,
           city = $9,
           country = $10,
           expiry_date = $11,
           updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [
        title,
        description,
        needed_expertise,
        working_domain,
        project_stage,
        collaboration_type,
        commitment_level,
        confidentiality_level,
        city,
        country,
        expiry_date || null,
        req.params.id,
      ]
    );

    res.json({
      message: "Post updated successfully",
      post: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE POST ERROR:", error);
    res.status(500).json({ message: "Server error while updating post" });
  }
};

const updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "DRAFT",
      "ACTIVE",
      "MEETING_SCHEDULED",
      "PARTNER_FOUND",
      "EXPIRED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid post status" });
    }

    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [req.params.id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = postCheck.rows[0];

    if (post.author_id !== req.user.userId) {
      return res.status(403).json({ message: "You can only update your own post status" });
    }

    const result = await pool.query(
      `UPDATE posts
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    res.json({
      message: "Post status updated successfully",
      post: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE POST STATUS ERROR:", error);
    res.status(500).json({ message: "Server error while updating post status" });
  }
};
const closePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await pool.query(
      `UPDATE posts SET status = 'CLOSED' WHERE id = $1`,
      [postId]
    );

    res.json({ message: "Post closed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error closing post" });
  }
};
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT id, title, status
       FROM posts
       WHERE author_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('GET MY POSTS ERROR:', err);
    res.status(500).json({ message: 'Error fetching my posts' });
  }
};
const publishPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const result = await pool.query(
      `UPDATE posts
       SET status = 'ACTIVE'
       WHERE id = $1 AND author_id = $2
       RETURNING *`,
      [postId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUBLISH POST ERROR:', err);
    res.status(500).json({ message: 'Error publishing post' });
  }
};
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const result = await pool.query(
      `DELETE FROM posts 
       WHERE id = $1 AND author_id = $2
       RETURNING *`,
      [postId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found or not yours" });
    }

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("DELETE POST ERROR:", err);
    res.status(500).json({ message: "Error deleting post" });
  }
};
module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  updatePostStatus,
  closePost,
  getMyPosts,
  publishPost,
  deletePost
}; 

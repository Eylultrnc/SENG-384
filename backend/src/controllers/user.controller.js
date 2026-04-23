const pool = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, institution, bio FROM users WHERE id != $1 ORDER BY full_name ASC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, institution } = req.body;
    
    const result = await pool.query(
      `UPDATE users
       SET full_name = $1, bio = $2, institution = $3
       WHERE id = $4
       RETURNING id, full_name, email, role, institution, bio`,
      [fullName, bio || null, institution || null, req.user.userId]
    );

    res.json({
      message: "Profile updated successfully",
      user: {
        id: result.rows[0].id,
        fullName: result.rows[0].full_name,
        email: result.rows[0].email,
        role: result.rows[0].role,
        institution: result.rows[0].institution,
        bio: result.rows[0].bio
      }
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

module.exports = { getAllUsers, updateProfile };

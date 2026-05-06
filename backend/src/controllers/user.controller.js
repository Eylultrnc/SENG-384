const pool = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, institution, bio, city, country
       FROM users
       WHERE id != $1
       ORDER BY full_name ASC`,
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
    const { fullName, bio, institution, city, country } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `UPDATE users
       SET full_name = $1,
           bio = $2,
           institution = $3,
           city = $4,
           country = $5
       WHERE id = $6
       RETURNING id, full_name, email, role, institution, bio, city, country`,
      [
        fullName,
        bio || null,
        institution || null,
        city || null,
        country || null,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: result.rows[0].id,
        fullName: result.rows[0].full_name,
        email: result.rows[0].email,
        role: result.rows[0].role,
        institution: result.rows[0].institution,
        bio: result.rows[0].bio,
        city: result.rows[0].city,
        country: result.rows[0].country
      }
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

module.exports = { getAllUsers, updateProfile };
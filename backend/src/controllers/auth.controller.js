const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../db");

const isEduEmail = (email) => {
  return email.endsWith(".edu") || email.endsWith(".edu.tr");
};

const register = async (req, res) => {
  try {
    const { fullName, email, password, role, institution } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isEduEmail(email)) {
      return res.status(400).json({
        message: "Only institutional .edu or .edu.tr emails are allowed",
      });
    }

    if (role.toUpperCase() === "ADMIN") {
      return res.status(403).json({
        message: "Admin role cannot be selected during public registration",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const result = await pool.query(
      `INSERT INTO users
      (full_name, email, password_hash, role, institution, status, email_verified, verification_token, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
      RETURNING id, full_name, email, role, email_verified`,
      [
        fullName,
        email,
        passwordHash,
        role.toUpperCase(),
        institution || null,
        "PENDING_VERIFICATION",
        false,
        verificationToken,
      ]
    );

    return res.status(201).json({
      message: "Registration successful. Please verify your email before login.",
      user: result.rows[0],
      verificationToken,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const result = await pool.query(
      `UPDATE users
       SET email_verified = true,
           status = 'ACTIVE',
           verification_token = NULL
       WHERE verification_token = $1
       RETURNING id, email, email_verified, status`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    return res.status(200).json({
      message: "Email verified successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    return res.status(500).json({ message: "Server error during email verification" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role, status, email_verified
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    if (!user.email_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Your account is not active",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await pool.query(
      "UPDATE users SET last_login_at = NOW() WHERE id = $1",
      [user.id]
    );

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
}; 

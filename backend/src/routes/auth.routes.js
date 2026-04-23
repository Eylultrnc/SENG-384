const express = require("express");
const router = express.Router();

const {
  register,
  verifyEmail,
  login,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/login", login);

module.exports = router; 
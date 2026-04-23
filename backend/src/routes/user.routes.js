const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getAllUsers, updateProfile } = require("../controllers/user.controller");

router.get("/", authMiddleware, getAllUsers);
router.put("/me", authMiddleware, updateProfile);

module.exports = router;

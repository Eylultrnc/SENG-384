const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getAdminUsers,
  getAdminPosts,
  deleteAdminPost,
  updateUserStatus,
  getAdminLogs
} = require("../controllers/admin.controller");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

router.get("/users", authMiddleware, adminOnly, getAdminUsers);
router.get("/posts", authMiddleware, adminOnly, getAdminPosts);
router.delete("/posts/:id", authMiddleware, adminOnly, deleteAdminPost);
router.patch("/users/:id/status", authMiddleware, adminOnly, updateUserStatus);
router.get("/logs", authMiddleware, adminOnly, getAdminLogs);

module.exports = router;
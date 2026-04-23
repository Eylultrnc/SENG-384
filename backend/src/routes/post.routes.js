const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  updatePostStatus,
} = require("../controllers/post.controller");

router.get("/", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPostById);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.patch("/:id/status", authMiddleware, updatePostStatus);

module.exports = router;  
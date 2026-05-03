const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  updatePostStatus,
  closePost,
  getMyPosts,
  publishPost,
  deletePost
} = require("../controllers/post.controller");

router.get('/my-posts', authMiddleware, getMyPosts);
router.get("/", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPostById);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.patch("/:id/status", authMiddleware, updatePostStatus);
router.put("/:id/close", authMiddleware, closePost);
router.put('/:id/publish', authMiddleware, publishPost);
router.delete('/:id', authMiddleware, deletePost);
module.exports = router;  
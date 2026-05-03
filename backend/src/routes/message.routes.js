const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getMessagesWithUser, sendMessage, getUnreadCount } = require("../controllers/message.controller");


router.get("/unread-count", authMiddleware, getUnreadCount);
router.get("/:otherUserId", authMiddleware, getMessagesWithUser);
router.post("/", authMiddleware, sendMessage);

module.exports = router;

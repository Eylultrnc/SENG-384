const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  getMessagesWithUser,
  sendMessage,
  sendCollaborationRequest,
  getMyRequests,
  respondToRequest,
  getAcceptedRequests,
  getUnreadCount,
  scheduleMeeting
} = require("../controllers/message.controller");

router.get('/unread-count', authMiddleware, getUnreadCount);
router.get('/requests/accepted', authMiddleware, getAcceptedRequests);
router.get('/requests', authMiddleware, getMyRequests);
router.get("/:otherUserId", authMiddleware, getMessagesWithUser);
router.post("/", authMiddleware, sendMessage);
router.post('/request', authMiddleware, sendCollaborationRequest);
router.post('/request/respond', authMiddleware, respondToRequest);
router.post('/meeting', authMiddleware, scheduleMeeting);
module.exports = router;

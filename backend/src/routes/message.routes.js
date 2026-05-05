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
  scheduleMeeting,
  getMyMeetings,
  respondToMeeting,
  rescheduleMeeting
} = require("../controllers/message.controller");

router.get('/unread-count', authMiddleware, getUnreadCount);
router.get('/requests/accepted', authMiddleware, getAcceptedRequests);
router.get('/requests', authMiddleware, getMyRequests);
router.get('/meetings', authMiddleware, getMyMeetings);
router.get("/:otherUserId", authMiddleware, getMessagesWithUser);
router.post("/", authMiddleware, sendMessage);
router.post('/request', authMiddleware, sendCollaborationRequest);
router.post('/request/respond', authMiddleware, respondToRequest);
router.post('/meeting', authMiddleware, scheduleMeeting);
router.post('/meeting/respond', authMiddleware, respondToMeeting);
router.patch('/meeting/reschedule', authMiddleware, rescheduleMeeting);

module.exports = router;

const express = require("express");
const router = express.Router();
const websocketController = require("../controllers/websocket.controller");

// Get online users
router.get("/websocket/online-users", websocketController.getOnlineUsers);

// Check if user is online
router.get(
  "/websocket/user/:userId/online",
  websocketController.checkUserOnline
);

// Send notification to specific user
router.post("/websocket/notification", websocketController.sendNotification);

// Broadcast message to all users
router.post("/websocket/broadcast", websocketController.broadcastMessage);

// Send message to specific room
router.post("/websocket/room-message", websocketController.sendRoomMessage);

module.exports = router;

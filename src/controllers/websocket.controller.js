const websocketService = require("../services/websocket.service");

class WebSocketController {
  // Get online users
  async getOnlineUsers(req, res) {
    try {
      const onlineUsers = websocketService.getOnlineUsers();
      res.json({
        success: true,
        data: onlineUsers,
        count: onlineUsers.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get online users",
        error: error.message,
      });
    }
  }

  // Check if a user is online
  async checkUserOnline(req, res) {
    try {
      const { userId } = req.params;
      const isOnline = websocketService.isUserOnline(parseInt(userId));

      res.json({
        success: true,
        data: {
          userId: parseInt(userId),
          isOnline: isOnline,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to check user status",
        error: error.message,
      });
    }
  }

  // Send notification to a specific user
  async sendNotification(req, res) {
    try {
      const { userId, title, message, type = "info" } = req.body;

      if (!userId || !message) {
        return res.status(400).json({
          success: false,
          message: "userId and message are required",
        });
      }

      const notification = {
        title: title || "Notification",
        message: message,
        type: type,
        timestamp: new Date(),
        from: req.user ? req.user.email : "System",
      };

      const sent = websocketService.sendNotificationToUser(
        userId,
        notification
      );

      res.json({
        success: true,
        message: sent ? "Notification sent successfully" : "User is offline",
        data: {
          sent: sent,
          notification: notification,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to send notification",
        error: error.message,
      });
    }
  }

  // Broadcast message to all users
  async broadcastMessage(req, res) {
    try {
      const { message, title, type = "announcement" } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      const broadcastData = {
        title: title || "System Announcement",
        message: message,
        type: type,
        timestamp: new Date(),
        from: req.user ? req.user.email : "System",
      };

      websocketService.broadcastToAll("system-announcement", broadcastData);

      res.json({
        success: true,
        message: "Message broadcasted successfully",
        data: broadcastData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to broadcast message",
        error: error.message,
      });
    }
  }

  // Send message to a specific room
  async sendRoomMessage(req, res) {
    try {
      const { roomId, message, title, type = "room-message" } = req.body;

      if (!roomId || !message) {
        return res.status(400).json({
          success: false,
          message: "roomId and message are required",
        });
      }

      const messageData = {
        title: title || "Room Message",
        message: message,
        type: type,
        timestamp: new Date(),
        from: req.user ? req.user.email : "System",
        roomId: roomId,
      };

      websocketService.broadcastToRoom(roomId, "room-message", messageData);

      res.json({
        success: true,
        message: "Message sent to room successfully",
        data: messageData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to send room message",
        error: error.message,
      });
    }
  }
}

module.exports = new WebSocketController();

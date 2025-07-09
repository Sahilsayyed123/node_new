const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // Map to store user connections
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*", // Configure this for production
        methods: ["GET", "POST"],
      },
    });

    // Middleware for socket authentication
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key"
        );
        socket.userId = decoded.id;
        socket.userEmail = decoded.email;
        next();
      } catch (err) {
        next(new Error("Authentication error"));
      }
    });

    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.userEmail} (${socket.id})`);

      // Store user connection
      this.connectedUsers.set(socket.userId, {
        socketId: socket.id,
        email: socket.userEmail,
        socket: socket,
      });

      // Handle user joining a room (e.g., for task notifications)
      socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.userEmail} joined room: ${roomId}`);
      });

      // Handle user leaving a room
      socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.userEmail} left room: ${roomId}`);
      });

      // Handle private messages
      socket.on("private-message", (data) => {
        const { recipientId, message } = data;
        const recipient = this.connectedUsers.get(recipientId);

        if (recipient) {
          recipient.socket.emit("private-message", {
            from: socket.userEmail,
            fromId: socket.userId,
            message: message,
            timestamp: new Date(),
          });
        }
      });

      // Handle task updates
      socket.on("task-update", (data) => {
        // Broadcast to all users in the task room
        socket.to(`task-${data.taskId}`).emit("task-updated", {
          taskId: data.taskId,
          updatedBy: socket.userEmail,
          changes: data.changes,
          timestamp: new Date(),
        });
      });

      // Handle typing indicators
      socket.on("typing", (data) => {
        socket.to(data.roomId).emit("user-typing", {
          userId: socket.userId,
          userEmail: socket.userEmail,
          isTyping: data.isTyping,
        });
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.userEmail} (${socket.id})`);
        this.connectedUsers.delete(socket.userId);
      });
    });

    console.log("WebSocket server initialized");
  }

  // Method to send notification to specific user
  sendNotificationToUser(userId, notification) {
    const user = this.connectedUsers.get(userId);
    if (user) {
      user.socket.emit("notification", notification);
      return true;
    }
    return false;
  }

  // Method to broadcast to all connected users
  broadcastToAll(event, data) {
    this.io.emit(event, data);
  }

  // Method to broadcast to a specific room
  broadcastToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, data);
  }

  // Method to get online users
  getOnlineUsers() {
    return Array.from(this.connectedUsers.values()).map((user) => ({
      userId: user.userId,
      email: user.email,
      socketId: user.socketId,
    }));
  }

  // Method to check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }
}

module.exports = new WebSocketService();

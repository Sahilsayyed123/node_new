const authService = require("../services/auth.service");
const log = require("../middleware/winston.logger");

const authController = {
  // Login controller
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      const result = await authService.login({ username, password });

      res.status(200).json({
        success: result.success,
        message: result.message,
        data: {
          user: result.data.user,
          accessToken: result.data.accessToken,
        },
      });
    } catch (error) {
      log.error(`Login controller error: ${error.message}`);
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Register controller
  register: async (req, res) => {
    try {
      const { username, email, password, mobile_no } = req.body;
      console.log(req.body);

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Username, email, and password are required",
        });
      }

      const result = await authService.register({
        username,
        email,
        password,
        mobile_no,
      });

      res.status(201).json(result);
    } catch (error) {
      log.error(`Register controller error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Refresh token controller
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token not provided",
        });
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: result.success,
        message: result.message,
        data: {
          accessToken: result.data.accessToken,
        },
      });
    } catch (error) {
      log.error(`Refresh token controller error: ${error.message}`);
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Logout controller
  logout: async (req, res) => {
    try {
      const userId = req.user?.id; // From JWT middleware
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token not provided",
        });
      }

      const result = await authService.logout(userId, refreshToken);

      // Clear refresh token cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json(result);
    } catch (error) {
      log.error(`Logout controller error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Logout from all devices controller
  logoutAll: async (req, res) => {
    try {
      const userId = req.user?.id; // From JWT middleware

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const result = await authService.logoutAll(userId);

      res.status(200).json(result);
    } catch (error) {
      log.error(`Logout all controller error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // You can implement user profile fetching logic here
      res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      log.error(`Get profile controller error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = authController;

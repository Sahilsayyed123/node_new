const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { user } = require("../data");
const log = require("../middleware/winston.logger");
require("dotenv").config();

const { JWT_SECRET_KEY, R_JWT_SECRET_KEY } = process.env;

// Generate JWT tokens
const generateTokens = (userData) => {
  const payload = {
    id: userData.id,
    username: userData.username,
    email: userData.email,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: "15m", // Short-lived access token
  });

  const refreshTokenPayload = {
    id: userData.id,
    uuid: uuidv4(), // Unique identifier for this refresh token
  };

  const refreshToken = jwt.sign(refreshTokenPayload, R_JWT_SECRET_KEY, {
    expiresIn: "7d", // Longer-lived refresh token
  });

  return { accessToken, refreshToken, refreshTokenPayload };
};

const authService = {
  // Login service
  login: async (loginData) => {
    try {
      const { username, password } = loginData;
      let foundUser;

      // Check if username is a number (mobile number) or string (username/email)
      if (isNaN(username)) {
        const userlower = username.toLowerCase().replace(/\s/g, "");
        // Try to find by username or email
        foundUser =
          (await user.findOne({ username: userlower })) ||
          (await user.findOne({ email: userlower }));
      } else {
        // Find by mobile number
        foundUser = await user.findOne({ mobile_no: username });
      }

      if (!foundUser) {
        throw new Error("Invalid credentials");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Generate tokens
      const { accessToken, refreshToken, refreshTokenPayload } =
        generateTokens(foundUser);

      // Save refresh token to database
      await user.update(foundUser.id, {
        refresh_token: refreshTokenPayload.uuid,
      });

      log.audit(`User ${foundUser.username} signed in successfully`);

      return {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            mobile_no: foundUser.mobile_no,
          },
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      log.error(`Login failed: ${error.message}`);
      throw new Error(error.message);
    }
  },

  // Register service
  register: async (registerData) => {
    try {
      console.log(registerData);

      const { username, email, password, mobile_no } = registerData;

      // Check if user already exists
      const existingUserByUsername = await user.findOne({ username });
      const existingUserByEmail = await user.findOne({ email });

      if (existingUserByUsername || existingUserByEmail) {
        throw new Error("User already exists with this username or email");
      }

      if (existingUserByUsername || existingUserByEmail) {
        throw new Error("User already exists with this username or email");
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await user.create({
        username: username,
        email: email.toLowerCase(),
        password: hashedPassword,
        mobile_no,
      });

      log.audit(`New user registered: ${newUser.username}`);

      return {
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            mobile_no: newUser.mobile_no,
          },
        },
      };
    } catch (error) {
      log.error(`Registration failed: ${error.message}`);
      throw new Error(error.message);
    }
  },

  // Refresh token service
  refreshToken: async (refreshToken) => {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, R_JWT_SECRET_KEY);

      // Find user with this refresh token
      const foundUser = await user.findOne({
        refresh_token: decoded.uuid,
      });

      if (!foundUser) {
        throw new Error("Invalid refresh token");
      }

      // Generate new tokens
      const {
        accessToken,
        refreshToken: newRefreshToken,
        refreshTokenPayload,
      } = generateTokens(foundUser);

      // Update refresh token in database
      await user.update(foundUser.id, {
        refresh_token: refreshTokenPayload.uuid,
      });

      log.audit(`Tokens refreshed for user: ${foundUser.username}`);

      return {
        success: true,
        message: "Tokens refreshed successfully",
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      log.error(`Token refresh failed: ${error.message}`);
      throw new Error("Invalid refresh token");
    }
  },

  // Logout service
  async logOut(userId, refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, R_JWT_SECRET_KEY);

      // Find user and clear refresh token
      const foundUser = await user.findById(userId);
      if (!foundUser) {
        throw new Error("User not found");
      }

      // Clear refresh token from database
      await user.update(userId, { refresh_token: null });

      log.audit(`User ${foundUser.username} logged out successfully`);

      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error) {
      log.error(`Logout failed: ${error.message}`);
      throw new Error("Logout failed");
    }
  },
};

module.exports = authService;

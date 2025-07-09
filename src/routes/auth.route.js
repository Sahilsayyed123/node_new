const express = require("express");
const authController = require("../controllers/auth.controller");
const { jwtMiddleware } = require("../middleware/jwt.middleware");

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/refresh-token", authController.refreshToken);

// Protected routes (authentication required)
router.post("/logout", jwtMiddleware, authController.logout);
router.post("/logout-all", jwtMiddleware, authController.logoutAll);
router.get("/profile", jwtMiddleware, authController.getProfile);

module.exports = router;

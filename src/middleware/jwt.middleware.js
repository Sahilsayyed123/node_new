// middleware/jwtMiddleware.js
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const bcrypt = require("bcrypt");
const log = require("./winston.logger");
const { user } = require("../data");
require("dotenv").config();

const { JWT_SECRET_KEY, R_JWT_SECRET_KEY } = process.env;

// List of public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/refresh-token",
];

const jwtMiddleware = (req, res, next) => {
  // Allow public routes
  if (PUBLIC_ROUTES.includes(req.path)) {
    return next();
  }

  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded; // optional: attach user payload to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Middleware specifically for refresh token validation
const refreshTokenMiddleware = (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, R_JWT_SECRET_KEY);
    req.refreshTokenPayload = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid refresh token" });
  }
};

module.exports = { jwtMiddleware, refreshTokenMiddleware };

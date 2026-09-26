const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");

/**
 * Verifies the JWT sent in the Authorization header and attaches the
 * authenticated user (without password) to req.user.
 */
const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Authentication token is missing.");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw ApiError.unauthorized("Invalid or expired authentication token.");
  }

  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized("User no longer exists.");
  if (user.status !== "active") throw ApiError.forbidden("This account has been deactivated.");

  req.user = user;
  next();
});

module.exports = { authenticateUser };

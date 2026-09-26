const ApiError = require("../utils/ApiError");

/**
 * Restricts a route to the provided list of roles.
 * Must run after authenticateUser so req.user is populated.
 */
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required.");
  }
  if (!allowedRoles.includes(req.user.role)) {
    throw ApiError.forbidden("You do not have permission to perform this action.");
  }
  next();
};

module.exports = { authorizeRoles };

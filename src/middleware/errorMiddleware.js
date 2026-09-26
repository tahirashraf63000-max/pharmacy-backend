const ApiError = require("../utils/ApiError");

/**
 * Centralized error handler. Converts known/unknown errors into a
 * consistent, user-friendly JSON response and never leaks stack traces.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = 500;
    let message = "Something went wrong. Please try again.";
    let errors = [];

    if (error.name === "ValidationError") {
      statusCode = 400;
      message = "Validation failed.";
      errors = Object.values(error.errors).map((e) => e.message);
    } else if (error.name === "CastError") {
      statusCode = 400;
      message = "Invalid identifier provided.";
    } else if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0] || "field";
      message = `This ${field} is already in use.`;
    } else if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Invalid or expired authentication token.";
    }

    error = new ApiError(statusCode, message, errors);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    errors: error.errors && error.errors.length ? error.errors : undefined,
  });
};

module.exports = errorHandler;

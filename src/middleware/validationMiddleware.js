const ApiError = require("../utils/ApiError");

/**
 * Wraps a validator function (body) => string[] into an Express middleware.
 * If the validator returns any errors, a 400 ApiError is thrown.
 */
const validateRequest = (validatorFn) => (req, res, next) => {
  const errors = validatorFn(req.body);
  if (errors && errors.length > 0) {
    throw ApiError.badRequest("Validation failed.", errors);
  }
  next();
};

module.exports = { validateRequest };

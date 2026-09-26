const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const userRepository = require("../repositories/UserRepository");

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
  }

  sanitizeUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) throw ApiError.unauthorized("Invalid email or password.");

    if (user.status !== "active") {
      throw ApiError.forbidden("This account has been deactivated. Contact your administrator.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw ApiError.unauthorized("Invalid email or password.");

    const token = this.generateToken(user);
    return { token, user: this.sanitizeUser(user) };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");
    return this.sanitizeUser(user);
  }
}

module.exports = new AuthService();

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const authService = require("../services/AuthService");

class AuthController {
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    new ApiResponse(200, "Login successful.", { token, user }).send(res, 200);
  });

  me = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user._id);
    new ApiResponse(200, "Current user fetched successfully.", user).send(res, 200);
  });

  logout = asyncHandler(async (req, res) => {
    // Stateless JWT: logout is handled client-side by discarding the token.
    new ApiResponse(200, "Logged out successfully.").send(res, 200);
  });
}

module.exports = new AuthController();

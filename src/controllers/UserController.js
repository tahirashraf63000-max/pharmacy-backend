const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const userService = require("../services/UserService");

class UserController {
  createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    new ApiResponse(201, "User created successfully.", user).send(res, 201);
  });

  getUsers = asyncHandler(async (req, res) => {
    const { data, pagination } = await userService.getUsers(req.query);
    new ApiResponse(200, "Users fetched successfully.", data, pagination).send(res, 200);
  });

  getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    new ApiResponse(200, "User fetched successfully.", user).send(res, 200);
  });

  updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body, req.user);
    new ApiResponse(200, "User updated successfully.", user).send(res, 200);
  });

  updateStatus = asyncHandler(async (req, res) => {
    const user = await userService.updateStatus(req.params.id, req.body.status);
    new ApiResponse(200, "User status updated successfully.", user).send(res, 200);
  });

  deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id, req.user);
    new ApiResponse(200, "User deleted successfully.").send(res, 200);
  });
}

module.exports = new UserController();

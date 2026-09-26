const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const dashboardService = require("../services/DashboardService");

class DashboardController {
  getDashboard = asyncHandler(async (req, res) => {
    let data;

    if (req.user.role === "admin") {
      data = await dashboardService.getAdminDashboard();
    } else if (req.user.role === "cashier") {
      data = await dashboardService.getCashierDashboard(req.user._id);
    } else {
      data = await dashboardService.getInventoryManagerDashboard();
    }

    new ApiResponse(200, "Dashboard data fetched successfully.", data).send(res, 200);
  });
}

module.exports = new DashboardController();

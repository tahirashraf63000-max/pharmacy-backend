const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const reportService = require("../services/ReportService");

class ReportController {
  salesReport = asyncHandler(async (req, res) => {
    const report = await reportService.getSalesReport(req.query);
    new ApiResponse(200, "Sales report generated successfully.", report).send(res, 200);
  });

  purchaseReport = asyncHandler(async (req, res) => {
    const report = await reportService.getPurchaseReport(req.query);
    new ApiResponse(200, "Purchase report generated successfully.", report).send(res, 200);
  });

  bestSelling = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const report = await reportService.getBestSellingMedicines(limit);
    new ApiResponse(200, "Best-selling medicines fetched successfully.", report).send(res, 200);
  });

  profitEstimate = asyncHandler(async (req, res) => {
    const report = await reportService.getProfitEstimate(req.query);
    new ApiResponse(200, "Profit estimate generated successfully.", report).send(res, 200);
  });

  lowStock = asyncHandler(async (req, res) => {
    const report = await reportService.getLowStockReport();
    new ApiResponse(200, "Low-stock report generated successfully.", report).send(res, 200);
  });

  expiry = asyncHandler(async (req, res) => {
    const report = await reportService.getExpiryReport();
    new ApiResponse(200, "Expiry report generated successfully.", report).send(res, 200);
  });
}

module.exports = new ReportController();

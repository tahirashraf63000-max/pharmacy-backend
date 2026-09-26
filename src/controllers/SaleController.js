const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const saleService = require("../services/SaleService");

class SaleController {
  createSale = asyncHandler(async (req, res) => {
    const sale = await saleService.createSale(req.body, req.user);
    new ApiResponse(201, "Sale completed successfully.", sale).send(res, 201);
  });

  getSales = asyncHandler(async (req, res) => {
    const { data, pagination } = await saleService.getSales(req.query, req.user);
    new ApiResponse(200, "Sales fetched successfully.", data, pagination).send(res, 200);
  });

  getSaleById = asyncHandler(async (req, res) => {
    const sale = await saleService.getSaleById(req.params.id, req.user);
    new ApiResponse(200, "Sale fetched successfully.", sale).send(res, 200);
  });
}

module.exports = new SaleController();

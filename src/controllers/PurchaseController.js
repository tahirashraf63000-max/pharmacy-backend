const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const purchaseService = require("../services/PurchaseService");

class PurchaseController {
  createPurchase = asyncHandler(async (req, res) => {
    const purchase = await purchaseService.createPurchase(req.body, req.user);
    new ApiResponse(201, "Purchase recorded successfully.", purchase).send(res, 201);
  });

  getPurchases = asyncHandler(async (req, res) => {
    const { data, pagination } = await purchaseService.getPurchases(req.query);
    new ApiResponse(200, "Purchases fetched successfully.", data, pagination).send(res, 200);
  });

  getPurchaseById = asyncHandler(async (req, res) => {
    const purchase = await purchaseService.getPurchaseById(req.params.id);
    new ApiResponse(200, "Purchase fetched successfully.", purchase).send(res, 200);
  });
}

module.exports = new PurchaseController();

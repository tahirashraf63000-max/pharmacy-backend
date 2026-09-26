const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const supplierService = require("../services/SupplierService");

class SupplierController {
  createSupplier = asyncHandler(async (req, res) => {
    const supplier = await supplierService.createSupplier(req.body);
    new ApiResponse(201, "Supplier created successfully.", supplier).send(res, 201);
  });

  getSuppliers = asyncHandler(async (req, res) => {
    const { data, pagination } = await supplierService.getSuppliers(req.query);
    new ApiResponse(200, "Suppliers fetched successfully.", data, pagination).send(res, 200);
  });

  getSupplierById = asyncHandler(async (req, res) => {
    const supplier = await supplierService.getSupplierById(req.params.id);
    new ApiResponse(200, "Supplier fetched successfully.", supplier).send(res, 200);
  });

  updateSupplier = asyncHandler(async (req, res) => {
    const supplier = await supplierService.updateSupplier(req.params.id, req.body);
    new ApiResponse(200, "Supplier updated successfully.", supplier).send(res, 200);
  });

  deleteSupplier = asyncHandler(async (req, res) => {
    await supplierService.deleteSupplier(req.params.id);
    new ApiResponse(200, "Supplier deleted successfully.").send(res, 200);
  });
}

module.exports = new SupplierController();

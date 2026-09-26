const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const medicineService = require("../services/MedicineService");

class MedicineController {
  createMedicine = asyncHandler(async (req, res) => {
    const medicine = await medicineService.createMedicine(req.body);
    new ApiResponse(201, "Medicine added successfully.", medicine).send(res, 201);
  });

  getMedicines = asyncHandler(async (req, res) => {
    const { data, pagination } = await medicineService.getMedicines(req.query);
    new ApiResponse(200, "Medicines fetched successfully.", data, pagination).send(res, 200);
  });

  getMedicineById = asyncHandler(async (req, res) => {
    const medicine = await medicineService.getMedicineById(req.params.id);
    new ApiResponse(200, "Medicine fetched successfully.", medicine).send(res, 200);
  });

  updateMedicine = asyncHandler(async (req, res) => {
    const medicine = await medicineService.updateMedicine(req.params.id, req.body);
    new ApiResponse(200, "Medicine updated successfully.", medicine).send(res, 200);
  });

  deleteMedicine = asyncHandler(async (req, res) => {
    await medicineService.deleteMedicine(req.params.id);
    new ApiResponse(200, "Medicine deleted successfully.").send(res, 200);
  });

  getLowStock = asyncHandler(async (req, res) => {
    const medicines = await medicineService.getLowStock();
    new ApiResponse(200, "Low-stock medicines fetched successfully.", medicines).send(res, 200);
  });

  getExpiringSoon = asyncHandler(async (req, res) => {
    const medicines = await medicineService.getExpiringSoon();
    new ApiResponse(200, "Expiring medicines fetched successfully.", medicines).send(res, 200);
  });
}

module.exports = new MedicineController();

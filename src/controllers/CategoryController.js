const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const categoryService = require("../services/CategoryService");

class CategoryController {
  createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    new ApiResponse(201, "Category created successfully.", category).send(res, 201);
  });

  getCategories = asyncHandler(async (req, res) => {
    const { data, pagination } = await categoryService.getCategories(req.query);
    new ApiResponse(200, "Categories fetched successfully.", data, pagination).send(res, 200);
  });

  getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    new ApiResponse(200, "Category fetched successfully.", category).send(res, 200);
  });

  updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    new ApiResponse(200, "Category updated successfully.", category).send(res, 200);
  });

  deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    new ApiResponse(200, "Category deleted successfully.").send(res, 200);
  });
}

module.exports = new CategoryController();

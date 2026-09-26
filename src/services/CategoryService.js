const ApiError = require("../utils/ApiError");
const categoryRepository = require("../repositories/CategoryRepository");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination");

class CategoryService {
  async createCategory(data) {
    const existing = await categoryRepository.findByName(data.name);
    if (existing) throw ApiError.conflict("A category with this name already exists.");
    return categoryRepository.create({ name: data.name.trim(), description: data.description || "" });
  }

  async getCategories(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.search) filter.name = new RegExp(query.search, "i");

    const [categories, total] = await Promise.all([
      categoryRepository.findMany(filter, { skip, limit, sort: { name: 1 } }),
      categoryRepository.count(filter),
    ]);

    return { data: categories, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound("Category not found.");
    return category;
  }

  async updateCategory(id, data) {
    if (data.name) {
      const existing = await categoryRepository.findByName(data.name);
      if (existing && String(existing._id) !== String(id)) {
        throw ApiError.conflict("A category with this name already exists.");
      }
    }
    const category = await categoryRepository.updateById(id, data);
    if (!category) throw ApiError.notFound("Category not found.");
    return category;
  }

  async deleteCategory(id) {
    const category = await categoryRepository.deleteById(id);
    if (!category) throw ApiError.notFound("Category not found.");
    return { id };
  }
}

module.exports = new CategoryService();

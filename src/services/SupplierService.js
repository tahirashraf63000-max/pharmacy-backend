const ApiError = require("../utils/ApiError");
const supplierRepository = require("../repositories/SupplierRepository");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination");

class SupplierService {
  async createSupplier(data) {
    return supplierRepository.create(data);
  }

  async getSuppliers(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { name: new RegExp(query.search, "i") },
        { phone: new RegExp(query.search, "i") },
        { email: new RegExp(query.search, "i") },
      ];
    }

    const [suppliers, total] = await Promise.all([
      supplierRepository.findMany(filter, { skip, limit, sort: { name: 1 } }),
      supplierRepository.count(filter),
    ]);

    return { data: suppliers, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getSupplierById(id) {
    const supplier = await supplierRepository.findById(id);
    if (!supplier) throw ApiError.notFound("Supplier not found.");
    return supplier;
  }

  async updateSupplier(id, data) {
    const supplier = await supplierRepository.updateById(id, data);
    if (!supplier) throw ApiError.notFound("Supplier not found.");
    return supplier;
  }

  async deleteSupplier(id) {
    const supplier = await supplierRepository.deleteById(id);
    if (!supplier) throw ApiError.notFound("Supplier not found.");
    return { id };
  }
}

module.exports = new SupplierService();

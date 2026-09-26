const ApiError = require("../utils/ApiError");
const medicineRepository = require("../repositories/MedicineRepository");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination");

const POPULATE = ["category", "supplier"];

class MedicineService {
  async createMedicine(data) {
    return medicineRepository.create(data);
  }

  async getMedicines(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = { };

    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.supplier) filter.supplier = query.supplier;

    if (query.search) {
      filter.$or = [
        { name: new RegExp(query.search, "i") },
        { genericName: new RegExp(query.search, "i") },
        { batchNumber: new RegExp(query.search, "i") },
      ];
    }

    if (query.lowStock === "true") {
      filter.$expr = { $lte: ["$stock", "$lowStockThreshold"] };
    }

    if (query.expiringSoon === "true") {
      const now = new Date();
      const future = new Date();
      future.setDate(future.getDate() + 30);
      filter.expiryDate = { $gte: now, $lte: future };
    }

    let sort = { createdAt: -1 };
    if (query.sortBy) {
      const dir = query.sortDir === "asc" ? 1 : -1;
      sort = { [query.sortBy]: dir };
    }

    const [medicines, total] = await Promise.all([
      medicineRepository.findMany(filter, { skip, limit, sort, populate: POPULATE }),
      medicineRepository.count(filter),
    ]);

    return {
      data: medicines.map((m) => this._withStatuses(m)),
      pagination: buildPaginationMeta(total, page, limit),
    };
  }

  async getMedicineById(id) {
    const medicine = await medicineRepository.findById(id, POPULATE);
    if (!medicine) throw ApiError.notFound("Medicine not found.");
    return this._withStatuses(medicine);
  }

  async updateMedicine(id, data) {
    const medicine = await medicineRepository.updateById(id, data);
    if (!medicine) throw ApiError.notFound("Medicine not found.");
    return medicine;
  }

  async deleteMedicine(id) {
    const medicine = await medicineRepository.deleteById(id);
    if (!medicine) throw ApiError.notFound("Medicine not found.");
    return { id };
  }

  async getLowStock() {
    const medicines = await medicineRepository.findLowStock();
    return medicines.map((m) => this._withStatuses(m));
  }

  async getExpiringSoon() {
    const medicines = await medicineRepository.findExpiringSoon();
    return medicines.map((m) => this._withStatuses(m));
  }

  _withStatuses(medicine) {
    const obj = medicine.toObject ? medicine.toObject() : medicine;
    obj.stockStatus = medicine.getStockStatus ? medicine.getStockStatus() : undefined;
    obj.expiryStatus = medicine.getExpiryStatus ? medicine.getExpiryStatus() : undefined;
    return obj;
  }
}

module.exports = new MedicineService();

const BaseRepository = require("./BaseRepository");
const Medicine = require("../models/Medicine");

class MedicineRepository extends BaseRepository {
  constructor() {
    super(Medicine);
  }

  async findLowStock(limit = 50) {
    return this.model
      .find({ $expr: { $lte: ["$stock", "$lowStockThreshold"] }, status: "active" })
      .sort({ stock: 1 })
      .limit(limit)
      .populate("category", "name");
  }

  async findExpiringSoon(days = 30, limit = 50) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    return this.model
      .find({ expiryDate: { $gte: now, $lte: future }, status: "active" })
      .sort({ expiryDate: 1 })
      .limit(limit)
      .populate("category", "name");
  }

  async decrementStock(id, quantity, session = null) {
    return this.model.findOneAndUpdate(
      { _id: id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true, session }
    );
  }

  async incrementStock(id, quantity, session = null) {
    return this.model.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true, session }
    );
  }
}

module.exports = new MedicineRepository();

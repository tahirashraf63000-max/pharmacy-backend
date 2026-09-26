const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");
const Medicine = require("../models/Medicine");
const medicineRepository = require("../repositories/MedicineRepository");

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

class DashboardService {
  async getAdminDashboard() {
    const todayStart = startOfToday();

    const [todaySalesAgg, todayPurchasesAgg, totalMedicines, lowStock, expiringSoon, recentSales] =
      await Promise.all([
        Sale.aggregate([
          { $match: { createdAt: { $gte: todayStart }, status: "completed" } },
          { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
        ]),
        Purchase.aggregate([
          { $match: { createdAt: { $gte: todayStart } } },
          { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
        ]),
        Medicine.countDocuments({ status: "active" }),
        medicineRepository.findLowStock(5),
        medicineRepository.findExpiringSoon(30, 5),
        Sale.find().sort({ createdAt: -1 }).limit(5).populate("createdBy", "name"),
      ]);

    return {
      todaySales: todaySalesAgg[0]?.total || 0,
      todaySalesCount: todaySalesAgg[0]?.count || 0,
      todayPurchases: todayPurchasesAgg[0]?.total || 0,
      todayPurchasesCount: todayPurchasesAgg[0]?.count || 0,
      totalMedicines,
      lowStockCount: lowStock.length,
      lowStockMedicines: lowStock,
      expiringSoonCount: expiringSoon.length,
      expiringSoonMedicines: expiringSoon,
      recentSales,
    };
  }

  async getCashierDashboard(userId) {
    const todayStart = startOfToday();

    const [todaySalesAgg, recentSales] = await Promise.all([
      Sale.aggregate([
        { $match: { createdAt: { $gte: todayStart }, createdBy: userId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Sale.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    return {
      todaySales: todaySalesAgg[0]?.total || 0,
      todaySalesCount: todaySalesAgg[0]?.count || 0,
      recentSales,
    };
  }

  async getInventoryManagerDashboard() {
    const [totalMedicines, lowStock, expiringSoon, recentPurchases] = await Promise.all([
      Medicine.countDocuments({ status: "active" }),
      medicineRepository.findLowStock(5),
      medicineRepository.findExpiringSoon(30, 5),
      Purchase.find().sort({ createdAt: -1 }).limit(5).populate("supplier", "name"),
    ]);

    return {
      totalMedicines,
      lowStockCount: lowStock.length,
      lowStockMedicines: lowStock,
      expiringSoonCount: expiringSoon.length,
      expiringSoonMedicines: expiringSoon,
      recentPurchases,
    };
  }
}

module.exports = new DashboardService();

const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");
const medicineRepository = require("../repositories/MedicineRepository");

class ReportService {
  async getSalesReport({ startDate, endDate, groupBy = "day" }) {
    const match = { status: "completed" };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }

    const dateFormat = groupBy === "month" ? "%Y-%m" : "%Y-%m-%d";

    const results = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          totalDiscount: { $sum: "$discount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      period: r._id,
      totalSales: r.totalSales,
      totalDiscount: r.totalDiscount,
      transactionCount: r.transactionCount,
    }));
  }

  async getPurchaseReport({ startDate, endDate }) {
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }

    const results = await Purchase.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalPurchases: { $sum: "$total" },
          purchaseCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      period: r._id,
      totalPurchases: r.totalPurchases,
      purchaseCount: r.purchaseCount,
    }));
  }

  async getBestSellingMedicines(limit = 10) {
    return Sale.aggregate([
      { $match: { status: "completed" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.medicine",
          name: { $first: "$items.name" },
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: limit },
    ]);
  }

  async getProfitEstimate({ startDate, endDate }) {
    const match = { status: "completed" };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }

    const sales = await Sale.find(match).populate("items.medicine", "purchasePrice");

    let revenue = 0;
    let cost = 0;

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        revenue += item.subtotal;
        const purchasePrice = item.medicine?.purchasePrice || 0;
        cost += purchasePrice * item.quantity;
      });
    });

    return {
      revenue: Number(revenue.toFixed(2)),
      cost: Number(cost.toFixed(2)),
      profit: Number((revenue - cost).toFixed(2)),
    };
  }

  async getLowStockReport() {
    return medicineRepository.findLowStock(200);
  }

  async getExpiryReport() {
    return medicineRepository.findExpiringSoon(60, 200);
  }
}

module.exports = new ReportService();

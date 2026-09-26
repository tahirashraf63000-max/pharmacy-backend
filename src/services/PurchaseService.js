const ApiError = require("../utils/ApiError");
const purchaseRepository = require("../repositories/PurchaseRepository");
const medicineRepository = require("../repositories/MedicineRepository");
const generateInvoiceNumber = require("../utils/generateInvoiceNumber");
const {
  getPaginationParams,
  buildPaginationMeta,
} = require("../utils/pagination");

class PurchaseService {
  /**
   * Records a purchase and increases stock for each item.
   */
  async createPurchase(payload, requestingUser) {
    const { supplier, items } = payload;

    let total = 0;
    const resolvedItems = [];

    for (const item of items) {
      const medicine = await medicineRepository.model.findById(
        item.medicine
      );

      if (!medicine) {
        throw ApiError.badRequest(
          "Medicine not found for one of the purchase items."
        );
      }

      const quantity = Number(item.quantity);
      const purchasePrice = Number(item.purchasePrice);

      if (!quantity || quantity <= 0) {
        throw ApiError.badRequest(
          `Invalid quantity for ${medicine.name}.`
        );
      }

      if (
        isNaN(purchasePrice) ||
        purchasePrice < 0
      ) {
        throw ApiError.badRequest(
          `Invalid purchase price for ${medicine.name}.`
        );
      }

      const subtotal = Number(
        (quantity * purchasePrice).toFixed(2)
      );

      total += subtotal;

      resolvedItems.push({
        medicine: medicine._id,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        quantity,
        purchasePrice,
        subtotal,
      });

      // Increase medicine stock
      await medicineRepository.incrementStock(
        medicine._id,
        quantity
      );

      // Update medicine batch, expiry date and purchase price
      medicine.batchNumber = item.batchNumber;
      medicine.expiryDate = item.expiryDate;
      medicine.purchasePrice = purchasePrice;

      await medicine.save();
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber("PUR");

    // Create purchase
    const purchase = await purchaseRepository.model.create({
      invoiceNumber,
      supplier,
      items: resolvedItems,
      total: Number(total.toFixed(2)),
      createdBy: requestingUser.id || requestingUser._id,
    });

    return purchase;
  }

  async getPurchases(query) {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = {};

    if (query.supplier) {
      filter.supplier = query.supplier;
    }

    if (query.search) {
      filter.invoiceNumber = new RegExp(query.search, "i");
    }

    if (query.startDate || query.endDate) {
      filter.createdAt = {};

      if (query.startDate) {
        filter.createdAt.$gte = new Date(query.startDate);
      }

      if (query.endDate) {
        const end = new Date(query.endDate);

        end.setHours(23, 59, 59, 999);

        filter.createdAt.$lte = end;
      }
    }

    const [purchases, total] = await Promise.all([
      purchaseRepository.findMany(filter, {
        skip,
        limit,
        populate: [
          {
            path: "supplier",
            select: "name",
          },
          {
            path: "createdBy",
            select: "name",
          },
        ],
      }),

      purchaseRepository.count(filter),
    ]);

    return {
      data: purchases,
      pagination: buildPaginationMeta(
        total,
        page,
        limit
      ),
    };
  }

  async getPurchaseById(id) {
    const purchase = await purchaseRepository.findById(
      id,
      [
        {
          path: "supplier",
          select: "name phone email",
        },
        {
          path: "createdBy",
          select: "name",
        },
        {
          path: "items.medicine",
          select: "name",
        },
      ]
    );

    if (!purchase) {
      throw ApiError.notFound("Purchase not found.");
    }

    return purchase;
  }
}

module.exports = new PurchaseService();
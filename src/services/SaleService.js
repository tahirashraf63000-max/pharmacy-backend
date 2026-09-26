const ApiError = require("../utils/ApiError");
const saleRepository = require("../repositories/SaleRepository");
const medicineRepository = require("../repositories/MedicineRepository");
const generateInvoiceNumber = require("../utils/generateInvoiceNumber");
const {
  getPaginationParams,
  buildPaginationMeta,
} = require("../utils/pagination");

class SaleService {
  /**
   * Completes a POS sale.
   *
   * Prices are always read from the database.
   * Stock is checked before decrementing.
   */
  async createSale(payload, cashierUser) {
    const {
      items,
      discount = 0,
      paymentMethod,
      amountReceived = 0,
    } = payload;

    let subtotal = 0;
    const resolvedItems = [];

    // Validate items
    for (const item of items) {
      const medicine = await medicineRepository.model.findById(
        item.medicine
      );

      if (!medicine) {
        throw ApiError.badRequest(
          "Medicine not found for one of the cart items."
        );
      }

      if (medicine.status !== "active") {
        throw ApiError.badRequest(
          `${medicine.name} is not available for sale.`
        );
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity <= 0) {
        throw ApiError.badRequest(
          `Invalid quantity for ${medicine.name}.`
        );
      }

      // Check stock
      if (medicine.stock < quantity) {
        throw ApiError.badRequest(
          `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}.`
        );
      }

      // Always use selling price from database
      const unitPrice = medicine.sellingPrice;

      const itemSubtotal = unitPrice * quantity;

      subtotal += itemSubtotal;

      resolvedItems.push({
        medicine: medicine._id,
        name: medicine.name,
        quantity,
        unitPrice,
        subtotal: itemSubtotal,
      });
    }

    // Validate discount
    const safeDiscount = Math.max(
      Number(discount) || 0,
      0
    );

    if (safeDiscount > subtotal) {
      throw ApiError.badRequest(
        "Discount cannot exceed the subtotal."
      );
    }

    // Calculate total
    const total = Number(
      (subtotal - safeDiscount).toFixed(2)
    );

    // Calculate change
    let change = 0;

    if (paymentMethod === "cash") {
      if (Number(amountReceived) < total) {
        throw ApiError.badRequest(
          "Amount received is less than the total amount due."
        );
      }

      change = Number(
        (Number(amountReceived) - total).toFixed(2)
      );
    }

    // Decrease stock
    for (const item of resolvedItems) {
      const updated =
        await medicineRepository.decrementStock(
          item.medicine,
          item.quantity
        );

      if (!updated) {
        throw ApiError.badRequest(
          `Insufficient stock for ${item.name}.`
        );
      }
    }

    // Generate invoice number
    const invoiceNumber =
      await generateInvoiceNumber("INV");

    // Create sale
    const sale = await saleRepository.model.create({
      invoiceNumber,
      items: resolvedItems,
      subtotal: Number(subtotal.toFixed(2)),
      discount: safeDiscount,
      total,
      paymentMethod,
      amountReceived:
        paymentMethod === "cash"
          ? Number(amountReceived)
          : total,
      change,
      createdBy:
        cashierUser.id || cashierUser._id,
    });

    return sale;
  }

  /**
   * Get sales with pagination and filters.
   */
  async getSales(query, requestingUser) {
    const {
      page,
      limit,
      skip,
    } = getPaginationParams(query);

    const filter = {};

    // Cashiers may only see their own sales
    if (requestingUser.role === "cashier") {
      filter.createdBy =
        requestingUser.id || requestingUser._id;
    }

    // Payment method filter
    if (query.paymentMethod) {
      filter.paymentMethod = query.paymentMethod;
    }

    // Status filter
    if (query.status) {
      filter.status = query.status;
    }

    // Invoice search
    if (query.search) {
      filter.invoiceNumber = new RegExp(
        query.search,
        "i"
      );
    }

    // Date filter
    if (query.startDate || query.endDate) {
      filter.createdAt = {};

      if (query.startDate) {
        filter.createdAt.$gte = new Date(
          query.startDate
        );
      }

      if (query.endDate) {
        const end = new Date(query.endDate);

        end.setHours(23, 59, 59, 999);

        filter.createdAt.$lte = end;
      }
    }

    const [sales, total] = await Promise.all([
      saleRepository.findMany(filter, {
        skip,
        limit,
        populate: [
          {
            path: "createdBy",
            select: "name",
          },
        ],
      }),

      saleRepository.count(filter),
    ]);

    return {
      data: sales,
      pagination: buildPaginationMeta(
        total,
        page,
        limit
      ),
    };
  }

  /**
   * Get a single sale by ID.
   */
  async getSaleById(id, requestingUser) {
    const sale = await saleRepository.findById(
      id,
      [
        {
          path: "createdBy",
          select: "name",
        },
      ]
    );

    if (!sale) {
      throw ApiError.notFound("Sale not found.");
    }

    // Cashiers can only view their own sales
    if (
      requestingUser.role === "cashier" &&
      String(sale.createdBy._id) !==
        String(
          requestingUser.id ||
            requestingUser._id
        )
    ) {
      throw ApiError.forbidden(
        "You can only view your own sales."
      );
    }

    return sale;
  }
}

module.exports = new SaleService();
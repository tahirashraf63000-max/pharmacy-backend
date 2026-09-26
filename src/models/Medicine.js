const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    genericName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    batchNumber: {
      type: String,
      required: [true, "Batch number is required"],
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    purchasePrice: {
      type: Number,
      required: [true, "Purchase price is required"],
      min: [0, "Purchase price cannot be negative"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Selling price cannot be negative"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

medicineSchema.index({ name: 1 });
medicineSchema.index({ batchNumber: 1 });
medicineSchema.index({ expiryDate: 1 });

// Virtual-like helper (not persisted) — computed on demand in services.
medicineSchema.methods.getStockStatus = function () {
  if (this.stock <= 0) return "out_of_stock";
  if (this.stock <= this.lowStockThreshold) return "low_stock";
  return "in_stock";
};

medicineSchema.methods.getExpiryStatus = function () {
  const now = new Date();
  const daysToExpiry = Math.ceil((this.expiryDate - now) / (1000 * 60 * 60 * 24));
  if (daysToExpiry < 0) return "expired";
  if (daysToExpiry <= 30) return "expiring_soon";
  return "ok";
};

module.exports = mongoose.model("Medicine", medicineSchema);

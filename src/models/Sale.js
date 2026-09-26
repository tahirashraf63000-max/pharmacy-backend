const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [saleItemSchema],
      validate: [(arr) => arr.length > 0, "Sale must contain at least one item"],
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: [0, "Discount cannot be negative"] },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "other"],
      required: true,
    },
    amountReceived: { type: Number, min: 0, default: 0 },
    change: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["completed", "cancelled"],
      default: "completed",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

saleSchema.index({ createdAt: -1 });
saleSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Sale", saleSchema);

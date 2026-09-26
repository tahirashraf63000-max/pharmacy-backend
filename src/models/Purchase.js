const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    batchNumber: { type: String, required: true, trim: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
    purchasePrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const purchaseSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: {
      type: [purchaseItemSchema],
      validate: [(arr) => arr.length > 0, "Purchase must contain at least one item"],
    },
    total: { type: Number, required: true, min: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

purchaseSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Purchase", purchaseSchema);

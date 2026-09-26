const mongoose = require("mongoose");

function validateMedicine(body) {
  const errors = [];
  const {
    name,
    category,
    batchNumber,
    expiryDate,
    purchasePrice,
    sellingPrice,
    stock,
    supplier,
  } = body;

  if (!name || !name.trim()) errors.push("Medicine name is required.");

  if (!category || !mongoose.isValidObjectId(category)) errors.push("A valid category is required.");

  if (!batchNumber || !String(batchNumber).trim()) errors.push("Batch number is required.");

  if (!expiryDate || isNaN(new Date(expiryDate).getTime())) {
    errors.push("A valid expiry date is required.");
  } else if (new Date(expiryDate) < new Date(new Date().toDateString())) {
    errors.push("Expiry date cannot be in the past.");
  }

  if (purchasePrice === undefined || purchasePrice === null || isNaN(purchasePrice) || Number(purchasePrice) < 0) {
    errors.push("Purchase price must be a valid positive number.");
  }

  if (sellingPrice === undefined || sellingPrice === null || isNaN(sellingPrice) || Number(sellingPrice) < 0) {
    errors.push("Selling price must be a valid positive number.");
  }

  if (
    purchasePrice !== undefined &&
    sellingPrice !== undefined &&
    !isNaN(purchasePrice) &&
    !isNaN(sellingPrice) &&
    Number(sellingPrice) < Number(purchasePrice)
  ) {
    errors.push("Selling price should not be lower than purchase price.");
  }

  if (stock === undefined || stock === null || isNaN(stock) || Number(stock) < 0) {
    errors.push("Stock must be a valid non-negative number.");
  }

  if (supplier && !mongoose.isValidObjectId(supplier)) errors.push("Invalid supplier reference.");

  return errors;
}

module.exports = { validateMedicine };

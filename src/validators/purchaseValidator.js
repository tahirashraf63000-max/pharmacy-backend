const mongoose = require("mongoose");

function validatePurchase(body) {
  const errors = [];
  const { supplier, items } = body;

  if (!supplier || !mongoose.isValidObjectId(supplier)) {
    errors.push("A valid supplier is required.");
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("Purchase must contain at least one item.");
  } else {
    items.forEach((item, idx) => {
      if (!item.medicine || !mongoose.isValidObjectId(item.medicine)) {
        errors.push(`Item ${idx + 1}: a valid medicine is required.`);
      }
      if (!item.batchNumber || !String(item.batchNumber).trim()) {
        errors.push(`Item ${idx + 1}: batch number is required.`);
      }
      if (!item.expiryDate || isNaN(new Date(item.expiryDate).getTime())) {
        errors.push(`Item ${idx + 1}: a valid expiry date is required.`);
      }
      if (!item.quantity || isNaN(item.quantity) || Number(item.quantity) <= 0) {
        errors.push(`Item ${idx + 1}: quantity must be greater than 0.`);
      }
      if (item.purchasePrice === undefined || isNaN(item.purchasePrice) || Number(item.purchasePrice) < 0) {
        errors.push(`Item ${idx + 1}: purchase price must be a valid positive number.`);
      }
    });
  }

  return errors;
}

module.exports = { validatePurchase };

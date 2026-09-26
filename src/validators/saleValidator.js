const mongoose = require("mongoose");

function validateSale(body) {
  const errors = [];
  const { items, paymentMethod, discount, amountReceived } = body;

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("Sale must contain at least one item.");
  } else {
    items.forEach((item, idx) => {
      if (!item.medicine || !mongoose.isValidObjectId(item.medicine)) {
        errors.push(`Item ${idx + 1}: a valid medicine is required.`);
      }
      if (!item.quantity || isNaN(item.quantity) || Number(item.quantity) <= 0) {
        errors.push(`Item ${idx + 1}: quantity must be greater than 0.`);
      }
    });
  }

  if (!["cash", "card", "other"].includes(paymentMethod)) {
    errors.push("A valid payment method is required.");
  }

  if (discount !== undefined && (isNaN(discount) || Number(discount) < 0)) {
    errors.push("Discount cannot be negative.");
  }

  if (paymentMethod === "cash") {
    if (amountReceived === undefined || isNaN(amountReceived) || Number(amountReceived) < 0) {
      errors.push("Amount received is required for cash payments.");
    }
  }

  return errors;
}

module.exports = { validateSale };

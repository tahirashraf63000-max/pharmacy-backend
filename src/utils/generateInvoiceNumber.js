const Counter = require("../models/Counter");

/**
 * Generates a sequential invoice number like INV-2026-0001 or PUR-2026-0001
 * using an atomic MongoDB counter to avoid duplicates under concurrency.
 */
async function generateInvoiceNumber(prefix) {
  const year = new Date().getFullYear();
  const key = `${prefix}-${year}`;

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(counter.seq).padStart(4, "0");
  return `${prefix}-${year}-${seq}`;
}

module.exports = generateInvoiceNumber;

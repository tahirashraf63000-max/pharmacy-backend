function validateSupplier(body) {
  const errors = [];
  const { name, phone, email } = body;

  if (!name || !name.trim()) errors.push("Supplier name is required.");
  if (!phone || !/^[0-9+\-\s()]{7,20}$/.test(phone)) errors.push("Please provide a valid phone number.");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push("Please provide a valid email address.");

  return errors;
}

module.exports = { validateSupplier };

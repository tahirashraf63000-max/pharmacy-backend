function validateCategory(body) {
  const errors = [];
  if (!body.name || !body.name.trim()) errors.push("Category name is required.");
  return errors;
}

module.exports = { validateCategory };

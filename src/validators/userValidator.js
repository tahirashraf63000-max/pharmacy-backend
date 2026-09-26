const VALID_ROLES = ["admin", "cashier", "inventory_manager"];

function validateCreateUser(body) {
  const errors = [];
  const { name, email, password, role } = body;

  if (!name || !name.trim()) errors.push("Name is required.");
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Please provide a valid email address.");
  if (!password || password.length < 6) errors.push("Password must be at least 6 characters.");
  if (role && !VALID_ROLES.includes(role)) errors.push("Invalid role provided.");

  return errors;
}

function validateUpdateUser(body) {
  const errors = [];
  const { name, email, role } = body;

  if (name !== undefined && !name.trim()) errors.push("Name cannot be empty.");
  if (email !== undefined && !/^\S+@\S+\.\S+$/.test(email)) errors.push("Please provide a valid email address.");
  if (role !== undefined && !VALID_ROLES.includes(role)) errors.push("Invalid role provided.");

  return errors;
}

module.exports = { validateCreateUser, validateUpdateUser, VALID_ROLES };

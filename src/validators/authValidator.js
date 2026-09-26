const mongoose = require("mongoose");

function validateLogin(body) {
  const errors = [];
  const { email, password } = body;

  if (!email || !String(email).trim()) errors.push("Email is required.");
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push("Please provide a valid email address.");

  if (!password) errors.push("Password is required.");

  return errors;
}

module.exports = { validateLogin };

const express = require("express");
const authController = require("../controllers/AuthController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { validateLogin } = require("../validators/authValidator");

const router = express.Router();

router.post("/login", validateRequest(validateLogin), authController.login);
router.get("/me", authenticateUser, authController.me);
router.post("/logout", authenticateUser, authController.logout);

module.exports = router;

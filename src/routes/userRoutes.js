const express = require("express");
const userController = require("../controllers/UserController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { validateCreateUser, validateUpdateUser } = require("../validators/userValidator");

const router = express.Router();

router.use(authenticateUser, authorizeRoles("admin"));

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", validateRequest(validateCreateUser), userController.createUser);
router.patch("/:id", validateRequest(validateUpdateUser), userController.updateUser);
router.patch("/:id/status", userController.updateStatus);
router.delete("/:id", userController.deleteUser);

module.exports = router;

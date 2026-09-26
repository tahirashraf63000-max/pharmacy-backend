const express = require("express");
const categoryController = require("../controllers/CategoryController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { validateCategory } = require("../validators/categoryValidator");

const router = express.Router();

router.use(authenticateUser);

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", authorizeRoles("admin", "inventory_manager"), validateRequest(validateCategory), categoryController.createCategory);
router.patch("/:id", authorizeRoles("admin", "inventory_manager"), categoryController.updateCategory);
router.delete("/:id", authorizeRoles("admin"), categoryController.deleteCategory);

module.exports = router;

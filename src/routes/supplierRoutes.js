const express = require("express");
const supplierController = require("../controllers/SupplierController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { validateSupplier } = require("../validators/supplierValidator");

const router = express.Router();

router.use(authenticateUser, authorizeRoles("admin", "inventory_manager"));

router.get("/", supplierController.getSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.post("/", validateRequest(validateSupplier), supplierController.createSupplier);
router.patch("/:id", supplierController.updateSupplier);
router.delete("/:id", authorizeRoles("admin"), supplierController.deleteSupplier);

module.exports = router;

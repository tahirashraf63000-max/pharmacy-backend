const express = require("express");
const purchaseController = require("../controllers/PurchaseController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { validatePurchase } = require("../validators/purchaseValidator");

const router = express.Router();

router.use(authenticateUser, authorizeRoles("admin", "inventory_manager"));

router.get("/", purchaseController.getPurchases);
router.get("/:id", purchaseController.getPurchaseById);
router.post("/", validateRequest(validatePurchase), purchaseController.createPurchase);

module.exports = router;

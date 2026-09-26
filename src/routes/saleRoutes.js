const express = require("express");
const saleController = require("../controllers/SaleController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { validateSale } = require("../validators/saleValidator");

const router = express.Router();

router.use(authenticateUser);

router.get("/", authorizeRoles("admin", "cashier"), saleController.getSales);
router.get("/:id", authorizeRoles("admin", "cashier"), saleController.getSaleById);
router.post("/", authorizeRoles("admin", "cashier"), validateRequest(validateSale), saleController.createSale);

module.exports = router;

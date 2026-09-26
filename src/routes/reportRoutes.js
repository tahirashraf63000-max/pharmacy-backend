const express = require("express");
const reportController = require("../controllers/ReportController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authenticateUser);

router.get("/sales", authorizeRoles("admin"), reportController.salesReport);
router.get("/purchases", authorizeRoles("admin", "inventory_manager"), reportController.purchaseReport);
router.get("/best-selling", authorizeRoles("admin"), reportController.bestSelling);
router.get("/profit", authorizeRoles("admin"), reportController.profitEstimate);
router.get("/low-stock", authorizeRoles("admin", "inventory_manager"), reportController.lowStock);
router.get("/expiry", authorizeRoles("admin", "inventory_manager"), reportController.expiry);

module.exports = router;

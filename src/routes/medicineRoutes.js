const express = require("express");
const medicineController = require("../controllers/MedicineController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { validateMedicine } = require("../validators/medicineValidator");

const router = express.Router();

router.use(authenticateUser);

router.get("/", medicineController.getMedicines);
router.get("/low-stock", medicineController.getLowStock);
router.get("/expiring-soon", medicineController.getExpiringSoon);
router.get("/:id", medicineController.getMedicineById);

router.post("/", authorizeRoles("admin", "inventory_manager"), validateRequest(validateMedicine), medicineController.createMedicine);
router.patch("/:id", authorizeRoles("admin", "inventory_manager"), medicineController.updateMedicine);
router.delete("/:id", authorizeRoles("admin"), medicineController.deleteMedicine);

module.exports = router;

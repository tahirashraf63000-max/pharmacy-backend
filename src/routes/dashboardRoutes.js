const express = require("express");
const dashboardController = require("../controllers/DashboardController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, dashboardController.getDashboard);

module.exports = router;

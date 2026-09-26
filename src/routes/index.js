const express = require("express");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const medicineRoutes = require("./medicineRoutes");
const categoryRoutes = require("./categoryRoutes");
const supplierRoutes = require("./supplierRoutes");
const saleRoutes = require("./saleRoutes");
const purchaseRoutes = require("./purchaseRoutes");
const reportRoutes = require("./reportRoutes");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/medicines", medicineRoutes);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/sales", saleRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/reports", reportRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;

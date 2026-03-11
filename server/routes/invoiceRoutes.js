const express = require("express");
const router = express.Router();
const { createInvoice, getInvoices, getClientInvoices, downloadInvoice } = require("../controllers/invoiceController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, admin, createInvoice);
router.get("/", protect, admin, getInvoices);
router.get("/my-invoices", protect, getClientInvoices);
router.get("/download/:id", protect, downloadInvoice);

module.exports = router;

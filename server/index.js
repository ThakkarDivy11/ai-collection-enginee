require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

// Payment webhook needs raw body
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

const { initCron } = require("./services/automationService");
const { initAgentCron } = require("./ai-agent/scheduler");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aicollection");

mongoose.connection.once("open", () => {
    console.log("MongoDB Connected");
    initCron(); // Start the daily automation cron job
    initAgentCron(); // Start the AI Agent chronological job
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
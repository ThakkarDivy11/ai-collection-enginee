const express = require("express");
const router = express.Router();
const { generateInsights, generateEmail, smartSearch, sendAiEmail, getAiAnalytics, generateChurnPrediction, classifyClientStatus } = require("../controllers/aiController");
const { runAgentCycle, getAiActionsLog, manualSendReminder, getAiVoiceCalls } = require("../ai-agent/agentController");
const { negotiatePaymentPlan } = require("../ai-agent/negotiationAgent");
const { protect, admin } = require("../middleware/authMiddleware");

// Existing routes
router.get("/insights", protect, admin, generateInsights);
router.get("/analytics", protect, admin, getAiAnalytics);
router.post("/generate-email", protect, admin, generateEmail);
router.post("/send-email", protect, admin, sendAiEmail);
router.post("/smart-search", protect, admin, smartSearch);
router.post("/churn-prediction", protect, admin, generateChurnPrediction);

// New Agentic AI routes
router.get("/run-agent", runAgentCycle);       // Endpoint to trigger cron run manually
router.get("/actions", getAiActionsLog);       // Dashboard logs
router.post("/send-reminder", manualSendReminder); // Manual override
router.get("/voice-calls", getAiVoiceCalls);   // Voice call logs
router.post("/negotiate", negotiatePaymentPlan); // AI Negotiation
router.post("/classify/:id", protect, admin, classifyClientStatus); // User Classification

module.exports = router;

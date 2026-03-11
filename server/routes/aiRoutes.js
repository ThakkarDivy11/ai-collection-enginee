const express = require("express");
const router = express.Router();
const { generateInsights, generateEmail, smartSearch, sendAiEmail, getAiAnalytics, generateChurnPrediction } = require("../controllers/aiController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/insights", protect, admin, generateInsights);
router.get("/analytics", protect, admin, getAiAnalytics);
router.post("/generate-email", protect, admin, generateEmail);
router.post("/send-email", protect, admin, sendAiEmail);
router.post("/smart-search", protect, admin, smartSearch);
router.post("/churn-prediction", protect, admin, generateChurnPrediction);

module.exports = router;

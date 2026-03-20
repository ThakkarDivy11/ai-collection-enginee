const cron = require("node-cron");
const axios = require("axios");

/**
 * Initializes the AI Agent scheduler
 * Runs every day at 09:00 AM server time
 */
const initAgentCron = () => {
    cron.schedule("0 9 * * *", async () => {
        console.log("[AI Agent] Daily Cron Job Started: Checking for overdue invoices...");

        try {
            // Internally call our own API or controller method
            // Calling via HTTP as a simple decoupling, but requiring controller logic directly is also fine.
            const HOST = process.env.PORT ? `http://localhost:${process.env.PORT}` : "http://localhost:5000";
            
            const response = await axios.get(`${HOST}/api/ai/run-agent`);
            
            console.log(`[AI Agent] Cron executed. Processed ${response.data.count} actions.`);
        } catch (error) {
            console.error("[AI Agent] Cron Job Failed:", error.message);
        }
    });

    console.log("AI Agent Daily Scheduler Initialized (runs at 09:00 AM)");
};

module.exports = {
    initAgentCron,
};

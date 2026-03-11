require("dotenv").config();
const mongoose = require("mongoose");
const { runDailyAutomation } = require("./services/automationService");

const testCron = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aicollection");
        console.log("DB Connected for test run");

        await runDailyAutomation();

        console.log("Test run completed.");
        process.exit(0);
    } catch (error) {
        console.error("Test run failed:", error);
        process.exit(1);
    }
};

testCron();

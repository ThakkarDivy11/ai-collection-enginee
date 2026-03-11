const cron = require("node-cron");
const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const aiController = require("../controllers/aiController");
const sendEmail = require("../utils/emailService");

const runDailyAutomation = async () => {
    console.log("--- Starting Daily Automation Cron Job ---");
    try {
        // 1. Fetch all unpaid and overdue invoices
        const invoices = await Invoice.find({
            status: { $in: ["unpaid", "overdue"] }
        }).populate("clientId");

        console.log(`Found ${invoices.length} unpaid/overdue invoices.`);

        const today = new Date();

        for (const invoice of invoices) {
            const client = invoice.clientId;
            if (!client) continue;

            const dueDate = new Date(invoice.dueDate);
            const diffTime = today - dueDate;
            const daysOverdue = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

            // 2. Update status to overdue if applicable
            if (daysOverdue > 0 && invoice.status === "unpaid") {
                invoice.status = "overdue";
                await invoice.save();
                console.log(`Invoice ${invoice.invoiceNumber} marked as OVERDUE (${daysOverdue} days).`);
            }

            // 3. Determine suggested tone based on aging
            let suggestedTone = "Polite";
            if (daysOverdue > 21) {
                suggestedTone = "Legal";
            } else if (daysOverdue > 7) {
                suggestedTone = "Firm";
            }

            // 4. Prepare data for AI Risk Scoring
            const invoiceData = {
                invoiceNumber: invoice.invoiceNumber,
                amount: invoice.amount,
                dueDate: invoice.dueDate,
                daysOverdue: daysOverdue,
                clientName: client.name,
                company: client.company,
                clientStatus: client.status
            };

            // 5. Generate Refined AI Risk Analysis
            const { predictedDelayDays, riskLevel, riskReason, generatedMessage } =
                await aiController.getDetailedRiskAnalysis(invoiceData, suggestedTone);

            console.log(`--- Analysis for ${invoice.invoiceNumber} ---`);
            console.log(`Risk Level: ${riskLevel}`);
            console.log(`Predicted Delay: ${predictedDelayDays} additional days`);
            console.log(`Reason: ${riskReason}`);
            console.log(`Tone Used: ${suggestedTone}`);

            // 6. Business Action based on Risk Level
            if (riskLevel === "High" && client.status !== "churn-risk") {
                client.status = "churn-risk";
                await client.save();
                console.log(`Client ${client.name} marked as churn-risk.`);
            }

            // 7. Send the AI Generated Message
            const emailSubject = `${suggestedTone.toUpperCase()} Reminder: Invoice ${invoice.invoiceNumber} from CollectAI`;

            try {
                await sendEmail({
                    to: client.email,
                    subject: emailSubject,
                    text: generatedMessage,
                    html: `<p>${generatedMessage.replace(/\n/g, "<br>")}</p>`
                });
                console.log(`AI-generated ${suggestedTone} message sent to ${client.email}`);
            } catch (emailError) {
                console.error(`Failed to send email to ${client.email}:`, emailError.message);
            }
        }

        console.log("--- Daily Automation Completed ---");
    } catch (error) {
        console.error("Critical error in daily automation:", error.message);
    }
};

// Schedule for every day at midnight (00:00)
// For testing purposes, you can change this to run more frequently
const initCron = () => {
    console.log("Initializing daily automation cron job...");
    // 0 0 * * * runs every day at 00:00
    cron.schedule("0 0 * * *", () => {
        runDailyAutomation();
    });
};

module.exports = {
    initCron,
    runDailyAutomation // Export for manual trigger
};

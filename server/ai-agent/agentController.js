const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const AiAction = require("../models/AiAction");
const ConversationMemory = require("../models/ConversationMemory");

const { decideAction } = require("./decisionEngine");
const {
    sendEmailReminder,
    triggerVoiceCall,
    updateInvoiceStatus,
    scheduleNextReminder,
} = require("./reminderTools");

/**
 * Controller to trigger the autonomous agent process
 */
const runAgentCycle = async (req, res) => {
    try {
        // Find unpaid invoices
        const overdueInvoices = await Invoice.find({ status: { $in: ["unpaid", "overdue"] } }).populate("clientId");

        const actionsTaken = [];

        for (let invoice of overdueInvoices) {
            const client = invoice.clientId;
            if (!client) continue;

            const decision = await decideAction(invoice, client);

            if (decision.action === "none") continue;

            let toolResult = { actionStatus: "pending" };
            let finalActionEnum = "none";

            // Execute the decided action based on overdue rules
            if (decision.action === "friendly" || decision.action === "email") {
                toolResult = await sendEmailReminder(client.email, decision.message);
                finalActionEnum = "email";
            } else if (decision.action === "escalate") {
                // Trigger AI voice call + mark invoice overdue
                if (client.phone) {
                    toolResult = await triggerVoiceCall(
                        client.phone,
                        client.name,
                        invoice._id,
                        invoice.amount,
                        decision.message
                    );
                }
                await updateInvoiceStatus(invoice._id);
                finalActionEnum = "call";
            }

            // Log the action to database with actionStatus
            const actionLog = new AiAction({
                invoiceId: invoice._id,
                customerName: client.name,
                amount: invoice.amount,
                action: finalActionEnum,
                message: decision.message,
                actionStatus: toolResult.actionStatus || "sent",
                timestamp: new Date()
            });
            await actionLog.save();

            // Store in Conversation Memory
            const memory = new ConversationMemory({
                customerId: client._id,
                invoiceId: invoice._id,
                message: "System: Reminder sent",
                aiReply: decision.message,
            });
            await memory.save();

            await scheduleNextReminder(invoice._id);

            actionsTaken.push({
                invoiceId: invoice._id,
                clientName: client.name,
                action: finalActionEnum,
                actionStatus: toolResult.actionStatus || "sent",
                message: decision.message,
            });
        }

        res.status(200).json({ success: true, count: actionsTaken.length, actions: actionsTaken });
    } catch (error) {
        console.error("Error running AI Agent:", error);
        res.status(500).json({ success: false, message: "Error running AI Agent" });
    }
};

/**
 * API Endpoint to fetch latest actions to display on frontend dashboard
 */
const getAiActionsLog = async (req, res) => {
    try {
        const actions = await AiAction.find()
            .sort({ timestamp: -1 })
            .limit(50)
            .populate({
                path: "invoiceId",
                populate: {
                    path: "clientId",
                    model: "Client",
                },
            });

        // Normalize old and new field formats
        const normalized = actions.map((a) => {
            const doc = a.toObject();
            return {
                _id: doc._id,
                timestamp: doc.timestamp || doc.createdAt,
                customerName: doc.customerName || doc.invoiceId?.clientId?.name || "Unknown",
                amount: doc.amount != null ? doc.amount : (doc.invoiceId?.amount || 0),
                action: doc.action || doc.action_taken || "-",
                message: doc.message || doc.message_sent || "-",
                actionStatus: doc.actionStatus || "sent",
            };
        });

        res.status(200).json(normalized);
    } catch (error) {
        console.error("Error fetching AI actions:", error);
        res.status(500).json({ success: false, message: "Error fetching AI actions" });
    }
};

/**
 * API Endpoint to manually trigger a reminder for a specific invoice
 */
const manualSendReminder = async (req, res) => {
    try {
        const { invoiceId, type } = req.body;
        const invoice = await Invoice.findById(invoiceId).populate("clientId");

        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        const client = invoice.clientId;
        const decision = await decideAction(invoice, client); // Generate dynamic text based on current delays

        await sendEmailReminder(client.email, decision.message);

        const logType = "email";

        const actionLog = new AiAction({
            invoiceId: invoice._id,
            customerName: client.name,
            amount: invoice.amount,
            action: logType,
            message: decision.message,
            timestamp: new Date()
        });
        await actionLog.save();

        res.status(200).json({ success: true, message: `Sent ${logType} reminder to ${client.name}` });
    } catch (error) {
        console.error("Error sending manual reminder:", error);
        res.status(500).json({ success: false, message: "Error sending manual reminder" });
    }
};

const getAiVoiceCalls = async (req, res) => {
    try {
        const VoiceCallLog = require("../models/VoiceCallLog");
        const calls = await VoiceCallLog.find()
            .sort({ timestamp: -1 })
            .limit(50);
        res.status(200).json(calls);
    } catch (error) {
        console.error("Error fetching AI voice calls:", error);
        res.status(500).json({ success: false, message: "Error fetching AI voice calls" });
    }
};

module.exports = {
    runAgentCycle,
    getAiActionsLog,
    manualSendReminder,
    getAiVoiceCalls,
};

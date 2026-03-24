const axios = require("axios");

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3";

/**
 * Call local Ollama Llama3 to generate a personalized reminder message
 */
const generateReminderMessage = async (customerName, amountDue, dueDate, daysOverdue, actionType) => {
    let prompt = `You are a professional but friendly AI collections agent. 
Write a short, polite message to a customer named ${customerName} reminding them about an unpaid invoice of $${amountDue} that was due on ${dueDate} (which is ${daysOverdue} days overdue).`;

    if (actionType === "friendly") {
        prompt += " Keep the tone very gentle, as they might have just forgotten.";
    } else if (actionType === "email") {
        prompt += " Keep it professional but clear that the payment is required soon.";
    } else {
        prompt += " Make it formal and state that the account may face suspension if not resolved.";
    }

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false,
        });
        return response.data.response.trim();
    } catch (error) {
        console.error("Error communicating with Ollama:", error.message);
        // Fallback message just in case Ollama is not running
        return `Hello ${customerName}, this is a gentle reminder that your invoice of $${amountDue} was due on ${dueDate}. Please arrange payment at your earliest convenience.`;
    }
};

/**
 * Core decision logic determining the next best action
 */
const decideAction = async (invoice, client) => {
    const today = new Date();
    const due = new Date(invoice.dueDate);
    const timeDiff = today.getTime() - due.getTime();
    const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysOverdue <= 0) {
        return { action: "none", message: "Not overdue yet" };
    }

    let actionType = "";
    if (daysOverdue < 3) {
        actionType = "friendly"; 
    } else if (daysOverdue >= 3 && daysOverdue <= 10) {
        actionType = "email";
    } else {
        actionType = "escalate";
    }

    const message = await generateReminderMessage(
        client.name,
        invoice.amount,
        due.toLocaleDateString(),
        daysOverdue,
        actionType
    );

    return {
        action: actionType,
        daysOverdue,
        message,
    };
};

module.exports = {
    decideAction,
};

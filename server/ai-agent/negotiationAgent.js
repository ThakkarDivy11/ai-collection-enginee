const axios = require("axios");
const ConversationMemory = require("../models/ConversationMemory");
const Client = require("../models/Client");

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3";

/**
 * Handle negotiation logic with the customer when they reply refusing to pay the full amount
 */
const negotiatePaymentPlan = async (req, res) => {
    try {
        const { customerId, message } = req.body;

        const client = await Client.findById(customerId);
        if (!client) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const prompt = `You are an AI Collections Agent negotiating a payment plan.
The customer ${client.name} says: "${message}".
Please generate a friendly response offering a structured payment plan. Be concise and professional. Do not surround your response with quotes.`;

        let aiReply = "I understand. Would you be able to pay 50% today and the remaining amount next week?";
        
        try {
            const response = await axios.post(OLLAMA_URL, {
                model: MODEL_NAME,
                prompt: prompt,
                stream: false,
            });
            aiReply = response.data.response.trim();
        } catch (error) {
            console.error("Error communicating with Ollama for negotiation:", error.message);
        }

        const memory = new ConversationMemory({
            customerId: client._id,
            message: message,
            aiReply: aiReply,
            timestamp: new Date()
        });
        await memory.save();

        res.status(200).json({ success: true, reply: aiReply });
    } catch (error) {
        console.error("Error in negotiation agent:", error);
        res.status(500).json({ success: false, message: "Error negotiating payment plan" });
    }
};

module.exports = {
    negotiatePaymentPlan
};

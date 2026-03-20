const mongoose = require("mongoose");

const conversationMemorySchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
        },
        message: {
            type: String,
            required: true,
        },
        aiReply: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ConversationMemory", conversationMemorySchema);

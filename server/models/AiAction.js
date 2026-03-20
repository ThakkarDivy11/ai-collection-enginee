const mongoose = require("mongoose");

const aiActionSchema = new mongoose.Schema(
    {
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true,
        },
        customerName: {
            type: String,
        },
        amount: {
            type: Number,
        },
        action: {
            type: String,
        },
        message: {
            type: String,
        },
        actionStatus: {
            type: String,
            enum: ["sent", "failed", "pending"],
            default: "pending",
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AiAction", aiActionSchema);

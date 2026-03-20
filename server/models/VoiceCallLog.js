const mongoose = require("mongoose");

const voiceCallLogSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true,
        },
        callStatus: {
            type: String, // 'completed', 'failed', 'no-answer', etc.
            required: true,
        },
        transcript: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("VoiceCallLog", voiceCallLogSchema);

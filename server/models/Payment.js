const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        stripeId: {
            type: String,
        },
        currency: {
            type: String,
            default: "usd",
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);

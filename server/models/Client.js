const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: false },
        company: { type: String, required: true },
        password: { type: String, required: true },
        status: {
            type: String,
            enum: ["active", "inactive", "churn-risk"],
            default: "active",
        },
        lastActive: {
            type: Date,
            default: Date.now,
        },
        usageLevel: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
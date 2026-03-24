const mongoose = require("mongoose");
const Client = require("./models/Client");
const Invoice = require("./models/Invoice");
const { classifyClientStatus } = require("./controllers/aiController");
require("dotenv").config();

async function testClassification() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aicollection");
        console.log("DB Connected");

        // Create a test client
        const testClient = await Client.create({
            name: "Test Active User",
            email: `test_active_${Date.now()}@example.com`,
            company: "Test Co",
            password: "password123",
            lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            usageLevel: "high"
        });

        console.log("Test Client Created:", testClient._id);

        // Mock req/res for the controller function
        const req = { params: { id: testClient._id } };
        const res = {
            status: function(code) {
                console.log("Status Code:", code);
                return this;
            },
            json: function(data) {
                console.log("Response Data:", JSON.stringify(data, null, 2));
                return this;
            }
        };

        await classifyClientStatus(req, res);

        // Cleanup
        await Client.findByIdAndDelete(testClient._id);
        console.log("Test Client Cleaned Up");

        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

testClassification();

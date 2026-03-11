require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const testEmail = "newadmin@gmail.com";
const testPassword = "123456";

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aicollection");
        console.log("DB Connected");

        const user = await User.findOne({ email: testEmail });
        if (!user) {
            console.log("FAIL: User not found");
            process.exit(1);
        }

        console.log("User found:", user.email);
        console.log("Stored Hash:", user.password);
        console.log("Role:", user.role);

        const isMatch = await bcrypt.compare(testPassword, user.password);
        if (isMatch) {
            console.log("SUCCESS: Password matches!");
        } else {
            console.log("FAIL: Password mismatch!");

            // Re-hash and check
            const newHash = await bcrypt.hash(testPassword, 10);
            console.log("Correct Hash for '123456' would be:", newHash);
        }

        process.exit();
    } catch (error) {
        console.error("Test Error:", error);
        process.exit(1);
    }
};

testLogin();

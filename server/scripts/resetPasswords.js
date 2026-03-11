require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const usersToReset = [
    { email: "modipriyanshi013@gmail.com", password: "123456" },
    { email: "newadmin@gmail.com", password: "123456" }
];

const resetPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aicollection");
        console.log("DB Connected");

        for (const { email, password } of usersToReset) {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
                console.log(`Resetting password for: ${email}`);
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
                user.role = "admin";
                await user.save();
                console.log("Success.");
            } else {
                console.log(`User not found: ${email}`);
            }
        }

        process.exit();
    } catch (error) {
        console.error("Error resetting passwords:", error);
        process.exit(1);
    }
};

resetPasswords();

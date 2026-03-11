require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const emailToUpdate = "modipriyanshi013@gmail.com";
const defaultPassword = "password123"; // You should change this after logging in

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aicollection");
        console.log("DB Connected");

        let user = await User.findOne({ email: emailToUpdate });

        if (user) {
            console.log("User found, updating to admin role...");
            user.role = "admin";
            await user.save();
            console.log(`User ${emailToUpdate} updated to admin.`);
        } else {
            console.log("User not found, creating new admin account...");
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            user = await User.create({
                name: "Priyanshi Modi",
                email: emailToUpdate,
                password: hashedPassword,
                role: "admin"
            });
            console.log(`Admin created: ${emailToUpdate} / ${defaultPassword}`);
        }

        process.exit();
    } catch (error) {
        console.error("Error updating user:", error);
        process.exit(1);
    }
};

updateAdmin();

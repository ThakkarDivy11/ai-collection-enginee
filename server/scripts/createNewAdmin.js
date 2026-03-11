require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const newAdminEmail = "newadmin@gmail.com";
const newAdminPassword = "password123";

const createNewAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aicollection");
        console.log("DB Connected");

        const adminExists = await User.findOne({ email: newAdminEmail });
        if (adminExists) {
            console.log(`Admin ${newAdminEmail} already exists. Updating password...`);
            const hashedPassword = await bcrypt.hash(newAdminPassword, 10);
            adminExists.password = hashedPassword;
            adminExists.role = "admin";
            await adminExists.save();
            console.log("Password updated.");
        } else {
            console.log(`Creating new admin: ${newAdminEmail}`);
            const hashedPassword = await bcrypt.hash(newAdminPassword, 10);
            await User.create({
                name: "New Admin",
                email: newAdminEmail,
                password: hashedPassword,
                role: "admin"
            });
            console.log("Admin created successfully.");
        }

        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createNewAdmin();

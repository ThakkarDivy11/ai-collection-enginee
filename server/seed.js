require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aicollection");
        console.log("DB Connected for seeding");

        const adminExists = await User.findOne({ role: "admin" });
        if (adminExists) {
            console.log("Admin already exists:", adminExists.email);
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("123456", 10);
        await User.create({
            name: "Main Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created: admin@gmail.com / 123456");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();

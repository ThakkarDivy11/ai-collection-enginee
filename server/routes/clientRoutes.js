const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Client = require("../models/Client");
const { protect, admin } = require("../middleware/authMiddleware");

/* =========================
   CREATE CLIENT
========================= */
router.post("/", protect, admin, async (req, res) => {
    try {
        const { name, email, company, password } = req.body;

        const existing = await Client.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newClient = new Client({
            name,
            email,
            company,
            password: hashedPassword,
            createdBy: req.user._id,
        });

        await newClient.save();
        res.json(newClient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* =========================
   GET ALL CLIENTS
========================= */
router.get("/", protect, admin, async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const clients = await Client.find(query)
            .select("-password")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Client.countDocuments(query);

        res.json({
            clients,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* =========================
   UPDATE CLIENT
========================= */
router.put("/:id", protect, admin, async (req, res) => {
    try {
        await Client.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* =========================
   DELETE CLIENT
========================= */
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* =========================
   CUSTOMER LOGIN
========================= */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });
    if (!client) {
        return res.status(400).json({ message: "Client not found" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
    }

    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: client._id, role: "client" }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.json({
        message: "Login successful",
        token,
        client: {
            id: client._id,
            name: client.name,
            email: client.email,
            company: client.company,
        },
    });
});

module.exports = router;
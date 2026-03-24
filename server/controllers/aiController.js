const { OpenAI } = require("openai");
const nodemailer = require("nodemailer");
const Client = require("../models/Client");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "ollama",
    baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
});

exports.sendAiEmail = async (req, res) => {
    try {
        const { recipientEmail, subject, content } = req.body;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // use SSL
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"${process.env.SENDER_NAME}" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: subject,
            text: content,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.generateInsights = async (req, res) => {
    try {
        const clients = await Client.find();
        const payments = await Payment.find();

        const dataSummary = {
            totalClients: clients.length,
            activeClients: clients.filter(c => c.status === "active").length,
            churnRisk: clients.filter(c => c.status === "churn-risk").length,
            recentPayments: payments.slice(0, 5).map(p => ({ amount: p.amount, status: p.status })),
        };

        const prompt = `As an AI business consultant, analyze this client data and provide 3 key insights for the admin:
        Data: ${JSON.stringify(dataSummary)}
        Return ONLY a valid JSON array of 3 strings. No markdown, no explanation. Example: ["insight 1", "insight 2", "insight 3"]`;

        console.log("Calling Ollama with model:", process.env.AI_MODEL);
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "llama3",
            messages: [{ role: "user", content: prompt }],
        });

        const content = response.choices[0].message.content;
        console.log("AI Response:", content);

        // Try to extract JSON array from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const insights = JSON.parse(jsonMatch[0]);
            return res.json(insights);
        }

        // Fallback: split by newlines and return as array
        const lines = content.split("\n").filter(l => l.trim().length > 0);
        res.json(lines.slice(0, 3));
    } catch (error) {
        console.error("Insights error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.generateEmail = async (req, res) => {
    try {
        const { type, clientName, companyName, extraInfo } = req.body;

        const prompt = `Write a professional ${type} email for a client.
        Client Name: ${clientName}
        Company: ${companyName}
        Additional Context: ${extraInfo}
        Keep it concise and professional.`;

        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "llama3",
            messages: [{ role: "user", content: prompt }],
        });

        res.json({ content: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.smartSearch = async (req, res) => {
    try {
        const { query } = req.body;
        const prompt = `Convert this natural language search query into a JSON MongoDB filter object for a Client schema (fields: name, email, company, status).
        Query: "${query}"
        
        Rules:
        - Return ONLY a valid JSON filter object. No markdown, no explanation.
        - If the query asks to list all or count all clients, return an empty object: {}
        - Only use valid MongoDB query operators inside field values (e.g. $regex, $in, $gte).
        - Do NOT use top-level operators like $exists, $match, or $count.
        - For text searches, use $regex with $options "i" for case-insensitive matching.
        Examples:
        - "active clients" => {"status": "active"}
        - "how many clients" => {}
        - "show all clients" => {}
        - "clients named John" => {"name": {"$regex": "John", "$options": "i"}}`;

        console.log("Smart search query:", query);
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "llama3",
            messages: [{ role: "user", content: prompt }],
        });

        const content = response.choices[0].message.content;
        console.log("Smart search AI response:", content);

        // Try to extract JSON object from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        let filter = {};
        if (jsonMatch) {
            filter = JSON.parse(jsonMatch[0]);
        }

        // Sanitize: remove any invalid top-level operators that are not valid MongoDB query operators
        const validTopLevelOps = ["$or", "$and", "$nor", "$not", "$where", "$text", "$comment"];
        const sanitizedFilter = {};
        for (const key of Object.keys(filter)) {
            if (key.startsWith("$") && !validTopLevelOps.includes(key)) {
                console.warn(`Removed invalid top-level operator: ${key}`);
                continue;
            }
            sanitizedFilter[key] = filter[key];
        }
        filter = sanitizedFilter;

        const results = await Client.find(filter).select("-password");
        res.json(results);
    } catch (error) {
        console.error("Smart search error:", error.message);
        // Fallback: do a simple text search or return all clients
        try {
            const { query } = req.body;
            // Check if it's a generic "show all" / "how many" type query
            const genericPatterns = /^(how many|count|total|show all|list all|all clients|every client)/i;
            if (genericPatterns.test(query.trim())) {
                const results = await Client.find({}).select("-password");
                return res.json(results);
            }
            const results = await Client.find({
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { company: { $regex: query, $options: "i" } },
                    { email: { $regex: query, $options: "i" } },
                ]
            }).select("-password");
            res.json(results);
        } catch (fallbackError) {
            res.status(500).json({ message: fallbackError.message });
        }
    }
};

exports.getAiAnalytics = async (req, res) => {
    try {
        const clients = await Client.find();
        const invoices = await Invoice.find().populate("clientId", "name company");
        const payments = await Payment.find();

        const totalClients = clients.length;
        const activeClients = clients.filter(c => c.status === "active").length;
        const inactiveClients = clients.filter(c => c.status === "inactive").length;
        const churnRisk = clients.filter(c => c.status === "churn-risk").length;

        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter(i => i.status === "paid").length;
        const unpaidInvoices = invoices.filter(i => i.status === "unpaid").length;
        const overdueInvoices = invoices.filter(i => i.status === "overdue").length;

        const totalRevenue = payments
            .filter(p => p.status === "completed")
            .reduce((acc, p) => acc + p.amount, 0);

        const totalInvoiceValue = invoices.reduce((acc, i) => acc + i.amount, 0);
        const paidValue = invoices.filter(i => i.status === "paid").reduce((acc, i) => acc + i.amount, 0);
        const overdueValue = invoices.filter(i => i.status === "overdue").reduce((acc, i) => acc + i.amount, 0);
        const unpaidValue = invoices.filter(i => i.status === "unpaid").reduce((acc, i) => acc + i.amount, 0);

        const collectionRate = totalInvoiceValue > 0 ? Math.round((paidValue / totalInvoiceValue) * 100) : 0;

        // Monthly revenue (last 6 months)
        const monthlyRevenue = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const monthName = monthStart.toLocaleString("default", { month: "short" });

            const monthPaid = payments
                .filter(p => p.status === "completed" && new Date(p.createdAt) >= monthStart && new Date(p.createdAt) <= monthEnd)
                .reduce((acc, p) => acc + p.amount, 0);

            const monthInvoices = invoices.filter(i => new Date(i.createdAt) >= monthStart && new Date(i.createdAt) <= monthEnd).length;

            monthlyRevenue.push({ name: monthName, revenue: monthPaid, invoices: monthInvoices });
        }

        // Recent invoices
        const recentInvoices = invoices
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(i => ({
                invoiceNumber: i.invoiceNumber,
                client: i.clientId?.name || "Unknown",
                amount: i.amount,
                status: i.status,
                date: i.createdAt
            }));

        res.json({
            totalClients,
            activeClients,
            inactiveClients,
            churnRisk,
            totalRevenue,
            totalInvoices,
            paidInvoices,
            unpaidInvoices,
            overdueInvoices,
            overdueValue,
            unpaidValue,
            collectionRate,
            monthlyRevenue,
            recentInvoices
        });
    } catch (error) {
        console.error("Analytics error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.generateChurnPrediction = async (req, res) => {
    try {
        const clients = await Client.find().select("-password");
        const invoices = await Invoice.find();

        const clientData = clients.map(c => {
            const clientInvoices = invoices.filter(i => String(i.clientId) === String(c._id));
            const unpaid = clientInvoices.filter(i => i.status === "unpaid" || i.status === "overdue").length;
            const total = clientInvoices.length;
            return {
                name: c.name,
                company: c.company,
                status: c.status,
                totalInvoices: total,
                unpaidInvoices: unpaid,
                overdueInvoices: clientInvoices.filter(i => i.status === "overdue").length
            };
        });

        const prompt = `You are an AI business analyst. Analyze these clients and identify which ones are at HIGH churn risk.
        Client Data: ${JSON.stringify(clientData)}
        
        Return ONLY a valid JSON array of objects with fields: name, company, riskLevel (high/medium/low), reason.
        No markdown, no explanation. Example: [{"name":"John","company":"Acme","riskLevel":"high","reason":"3 overdue invoices"}]`;

        console.log("Generating churn prediction...");
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "llama3",
            messages: [{ role: "user", content: prompt }],
        });

        const content = response.choices[0].message.content;
        console.log("Churn prediction response:", content);

        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const predictions = JSON.parse(jsonMatch[0]);
            return res.json(predictions);
        }

        // Fallback
        res.json(clientData.map(c => ({
            name: c.name,
            company: c.company,
            riskLevel: c.unpaidInvoices > 0 ? "high" : "low",
            reason: c.unpaidInvoices > 0 ? `${c.unpaidInvoices} unpaid invoices` : "All invoices paid"
        })));
    } catch (error) {
        console.error("Churn prediction error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getDetailedRiskAnalysis = async (invoiceData, suggestedTone) => {
    try {
        const prompt = `As an AI business analyst, perform a deep analysis of this unpaid invoice:
        Invoice Data: ${JSON.stringify(invoiceData)}
        Requested Message Tone: ${suggestedTone}
        
        Tasks:
        1. Predict exactly how many ADDITIONAL days this payment might be delayed (Regression).
        2. Classify the customer risk as "High", "Medium", or "Low" (Classification).
        3. Draft a professional email message in the requested tone (Polite, Firm, or Legal) (Generation).
        
        Return ONLY a valid JSON object with these fields:
        {
            "predictedDelayDays": number,
            "riskLevel": "High" | "Medium" | "Low",
            "riskReason": "string describing why",
            "generatedMessage": "string containing the full email body"
        }
        Do not include markdown or explanations.`;

        console.log(`Generating detailed risk analysis for invoice ${invoiceData.invoiceNumber}...`);
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "llama3",
            messages: [{ role: "user", content: prompt }],
        });

        const content = response.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                // Remove control characters except for newline, carriage return, and tab
                const cleanedJson = jsonMatch[0].replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "");
                return JSON.parse(cleanedJson);
            } catch (e) {
                console.error("JSON Parse failed for content:", jsonMatch[0]);
                throw e;
            }
        }

        // Fallback
        return {
            predictedDelayDays: invoiceData.daysOverdue + 7,
            riskLevel: invoiceData.daysOverdue > 30 ? "High" : "Medium",
            riskReason: "AI generation failed. Fallback based on aging.",
            generatedMessage: `Hello, this is a reminder regarding your invoice ${invoiceData.invoiceNumber}. Please process payment.`
        };
    } catch (error) {
        console.error("Detailed Risk Analysis error:", error.message);
        return {
            predictedDelayDays: 0,
            riskLevel: "Medium",
            riskReason: "Error contacting AI service.",
            generatedMessage: "Friendly reminder to check your outstanding balance."
        };
    }
};

exports.getRiskScore = async (invoiceData) => {
    try {
        const prompt = `Assistant, analyze this unpaid invoice and provide a collection risk score (0-100) and a brief reason.
        Invoice Data: ${JSON.stringify(invoiceData)}
        
        Rules:
        - Risk Score: 0 is lowest (likely to pay), 100 is highest (likely to bad debt).
        - Return ONLY a valid JSON object with fields: riskScore (number), reason (string).
        - No markdown, no explanation. Example: {"riskScore": 45, "reason": "Invoice is 15 days overdue with no payment history."}`;

        console.log(`Generating risk score for invoice ${invoiceData.invoiceNumber}...`);
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "llama3",
            messages: [{ role: "user", content: prompt }],
        });

        const content = response.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        // Fallback
        return {
            riskScore: invoiceData.daysOverdue > 30 ? 80 : 40,
            reason: "AI generation failed. Fallback based on aging."
        };
    } catch (error) {
        console.error("AI Risk Score error:", error.message);
        return { riskScore: 50, reason: "Error contacting AI service." };
    }
};

exports.classifyClientStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        // Calculate last active days
        const lastActiveDate = client.lastActive || client.updatedAt || new Date();
        const diffTime = Math.abs(new Date() - new Date(lastActiveDate));
        const lastActiveDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Check for pending payments
        const pendingInvoices = await Invoice.find({
            clientId: id,
            status: { $in: ["unpaid", "overdue"] }
        });
        const paymentStatus = pendingInvoices.length > 0 ? "Pending" : "Paid";

        // Usage Level
        const usageLevel = client.usageLevel || "medium";

        const prompt = `Analyze the user data and classify the user into one of these:
- ACTIVE
- CHURN_RISK

Rules:
- If user inactive > 7 days → CHURN_RISK
- If payment pending → CHURN_RISK
- If usage low → CHURN_RISK

Return ONLY one word: ACTIVE or CHURN_RISK

User Data:
Last Active: ${lastActiveDays} days ago
Payment Status: ${paymentStatus}
Usage Level: ${usageLevel}`;

        console.log(`Classifying status for client ${client.name}...`);
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "llama3",
            messages: [{ role: "user", content: prompt }],
        });

        const result = response.choices[0].message.content.trim().toUpperCase();
        
        // Sanitize response to ensure it's exactly one of the words
        const finalStatus = result.includes("CHURN_RISK") ? "CHURN_RISK" : "ACTIVE";

        res.json({ clientName: client.name, classification: finalStatus, lastActiveDays, paymentStatus, usageLevel });
    } catch (error) {
        console.error("Client classification error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

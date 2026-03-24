const mongoose = require("mongoose");
const Client = require("./models/Client");
const Invoice = require("./models/Invoice");
require("dotenv").config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aicollection");
        console.log("DB Connected");

        const clients = await Client.find().limit(5);
        console.log("Clients:", clients.map(c => ({ name: c.name, status: c.status })));

        for (const client of clients) {
            const invoices = await Invoice.find({ clientId: client._id });
            console.log(`Invoices for ${client.name}:`, invoices.map(i => ({ number: i.invoiceNumber, status: i.status, dueDate: i.dueDate })));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();

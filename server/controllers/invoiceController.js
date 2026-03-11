const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const sendEmail = require("../utils/emailService");

exports.createInvoice = async (req, res) => {
    try {
        const { clientId, amount, dueDate, invoiceNumber } = req.body;

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        const newInvoice = await Invoice.create({
            clientId,
            amount,
            dueDate,
            invoiceNumber,
        });

        // Send Invoice Email
        try {
            await sendEmail({
                to: client.email,
                subject: `New Invoice ${invoiceNumber} from CollectAI`,
                text: `Hello ${client.name},\n\nA new invoice has been generated for your company ${client.company}.\nAmount: $${amount}\nDue Date: ${new Date(dueDate).toLocaleDateString()}\n\nPlease login to the portal to make payment.`,
                html: `<h3>Hello ${client.name},</h3><p>A new invoice has been generated for your company <b>${client.company}</b>.</p><p>Amount: <b>$${amount}</b><br>Due Date: <b>${new Date(dueDate).toLocaleDateString()}</b></p><p>Please login to the portal to make payment.</p>`,
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("clientId", "name company email");
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClientInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ clientId: req.user._id });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.downloadInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("clientId");
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const PDFDocument = require("pdfkit");
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Invoice_${invoice.invoiceNumber}.pdf`);

        doc.pipe(res);

        // Header
        doc.fillColor("#444444").fontSize(20).text("CollectAI", 50, 57);
        doc.fontSize(10).text("Admin Systems • Secure Billing", 200, 65, { align: "right" });
        doc.moveDown();

        // Line
        doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 90).lineTo(550, 90).stroke();

        // Invoice Info
        doc.fillColor("#444444").fontSize(20).text("INVOICE", 50, 110);
        doc.fontSize(10).text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 140);
        doc.text(`Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 155);
        doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 50, 170);

        // Billing Details
        doc.fontSize(10).text("BILL TO:", 350, 140, { font: "Helvetica-Bold" });
        doc.text(invoice.clientId.name, 350, 155);
        doc.text(invoice.clientId.company, 350, 170);
        doc.text(invoice.clientId.email, 350, 185);

        // Table Header
        const tableTop = 230;
        doc.fillColor("#444444").fontSize(10);
        doc.text("Description", 50, tableTop, { font: "Helvetica-Bold" });
        doc.text("Amount", 450, tableTop, { align: "right", font: "Helvetica-Bold" });

        doc.strokeColor("#eeeeee").lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Table Content
        const itemTop = tableTop + 30;
        doc.text("Enterprise Suite Subscription", 50, itemTop);
        doc.text(`INR ${invoice.amount.toLocaleString()}`, 450, itemTop, { align: "right" });

        // Total
        const totalTop = itemTop + 50;
        doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(350, totalTop).lineTo(550, totalTop).stroke();
        doc.fontSize(12).text("TOTAL:", 350, totalTop + 15, { font: "Helvetica-Bold" });
        doc.text(`INR ${invoice.amount.toLocaleString()}`, 450, totalTop + 15, { align: "right", font: "Helvetica-Bold" });

        // Footer
        doc.fontSize(10).fillColor("#aaaaaa").text("Thank you for your business!", 50, 700, { align: "center", width: 500 });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

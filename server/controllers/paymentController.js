const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;
const Payment = require("../models/Payment");
const Client = require("../models/Client");

exports.createCheckoutSession = async (req, res) => {
    try {
        const { clientId, amount, invoiceId } = req.body;

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        if (!stripe) {
            return res.status(500).json({ message: "Stripe is not configured" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: invoiceId ? `Invoice Payment: ${invoiceId}` : `Payment for ${client.company}`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/customer-dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/customer-dashboard?status=cancel`,
            metadata: {
                clientId: clientId.toString(),
                invoiceId: invoiceId ? invoiceId.toString() : "",
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { clientId, invoiceId } = session.metadata;
        const amount = session.amount_total / 100;

        await Payment.create({
            clientId,
            amount,
            status: "completed",
            stripeId: session.id,
        });

        if (invoiceId) {
            const Invoice = require("../models/Invoice");
            await Invoice.findByIdAndUpdate(invoiceId, { status: "paid" });
        }
    }

    res.json({ received: true });
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate("clientId", "name company email").sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyPaymentSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!stripe) {
            return res.status(500).json({ message: "Stripe is not configured" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const { clientId, invoiceId } = session.metadata;
            const amount = session.amount_total / 100;

            // Check if payment already exists (prevent duplicates if webhook also works)
            const existingPayment = await Payment.findOne({ stripeId: session.id });
            if (!existingPayment) {
                await Payment.create({
                    clientId,
                    amount,
                    status: "completed",
                    stripeId: session.id,
                });

                if (invoiceId) {
                    const Invoice = require("../models/Invoice");
                    await Invoice.findByIdAndUpdate(invoiceId, { status: "paid" });
                }
            }
            return res.json({ success: true, status: "paid" });
        }

        res.json({ success: false, status: session.payment_status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

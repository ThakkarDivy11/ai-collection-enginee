const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");

exports.getDashboardStats = async (req, res) => {
    try {
        const totalClients = await Client.countDocuments();
        const churnRiskCount = await Client.countDocuments({ status: "churn-risk" });

        // Active Revenue: Sum of all completed payments
        const payments = await Payment.find({ status: "completed" });
        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        // Total Outstanding: Sum of all unpaid and overdue invoices
        const outstandingInvoices = await Invoice.find({ status: { $in: ["unpaid", "overdue"] } });
        const totalOutstanding = outstandingInvoices.reduce((acc, curr) => acc + curr.amount, 0);

        // Specifically Overdue
        const overdueAmount = outstandingInvoices
            .filter(i => i.status === "overdue")
            .reduce((acc, curr) => acc + curr.amount, 0);

        // Recent Clients
        const recentClients = await Client.find()
            .select("name company status createdAt")
            .sort({ createdAt: -1 })
            .limit(5);

        // Transformation for frontend display
        const transformedRecentClients = recentClients.map(client => ({
            name: client.name,
            company: client.company,
            status: client.status.charAt(0).toUpperCase() + client.status.slice(1),
            revenue: "₹0", // Placeholder until we link specific revenue per client
            date: formatRelativeDate(client.createdAt)
        }));

        // Chart Data: Last 7 months
        const chartData = [];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = months[d.getMonth()];
            const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

            // Revenue for this month
            const monthPayments = await Payment.find({
                status: "completed",
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            });
            const monthRevenue = monthPayments.reduce((acc, curr) => acc + curr.amount, 0);

            // Clients for this month
            const monthClients = await Client.countDocuments({
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            });

            chartData.push({
                name: monthName,
                revenue: monthRevenue,
                clients: monthClients
            });
        }

        res.json({
            totalClients,
            totalRevenue,
            totalOutstanding,
            overdueAmount,
            churnRiskCount,
            recentClients: transformedRecentClients,
            chartData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function formatRelativeDate(date) {
    const diff = new Date() - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 60) return `${mins} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

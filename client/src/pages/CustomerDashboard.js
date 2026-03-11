import React, { useState, useEffect, useCallback } from "react";
import {
    CreditCard,
    Download,
    Search,
    Loader2,
    Calendar,
    IndianRupee,
    CheckCircle2,
    Clock,
    AlertCircle,
    LogOut,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerDashboard() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const user = JSON.parse(localStorage.getItem("customer"));

    const fetchInvoices = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/invoices/my-invoices", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setInvoices(data || []);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!user) {
            window.location.href = "/";
            return;
        }
        fetchInvoices();
    }, [fetchInvoices]);

    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const verifyPayment = async (sessionId) => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:5000/api/payments/verify-session/${sessionId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    fetchInvoices();
                }
            } catch (error) {
                console.error("Failed to verify payment", error);
            }
        };

        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        const sessionId = params.get("session_id");

        if (status === "success") {
            setAlert({ type: "success", message: "Payment completed successfully! Your invoices have been updated." });
            if (sessionId) {
                verifyPayment(sessionId);
            } else {
                fetchInvoices();
            }
        } else if (status === "cancel") {
            setAlert({ type: "error", message: "Payment was cancelled. You can try again whenever you're ready." });
        }

        // Clear status from URL
        if (status) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [fetchInvoices]);

    const handlePay = async (invoice) => {
        setProcessingId(invoice._id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/payments/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    clientId: user.id,
                    amount: invoice.amount,
                    invoiceId: invoice._id
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Payment failed", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDownload = async (invoice) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/invoices/download/${invoice._id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Invoice_${invoice.invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("customer");
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const unpaidCount = invoices.filter(i => i.status === "unpaid" || i.status === "overdue").length;
    const totalDue = invoices.filter(i => i.status === "unpaid" || i.status === "overdue").reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl text-white">
                            <CreditCard size={24} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Client Portal</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-white">{user?.name}</div>
                            <div className="text-xs text-slate-500">{user?.company}</div>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
                {alert && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 border ${alert.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                            }`}
                    >
                        {alert.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <p className="font-medium text-sm">{alert.message}</p>
                        <button onClick={() => setAlert(null)} className="ml-auto text-current opacity-50 hover:opacity-100">&times;</button>
                    </motion.div>
                )}
                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-3xl"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl">
                                <IndianRupee size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Outstanding</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">₹{totalDue.toLocaleString()}</div>
                        <div className="text-sm text-slate-500">{unpaidCount} Pending Invoices</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-3xl"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl">
                                <CheckCircle2 size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payments Made</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {invoices.filter(i => i.status === "paid").length}
                        </div>
                        <div className="text-sm text-slate-500">Completed Transactions</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-900/20 text-white relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                            <p className="text-blue-100/80 text-sm mb-4">Contact our billing support team for any queries regarding your invoices.</p>
                            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                                Contact Support <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                            <AlertCircle size={120} />
                        </div>
                    </motion.div>
                </div>

                {/* Invoices Table */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Your Billing History</h2>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3">
                            <Search size={18} className="text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder:text-slate-600 w-40 sm:w-60"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-800">
                                        <th className="px-8 py-5">Invoice Details</th>
                                        <th className="px-8 py-5">Amount</th>
                                        <th className="px-8 py-5">Due Date</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="py-20 text-center">
                                                <Loader2 className="mx-auto animate-spin text-blue-500" size={32} />
                                            </td>
                                        </tr>
                                    ) : invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-20 text-center text-slate-500 font-medium">No invoices assigned to your account.</td>
                                        </tr>
                                    ) : invoices.map((invoice, idx) => (
                                        <motion.tr
                                            key={invoice._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-slate-800/30 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2.5 rounded-xl ${invoice.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                                                        }`}>
                                                        <Calendar size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{invoice.invoiceNumber}</div>
                                                        <div className="text-xs text-slate-500 font-medium">Enterprise Suite Subscription</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-lg font-bold text-white tracking-tight">₹{invoice.amount.toLocaleString()}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-slate-400 font-medium">
                                                    <Clock size={14} />
                                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${invoice.status === "paid" ? "bg-emerald-500/10 text-emerald-400" :
                                                    invoice.status === "overdue" ? "bg-rose-500/10 text-rose-400" : "bg-blue-500/10 text-blue-400"
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${invoice.status === "paid" ? "bg-emerald-400" :
                                                        invoice.status === "overdue" ? "bg-rose-400" : "bg-blue-400"
                                                        }`} />
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    {invoice.status !== "paid" ? (
                                                        <button
                                                            disabled={processingId === invoice._id}
                                                            onClick={() => handlePay(invoice)}
                                                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2"
                                                        >
                                                            {processingId === invoice._id ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                                                            Pay Now
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDownload(invoice)}
                                                            className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                                                            title="Download Invoice"
                                                        >
                                                            <Download size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-sm py-4">
                    <p>© 2026 Admin Systems • Secure Billing Portal</p>
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                        <a href="#" className="hover:text-blue-400 transition-colors font-medium">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors font-medium">Terms of Service</a>
                        <a href="#" className="hover:text-blue-400 transition-colors font-medium">FAQ</a>
                    </div>
                </div>
            </main>
        </div>
    );
}
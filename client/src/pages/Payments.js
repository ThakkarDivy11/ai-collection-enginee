import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, Download, Search, Plus, X, Loader2, Calendar, IndianRupee, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Payments() {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        clientId: "",
        amount: "",
        dueDate: "",
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const [invRes, cliRes] = await Promise.all([
                fetch("http://localhost:5000/api/invoices", {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch("http://localhost:5000/api/clients", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            const invData = await invRes.json();
            const cliData = await cliRes.json();

            setInvoices(invData || []);
            setClients(cliData.clients || cliData || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                setFormData({
                    clientId: "",
                    amount: "",
                    dueDate: "",
                    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
                });
                fetchData();
            }
        } catch (error) {
            console.error("Failed to create invoice", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center text-slate-200">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-white">Payments & Invoices</h1>
                    <p className="text-slate-400">Track transactions and issue new billing requests.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40"
                >
                    <Plus size={20} />
                    Create Invoice
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <Search className="text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Search invoices..."
                    className="bg-transparent border-none text-white focus:ring-0 flex-1 px-0 placeholder:text-slate-600"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <Loader2 className="mx-auto animate-spin text-blue-500" size={32} />
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-slate-500">No invoices found.</td>
                                </tr>
                            ) : invoices.map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-white font-mono text-sm">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">{invoice.clientId?.name || "Deleted Client"}</div>
                                        <div className="text-slate-500 text-xs">{invoice.clientId?.company}</div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-bold">₹{invoice.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-400">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.status === "paid" ? "bg-emerald-500/10 text-emerald-400" :
                                            invoice.status === "overdue" ? "bg-rose-500/10 text-rose-400" : "bg-blue-500/10 text-blue-400"
                                            }`}>
                                            {invoice.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-500 hover:text-white transition-all"><Download size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 relative z-50 text-slate-200"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <Plus className="text-blue-500" />
                                    New Invoice
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-400 block mb-2">Select Client</label>
                                    <select
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.clientId}
                                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                    >
                                        <option value="">Choose a client...</option>
                                        {clients.map(c => (
                                            <option key={c._id} value={c._id}>{c.name} ({c.company})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-slate-400 block mb-2">Invoice Number</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-3.5 text-slate-500" size={18} />
                                        <input
                                            required
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.invoiceNumber}
                                            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">Amount (₹)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-3.5 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="number"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">Due Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3.5 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="date"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.dueDate}
                                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 mt-4 flex justify-center items-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : "Generate & Send Invoice"}
                                </button>
                                <p className="text-center text-xs text-slate-500">Client will receive an automatic email notification.</p>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
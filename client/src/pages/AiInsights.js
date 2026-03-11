import React, { useState, useEffect } from "react";
import {
    BrainCircuit, Sparkles, Send, Search, Loader2, User, Building2,
    CheckCircle2, Activity, Users, IndianRupee, AlertTriangle,
    TrendingUp, FileText, Clock, ShieldAlert, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444"];

const StatCard = ({ title, value, icon: Icon, color, subtitle, loading }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all"
    >
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2.5 rounded-xl ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <ArrowUpRight size={16} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
        </div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        {loading ? (
            <div className="h-7 w-20 bg-slate-800 animate-pulse rounded-lg" />
        ) : (
            <>
                <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
            </>
        )}
    </motion.div>
);

export default function AiInsights() {
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);

    const [insightLoading, setInsightLoading] = useState(false);
    const [insights, setInsights] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const [churnPredictions, setChurnPredictions] = useState([]);
    const [churnLoading, setChurnLoading] = useState(false);

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");

    const [emailLoading, setEmailLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailType, setEmailType] = useState("Payment Reminder");
    const [clientName, setClientName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [emailContext, setEmailContext] = useState("");
    const [generatedEmail, setGeneratedEmail] = useState("");

    const [notification, setNotification] = useState(null);

    const token = localStorage.getItem("token");

    // Fetch analytics on mount
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/ai/analytics", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setAnalytics(data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setAnalyticsLoading(false);
            }
        };
        fetchAnalytics();
    }, [token]);

    // Fetch clients on mount
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/clients?limit=100", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setClients(data.clients || []);
            } catch (error) {
                console.error("Failed to fetch clients", error);
            }
        };
        fetchClients();
    }, [token]);

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        setSelectedClient(clientId);
        const client = clients.find(c => c._id === clientId);
        if (client) {
            setClientName(client.name);
            setCompanyName(client.company);
            setClientEmail(client.email);
        } else {
            setClientName("");
            setCompanyName("");
            setClientEmail("");
        }
    };

    const fetchInsights = async () => {
        setInsightLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/ai/insights", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setInsights(data);
        } catch (error) {
            console.error("Failed to fetch insights", error);
        } finally {
            setInsightLoading(false);
        }
    };

    const fetchChurnPrediction = async () => {
        setChurnLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/ai/churn-prediction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) setChurnPredictions(data);
        } catch (error) {
            console.error("Churn prediction failed", error);
        } finally {
            setChurnLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearchLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/ai/smart-search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ query: searchQuery })
            });
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleGenerateEmail = async () => {
        setEmailLoading(true);
        setGeneratedEmail("");
        try {
            const res = await fetch("http://localhost:5000/api/ai/generate-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: emailType,
                    clientName,
                    companyName,
                    extraInfo: emailContext
                })
            });
            const data = await res.json();
            setGeneratedEmail(data.content);
        } catch (error) {
            console.error("Email generation failed", error);
        } finally {
            setEmailLoading(false);
        }
    };

    const handleSendEmail = async () => {
        if (!clientEmail || !generatedEmail) return;
        setSendingEmail(true);
        try {
            const res = await fetch("http://localhost:5000/api/ai/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipientEmail: clientEmail,
                    subject: `${emailType} - ${companyName}`,
                    content: generatedEmail
                })
            });
            const data = await res.json();
            if (res.ok) {
                setNotification({ type: "success", message: "Email sent successfully to " + clientEmail });
            } else {
                setNotification({ type: "error", message: data.message || "Failed to send email" });
            }
        } catch (error) {
            setNotification({ type: "error", message: "Error sending email" });
        } finally {
            setSendingEmail(false);
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const clientHealthData = analytics ? [
        { name: "Active", value: analytics.activeClients, color: "#10b981" },
        { name: "Inactive", value: analytics.inactiveClients, color: "#6366f1" },
        { name: "Churn Risk", value: analytics.churnRisk, color: "#ef4444" },
    ].filter(d => d.value > 0) : [];

    const riskColor = (level) => {
        if (level === "high") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
        if (level === "medium") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    };

    return (
        <div className="space-y-8">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${notification.type === "success"
                            ? "bg-emerald-500/90 border-emerald-400 text-white"
                            : "bg-rose-500/90 border-rose-400 text-white"
                            }`}
                    >
                        {notification.type === "success" ? <CheckCircle2 size={20} /> : <Activity size={20} />}
                        <p className="font-bold text-sm tracking-tight">{notification.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <BrainCircuit className="text-purple-400" />
                    AI Insights & Analytics
                </h1>
                <p className="text-slate-400">Real-time analytics powered by AI to grow your business.</p>
            </div>

            {/* ===== ANALYTICS SUMMARY CARDS ===== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Clients"
                    value={analytics?.totalClients || 0}
                    icon={Users}
                    color="bg-blue-600"
                    subtitle={`${analytics?.activeClients || 0} active`}
                    loading={analyticsLoading}
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${(analytics?.totalRevenue || 0).toLocaleString()}`}
                    icon={IndianRupee}
                    color="bg-emerald-600"
                    subtitle={`${analytics?.paidInvoices || 0} invoices paid`}
                    loading={analyticsLoading}
                />
                <StatCard
                    title="Collection Rate"
                    value={`${analytics?.collectionRate || 0}%`}
                    icon={TrendingUp}
                    color="bg-purple-600"
                    subtitle={`${analytics?.totalInvoices || 0} total invoices`}
                    loading={analyticsLoading}
                />
                <StatCard
                    title="Overdue"
                    value={`₹${(analytics?.overdueValue || 0).toLocaleString()}`}
                    icon={AlertTriangle}
                    color="bg-rose-600"
                    subtitle={`${analytics?.overdueInvoices || 0} overdue invoices`}
                    loading={analyticsLoading}
                />
                <StatCard
                    title="Pending"
                    value={`₹${(analytics?.unpaidValue || 0).toLocaleString()}`}
                    icon={Clock}
                    color="bg-amber-600"
                    subtitle={`${analytics?.unpaidInvoices || 0} unpaid invoices`}
                    loading={analyticsLoading}
                />
            </div>

            {/* ===== CHARTS ROW ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl"
                >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="text-emerald-400" size={20} />
                        Revenue Trend
                        <span className="text-xs text-slate-500 font-normal ml-auto">Last 6 months</span>
                    </h3>
                    <div className="h-64">
                        {analyticsLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="animate-spin text-slate-600" size={32} />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.monthlyRevenue || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                    <YAxis stroke="#64748b" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }}
                                        formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Client Health Donut */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl"
                >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="text-blue-400" size={20} />
                        Client Health
                    </h3>
                    <div className="h-48 flex items-center justify-center">
                        {analyticsLoading ? (
                            <Loader2 className="animate-spin text-slate-600" size={32} />
                        ) : clientHealthData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={clientHealthData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {clientHealthData.map((entry, idx) => (
                                            <Cell key={idx} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-slate-500 text-sm">No client data</p>
                        )}
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                        {clientHealthData.map((d, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                {d.name} ({d.value})
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ===== AI CHURN PREDICTION ===== */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="text-rose-400" size={20} />
                        AI Churn Risk Prediction
                    </h3>
                    <button
                        onClick={fetchChurnPrediction}
                        disabled={churnLoading}
                        className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-rose-900/20"
                    >
                        {churnLoading && <Loader2 className="animate-spin" size={16} />}
                        Analyze Clients
                    </button>
                </div>
                {churnPredictions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {churnPredictions.map((pred, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`p-4 rounded-xl border ${riskColor(pred.riskLevel)}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-sm">{pred.name}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pred.riskLevel === "high" ? "bg-rose-500/20" : pred.riskLevel === "medium" ? "bg-amber-500/20" : "bg-emerald-500/20"}`}>
                                        {pred.riskLevel}
                                    </span>
                                </div>
                                <p className="text-xs opacity-80">{pred.company}</p>
                                <p className="text-xs opacity-60 mt-1 italic">{pred.reason}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm italic text-center py-4">
                        Click "Analyze Clients" to run AI-powered churn risk analysis on your client portfolio.
                    </p>
                )}
            </motion.div>

            {/* ===== RECENT INVOICES ===== */}
            {analytics?.recentInvoices?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="text-indigo-400" size={20} />
                        Recent Invoices
                    </h3>
                    <div className="space-y-3">
                        {analytics.recentInvoices.map((inv, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800 hover:bg-slate-800/60 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${inv.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : inv.status === "overdue" ? "bg-rose-500/10 text-rose-400" : "bg-blue-500/10 text-blue-400"}`}>
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-bold">{inv.invoiceNumber}</p>
                                        <p className="text-slate-500 text-xs">{inv.client}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold text-sm">₹{inv.amount.toLocaleString()}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${inv.status === "paid" ? "text-emerald-400" : inv.status === "overdue" ? "text-rose-400" : "text-blue-400"}`}>
                                        {inv.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ===== EXISTING: INSIGHTS + SEARCH + EMAIL ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Smart Business Analysis */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="text-amber-400" size={20} />
                                Smart Business Analysis
                            </h3>
                            <button
                                onClick={fetchInsights}
                                disabled={insightLoading}
                                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-purple-900/20"
                            >
                                {insightLoading && <Loader2 className="animate-spin" size={16} />}
                                Generate New Insights
                            </button>
                        </div>
                        <div className="space-y-4">
                            {insights.length > 0 ? (
                                insights.map((item, id) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: id * 0.1 }}
                                        key={id}
                                        className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 backdrop-blur-sm"
                                    >
                                        {item}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-slate-500 italic text-sm p-4 text-center">
                                    Click the button above to generate business insights based on your current data.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Smart Search */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Search className="text-blue-400" size={20} />
                            AI Smart Search
                        </h3>
                        <form onSubmit={handleSearch} className="relative mb-6">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ask like: 'Show me clients who haven't paid this month'"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-6 pr-14 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                            />
                            <button
                                type="submit"
                                disabled={searchLoading}
                                className="absolute right-3 top-3 bg-blue-600 p-2 rounded-lg text-white disabled:opacity-50 shadow-lg shadow-blue-900/20"
                            >
                                {searchLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            </button>
                        </form>
                        <AnimatePresence>
                            {searchResults && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2"
                                >
                                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Search Results</h4>
                                    {searchResults.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {searchResults.map((client) => (
                                                <div key={client._id} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl transition-colors hover:bg-slate-800/50">
                                                    <div className="font-bold text-white">{client.name}</div>
                                                    <div className="text-slate-400 text-xs">{client.company} • {client.status}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 text-sm">No clients found matching that query.</div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* AI Email Generator */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Send className="text-emerald-400" size={20} />
                            AI Email Generator
                        </h3>
                        <div className="space-y-4 flex-grow">
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Target Client</label>
                                <select
                                    value={selectedClient}
                                    onChange={handleClientChange}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                                >
                                    <option value="">Select a client...</option>
                                    {clients.map(client => (
                                        <option key={client._id} value={client._id}>{client.name} ({client.company})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Email Type</label>
                                <select
                                    value={emailType}
                                    onChange={(e) => setEmailType(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                                >
                                    <option>Payment Reminder</option>
                                    <option>Welcome Email</option>
                                    <option>Contract Renewal</option>
                                    <option>Follow up</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Client Name</label>
                                    <div className="relative">
                                        <User size={14} className="absolute left-3 top-3.5 text-slate-500" />
                                        <input
                                            type="text"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-9 pr-3 text-white outline-none focus:border-emerald-500/50 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Company</label>
                                    <div className="relative">
                                        <Building2 size={14} className="absolute left-3 top-3.5 text-slate-500" />
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="Acme Inc"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-9 pr-3 text-white outline-none focus:border-emerald-500/50 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Context / Details</label>
                                <textarea
                                    rows="3"
                                    value={emailContext}
                                    onChange={(e) => setEmailContext(e.target.value)}
                                    placeholder="Briefly describe what you want to say..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none resize-none focus:border-emerald-500/50 text-sm"
                                ></textarea>
                            </div>
                            <button
                                onClick={handleGenerateEmail}
                                disabled={emailLoading || !clientName}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-2 shadow-lg shadow-emerald-900/20"
                            >
                                {emailLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
                                Generate Email
                            </button>

                            {generatedEmail && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-xl relative group"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Preview</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(generatedEmail)}
                                            className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed italic mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                                        {generatedEmail}
                                    </div>
                                    <button
                                        onClick={handleSendEmail}
                                        disabled={sendingEmail || !clientEmail}
                                        className="w-full bg-white text-slate-900 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-all flex justify-center items-center gap-2 shadow-xl"
                                    >
                                        {sendingEmail ? <Loader2 className="animate-spin text-emerald-600" size={18} /> : <Send size={16} className="text-emerald-600" />}
                                        Send to {clientName}
                                    </button>
                                    {!clientEmail && (
                                        <p className="text-[10px] text-rose-400 mt-2 text-center font-medium italic">* Select a client above to enable direct sending</p>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

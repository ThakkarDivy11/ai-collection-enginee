import React, { useState, useEffect } from "react";
import { Users, IndianRupee, Activity, Clock, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import AiActions from "../components/AiActions";
import AiVoiceCalls from "../components/AiVoiceCalls";



const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, loading }) => (
    <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 p-6 rounded-2xl relative overflow-hidden transition-colors duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            {!loading && (
                <div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
                    {trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {trendValue}
                </div>
            )}
        </div>
        <h3 className="text-gray-500 dark:text-slate-400 font-medium mb-1">{title}</h3>
        {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-lg"></div>
        ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        )}
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        if (status === "success") {
            setAlert({ type: "success", message: "Action completed successfully!" });
        } else if (status === "cancel") {
            setAlert({ type: "error", message: "Action was cancelled." });
        }

        // Clear status from URL
        if (status) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/dashboard/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                {alert && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${alert.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                        }`}>
                        <Activity size={20} />
                        <p className="font-medium text-sm">{alert.message}</p>
                        <button onClick={() => setAlert(null)} className="ml-auto text-current opacity-50 hover:opacity-100">&times;</button>
                    </div>
                )}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back, Admin</h1>
                <p className="text-gray-500 dark:text-slate-400">Here's what's happening with your clients today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Clients"
                    value={stats?.totalClients || "0"}
                    icon={Users}
                    trend="up"
                    trendValue="+12%"
                    color="bg-blue-600"
                    loading={loading}
                />
                <StatCard
                    title="Active Revenue"
                    value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={IndianRupee}
                    trend="up"
                    trendValue="+8%"
                    color="bg-emerald-600"
                    loading={loading}
                />
                <StatCard
                    title="Outstanding"
                    value={`₹${(stats?.totalOutstanding || 0).toLocaleString()}`}
                    icon={Clock}
                    trend="down"
                    trendValue="-5%"
                    color="bg-rose-600"
                    loading={loading}
                />
                <StatCard
                    title="Churn Risk"
                    value={stats?.churnRiskCount || "0"}
                    icon={Activity}
                    trend="down"
                    trendValue="-2%"
                    color="bg-amber-600"
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 p-6 rounded-2xl transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Revenue Overview</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 p-6 rounded-2xl transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Client Growth</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.chartData || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Bar dataKey="clients" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300">
                <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Clients</h3>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View all</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100/50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-8 py-4">Client</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Revenue</th>
                                <th className="px-8 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center">
                                        <Loader2 className="mx-auto animate-spin text-blue-500" size={32} />
                                    </td>
                                </tr>
                            ) : !stats?.recentClients || stats?.recentClients.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500 dark:text-slate-500">No clients found.</td>
                                </tr>
                            ) : stats?.recentClients.map((client, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{client.name}</div>
                                        <div className="text-gray-500 dark:text-slate-500 text-xs font-medium uppercase tracking-tight">{client.company}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.status === "Active" ? "bg-emerald-500/10 text-emerald-400" :
                                            client.status === "Churn-risk" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-gray-900 dark:text-white">{client.revenue}</td>
                                    <td className="px-8 py-5 text-gray-500 dark:text-slate-400 text-sm font-medium">{client.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AiActions />
            <AiVoiceCalls />
        </div>
    );
}
import { useState } from "react";
import { BrainCircuit, Loader2, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
    const [activeTab, setActiveTab] = useState("admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = activeTab === "admin" ? "/api/auth/login" : "/api/clients/login";

        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                if (activeTab === "admin") {
                    localStorage.setItem("user", JSON.stringify(data));
                    window.location.href = "/dashboard";
                } else {
                    localStorage.setItem("customer", JSON.stringify(data.client));
                    window.location.href = "/customer-dashboard";
                }
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 p-10 rounded-3xl w-full max-w-[440px] shadow-2xl relative z-10"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-600 p-2 rounded-xl text-white">
                        <BrainCircuit size={32} />
                    </div>
                    <h1 className="text-white text-3xl font-bold tracking-tight">
                        CollectAI
                    </h1>
                </div>

                <div className="flex bg-slate-800 rounded-2xl p-1 mb-8">
                    {["admin", "customer"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab
                                ? "bg-slate-950 text-white shadow-xl"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="mb-8">
                    <h2 className="text-white text-2xl font-bold mb-2">
                        {activeTab === "admin" ? "Admin Access" : "Client Portal"}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Enterprise AI Client Management System
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-rose-500/10 border border-rose-500/20 text-rose-500 py-3 px-4 rounded-xl text-sm mb-6"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-slate-500" size={20} />
                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-slate-500" size={20} />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl text-white font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/40 transition-all flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In to Dashboard"}
                    </button>
                </form>

                <p className="text-center text-slate-500 text-xs mt-8">
                    © 2026 Divy Systems • Secure Access
                </p>
            </motion.div>
        </div>
    );
}
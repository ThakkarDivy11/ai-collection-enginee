import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Users, CreditCard, BrainCircuit, BarChart3, Mail, Settings2,
    ChevronRight, Sun, Moon, Check, ArrowRight, Zap, Shield, Globe,
    TrendingUp, Clock, CheckCircle2
} from "lucide-react";
import BackgroundWrapper from "../components/ui/BackgroundWrapper";

/* ─── Theme hook ────────────────────────────────────────────── */
function useTheme() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");
    return { theme, toggle };
}

/* ─── Navbar ────────────────────────────────────────────────── */
function Navbar({ theme, toggle }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
                ? "bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm border-b border-slate-200/80 dark:border-white/5"
                : "bg-transparent"
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <BrainCircuit size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Collect<span className="text-blue-500">AI</span>
                    </span>
                </div>

                {/* Nav links */}
                <nav className="hidden md:flex items-center gap-8">
                    {["Features", "How It Works", "Pricing"].map(link => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            {link}
                        </a>
                    ))}
                </nav>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggle}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                    </button>
                    <Link
                        to="/login"
                        className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm shadow-blue-600/30"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}

/* ─── Hero ──────────────────────────────────────────────────── */
function Hero() {
    return (
        <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
            {/* BG Glow */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200/70 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
                            <Zap size={14} className="fill-current" />
                            AI-Powered Platform
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                            AI-Powered Client &{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                                Revenue Intelligence
                            </span>{" "}
                            Platform
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
                            Manage clients, track payments, and unlock AI-driven insights — all in one smart dashboard built for modern businesses.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5"
                            >
                                Get Started Free <ChevronRight size={16} />
                            </Link>
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/60 backdrop-blur border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                            >
                                View Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Right – Dashboard preview card */}
                    <div className="relative">
                        <div className="relative bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
                            {/* Mini header */}
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Revenue Overview</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">₹2,14,500</p>
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                    <TrendingUp size={12} /> +18.4%
                                </span>
                            </div>
                            {/* Fake chart */}
                            <div className="relative h-32 flex items-end gap-1.5 mb-5">
                                {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end">
                                        <div
                                            className="rounded-t-sm bg-gradient-to-t from-blue-600 to-indigo-400 opacity-80"
                                            style={{ height: `${h}%` }}
                                        />
                                    </div>
                                ))}
                                {/* Line overlay SVG */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 120 100" preserveAspectRatio="none">
                                    <path d="M 0 60 L 10 35 L 20 55 L 30 20 L 40 45 L 50 10 L 60 30 L 70 5 L 80 40 L 90 15 L 100 25 L 110 8 L 120 0" fill="none" stroke="rgba(99,102,241,0.6)" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Active Clients", value: "124" },
                                    { label: "Paid Invoices", value: "98%" },
                                    { label: "AI Insights", value: "Live" },
                                ].map((s, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{s.label}</p>
                                        <p className="text-slate-900 dark:text-white font-bold text-lg mt-0.5">{s.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Real-time sync</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Stats ─────────────────────────────────────────────────── */
function Stats() {
    const stats = [
        { value: "₹2L+", label: "Revenue Managed" },
        { value: "100+", label: "Active Clients" },
        { value: "95%", label: "Payment Success Rate" },
        { value: "Real-time", label: "AI Insights" },
    ];
    return (
        <section className="py-12 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {stats.map((s, i) => (
                        <div key={i}>
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{s.value}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Features ──────────────────────────────────────────────── */
function Features() {
    const features = [
        { icon: Users, title: "Client Management", desc: "Add, edit, and track all your clients in one place. Segment by status, revenue, and churn risk.", accent: "blue" },
        { icon: CreditCard, title: "Payment Tracking", desc: "Monitor invoices, billing history, and payment statuses with real-time updates and notifications.", accent: "indigo" },
        { icon: BrainCircuit, title: "AI Insights", desc: "Get smart analytics and AI-generated recommendations on client activity and revenue trends.", accent: "violet" },
        { icon: BarChart3, title: "Revenue Dashboard", desc: "Visual charts and KPIs for revenue, transactions, and growth trends at a glance.", accent: "blue" },
        { icon: Mail, title: "AI Email Automation", desc: "Let AI draft personalized follow-ups, payment reminders, and client updates automatically.", accent: "indigo" },
        { icon: Settings2, title: "Smart Settings", desc: "Configure your workspace, notification preferences, and integrations with ease.", accent: "violet" },
    ];

    const accentMap = {
        blue:   { bg: "bg-blue-100 dark:bg-blue-900/30",   icon: "text-blue-600 dark:text-blue-400",   glow: "hover:shadow-blue-500/10" },
        indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", icon: "text-indigo-600 dark:text-indigo-400", glow: "hover:shadow-indigo-500/10" },
        violet: { bg: "bg-violet-100 dark:bg-violet-900/30", icon: "text-violet-600 dark:text-violet-400", glow: "hover:shadow-violet-500/10" },
    };

    return (
        <section id="features" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Features</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Everything you need to manage clients & revenue
                    </h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
                        A complete suite of tools powered by AI to run your business smarter.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => {
                        const a = accentMap[f.accent];
                        return (
                            <div key={i} className={`p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200/80 dark:border-white/10 rounded-2xl hover:-translate-y-1 hover:shadow-xl ${a.glow} transition-all duration-300 group`}>
                                <div className={`w-11 h-11 rounded-xl ${a.bg} ${a.icon} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <f.icon size={22} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ─── AI Section ────────────────────────────────────────────── */
function AISection() {
    const points = [
        "Auto-generate client follow-up emails",
        "Predict churn risk before it happens",
        "Surface revenue insights instantly",
        "Smart payment reminders that convert",
    ];
    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#020617] dark:to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
                            <BrainCircuit size={14} />
                            Powered by AI
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5">
                            Let AI Do the Thinking
                        </h2>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            CollectAI's built-in intelligence engine continuously analyzes your client data, payment patterns, and business metrics — turning raw numbers into actionable insights automatically.
                        </p>
                        <ul className="space-y-3">
                            {points.map((p, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-200">
                                    <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
                                    <span className="text-sm font-medium">{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* AI insight card */}
                    <div className="bg-slate-800/60 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">AI Insight Preview</p>
                        {[
                            { label: "Acme Corp", status: "Churn Risk", color: "text-rose-400 bg-rose-500/10" },
                            { label: "TechStart Ltd", status: "Invoice Overdue", color: "text-amber-400 bg-amber-500/10" },
                            { label: "Nexus Group", status: "Upsell Opportunity", color: "text-emerald-400 bg-emerald-500/10" },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-700/40 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                        {row.label[0]}
                                    </div>
                                    <span className="text-sm font-semibold text-white">{row.label}</span>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${row.color}`}>{row.status}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 pt-2">
                            <BrainCircuit size={14} className="text-blue-400" />
                            <p className="text-xs text-slate-400">AI analysis updated 2 min ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Client Portal Preview ─────────────────────────────────── */
function BillingPreview() {
    const invoices = [
        { num: "INV-001", company: "Acme Corp", amount: "₹45,000", due: "Apr 10, 2026", status: "PAID" },
        { num: "INV-002", company: "TechStart Ltd", amount: "₹28,500", due: "Apr 15, 2026", status: "PENDING" },
        { num: "INV-003", company: "Nexus Group", amount: "₹62,000", due: "Mar 28, 2026", status: "OVERDUE" },
    ];
    const statusStyle = {
        PAID:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        PENDING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        OVERDUE: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Client Portal</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        A billing portal your clients will love
                    </h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">
                        Give every client a dedicated portal to view invoices, track payments, and download receipts.
                    </p>
                </div>
                <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto">
                    <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white">Billing History</h3>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">3 invoices</span>
                    </div>
                    <div className="divide-y divide-slate-200/80 dark:divide-white/5">
                        {invoices.map((inv, i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{inv.num}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{inv.company}</p>
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{inv.amount}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {inv.due}</p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle[inv.status]}`}>
                                    {inv.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── How It Works ──────────────────────────────────────────── */
function HowItWorks() {
    const steps = [
        { num: "01", icon: Users, title: "Add Clients", desc: "Import or create client profiles with contact info, company details, and payment settings." },
        { num: "02", icon: CreditCard, title: "Track Payments", desc: "Generate invoices, monitor payment status, and get notified on overdue accounts automatically." },
        { num: "03", icon: BrainCircuit, title: "AI Insights", desc: "The AI engine analyzes your data and serves actionable recommendations on revenue and risk." },
        { num: "04", icon: TrendingUp, title: "Grow Revenue", desc: "Act on insights, automate follow-ups, and watch your collection rate and revenue climb." },
    ];
    return (
        <section id="how-it-works" className="py-24 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">How It Works</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Up and running in minutes
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((s, i) => (
                        <div key={i} className="relative p-6 bg-white/80 dark:bg-slate-900/60 backdrop-blur border border-slate-200/80 dark:border-white/10 rounded-2xl">
                            <div className="text-5xl font-black text-slate-100 dark:text-white/5 absolute top-4 right-5 select-none">{s.num}</div>
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                                <s.icon size={20} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Pricing ───────────────────────────────────────────────── */
function Pricing() {
    const tiers = [
        {
            name: "Starter", price: "Free", desc: "Perfect for freelancers and small teams.",
            features: ["Up to 10 clients", "Basic payment tracking", "Standard invoicing", "Email support"],
            cta: "Get Started Free", highlight: false,
        },
        {
            name: "Growth", price: "₹999", period: "/mo", desc: "For growing businesses that need AI power.",
            features: ["Unlimited clients", "AI Insights & analytics", "AI email automation", "Client portal", "Priority support"],
            cta: "Start Free Trial", highlight: true,
        },
        {
            name: "Enterprise", price: "Custom", desc: "Dedicated infrastructure for large teams.",
            features: ["Everything in Growth", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise option"],
            cta: "Contact Sales", highlight: false,
        },
    ];
    return (
        <section id="pricing" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Pricing</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Simple, transparent pricing
                    </h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">No hidden fees. Cancel anytime.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
                    {tiers.map((t, i) => (
                        <div key={i} className={`relative flex flex-col p-7 rounded-2xl border transition-all duration-300 
                            ${t.highlight
                                ? "bg-blue-600 border-blue-500 shadow-2xl shadow-blue-600/30 scale-100 md:scale-105 z-10"
                                : "bg-white/70 dark:bg-slate-900/60 backdrop-blur border-slate-200/80 dark:border-white/10 hover:scale-[1.02]"
                            }`}
                        >
                            {t.highlight && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                    <span className="bg-white text-blue-600 text-xs font-extrabold px-3 py-1 rounded-full shadow">Most Popular</span>
                                </div>
                            )}
                            <h3 className={`text-lg font-bold mb-1 ${t.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>{t.name}</h3>
                            <p className={`text-xs mb-5 ${t.highlight ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>{t.desc}</p>
                            <div className="mb-6">
                                <span className={`text-4xl font-extrabold ${t.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>{t.price}</span>
                                {t.period && <span className={`text-sm ${t.highlight ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>{t.period}</span>}
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {t.features.map((f, fi) => (
                                    <li key={fi} className={`flex items-center gap-2.5 text-sm ${t.highlight ? "text-blue-50" : "text-slate-700 dark:text-slate-300"}`}>
                                        <Check size={15} className={t.highlight ? "text-blue-200" : "text-blue-500"} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]
                                ${t.highlight
                                    ? "bg-white text-blue-600 hover:bg-blue-50"
                                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-100"
                                }`}
                            >
                                {t.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── CTA ───────────────────────────────────────────────────── */
function CTA() {
    return (
        <section className="py-24 bg-slate-900 dark:bg-[#020617] relative overflow-hidden">
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-3xl" />
            </div>
            <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                    Start Managing Your Business Smarter Today
                </h2>
                <p className="text-slate-400 text-lg mb-10">
                    Join hundreds of businesses already using CollectAI to automate collections, track revenue, and gain AI-powered insights.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/40 hover:-translate-y-0.5"
                    >
                        Start Free <ArrowRight size={16} />
                    </Link>
                    <button className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all hover:-translate-y-0.5">
                        Book a Demo
                    </button>
                </div>
                <div className="mt-8 flex flex-wrap gap-6 justify-center text-slate-500 text-sm">
                    {["No credit card required", "Free forever plan", "Cancel anytime"].map(t => (
                        <div key={t} className="flex items-center gap-2">
                            <Shield size={14} className="text-blue-500" /> {t}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Footer ────────────────────────────────────────────────── */
function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <BrainCircuit size={18} className="text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">Collect<span className="text-blue-400">AI</span></span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            AI-powered client management and revenue tracking for modern businesses.
                        </p>
                    </div>
                    {[
                        { heading: "Product", links: ["Features", "Pricing", "Dashboard", "Client Portal"] },
                        { heading: "Company", links: ["About", "Contact", "Privacy Policy", "Terms"] },
                    ].map(col => (
                        <div key={col.heading}>
                            <p className="text-white font-semibold text-sm mb-4">{col.heading}</p>
                            <ul className="space-y-2.5">
                                {col.links.map(l => (
                                    <li key={l}><a href="#!" className="text-slate-400 hover:text-white text-sm transition-colors">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-slate-500 text-sm">© 2026 CollectAI. All rights reserved.</p>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <Globe size={14} /> Made for modern businesses
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ─── Main LandingPage component ────────────────────────────── */
export default function LandingPage() {
    const { theme, toggle } = useTheme();
    return (
        <BackgroundWrapper>
            <div className="text-slate-900 dark:text-slate-100 font-sans antialiased">
                <Navbar theme={theme} toggle={toggle} />
                <main>
                    <Hero />
                    <Stats />
                    <Features />
                    <AISection />
                    <BillingPreview />
                    <HowItWorks />
                    <Pricing />
                    <CTA />
                </main>
                <Footer />
            </div>
        </BackgroundWrapper>
    );
}

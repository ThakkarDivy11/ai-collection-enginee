import React from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import PremiumBackground from "./ui/premium-background";
import ThemeToggle from "./ThemeToggle";

const pageTitles = {
    "/dashboard":   { title: "Dashboard",  sub: "Overview of your business metrics" },
    "/clients":     { title: "Clients",    sub: "Manage your client relationships" },
    "/payments":    { title: "Payments",   sub: "Track invoices and transactions" },
    "/ai-insights": { title: "AI Insights",sub: "AI-powered revenue analytics" },
    "/settings":    { title: "Settings",   sub: "Manage your account preferences" },
};

const TopNavbar = () => {
    const location = useLocation();
    const page = pageTitles[location.pathname] || { title: "Dashboard", sub: "" };
    const userName = "Admin";

    return (
        <header className="sticky top-0 z-30 w-full border-b border-gray-200/80 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-xl transition-colors duration-300">
            <div className="flex items-center justify-between px-6 sm:px-8 h-16 gap-4">
                {/* Left — page info */}
                <div className="hidden sm:block min-w-0">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white truncate leading-tight">
                        {page.title}
                    </h2>
                    {page.sub && (
                        <p className="text-xs text-gray-500 dark:text-slate-500 truncate mt-0.5">{page.sub}</p>
                    )}
                </div>

                {/* Right — actions */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-500 dark:text-slate-400 text-sm w-52 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all">
                        <Search size={15} className="shrink-0" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 w-full"
                        />
                    </div>

                    {/* Notification bell */}
                    <button className="relative p-2 rounded-xl bg-gray-100/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                        <Bell size={17} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-black" />
                    </button>

                    {/* Theme toggle */}
                    <ThemeToggle />

                    {/* Divider */}
                    <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />

                    {/* User avatar */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm select-none">
                            {userName[0]}
                        </div>
                        <span className="hidden lg:block text-sm font-semibold text-gray-900 dark:text-white">
                            {userName}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="flex bg-white dark:bg-[#020617] text-gray-900 dark:text-white min-h-screen relative overflow-hidden transition-colors duration-300">
            {/* Premium dark background — navy, grid, radial glows */}
            <div className="hidden dark:block">
                <PremiumBackground />
            </div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main column: navbar + content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative z-10 w-full overflow-hidden">
                <TopNavbar />
                <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;

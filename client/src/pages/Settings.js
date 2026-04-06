import React, { useState } from "react";
import {
    User,
    Building2,
    ShieldCheck,
    Bell,
    Globe,
    Mail,
    Lock,
    Save,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TabButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all relative ${active ? "text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
    >
        <Icon size={18} />
        {label}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
        )}
    </button>
);

const SettingRow = ({ label, description, children }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-slate-800/50 gap-4">
        <div className="max-w-md">
            <h4 className="text-white font-medium mb-1">{label}</h4>
            <p className="text-slate-400 text-sm">{description}</p>
        </div>
        <div className="flex-shrink-0">
            {children}
        </div>
    </div>
);

const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <div className="relative">
            {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />}
            <input
                {...props}
                className={`w-full bg-slate-900 border border-slate-800 rounded-xl py-3 ${Icon ? 'pl-11' : 'px-4'} pr-4 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all`}
            />
        </div>
    </div>
);

export default function Settings() {
    const [activeTab, setActiveTab] = useState("general");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    const tabs = [
        { id: "general", label: "General", icon: User },
        { id: "company", label: "Company", icon: Building2 },
        { id: "security", label: "Security", icon: ShieldCheck },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-slate-400">Manage your account preferences and system configuration.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${saved
                            ? "bg-emerald-500 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                        } disabled:opacity-50`}
                >
                    {saving ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <Save size={18} />
                        </motion.div>
                    ) : saved ? (
                        <CheckCircle2 size={18} />
                    ) : (
                        <Save size={18} />
                    )}
                    {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="flex border-b border-slate-800 bg-slate-900/30">
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            active={activeTab === tab.id}
                            icon={tab.icon}
                            label={tab.label}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === "general" && (
                            <motion.div
                                key="general"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Full Name" icon={User} defaultValue="Admin User" />
                                    <InputField label="Email Address" icon={Mail} defaultValue="admin@collectai.com" />
                                    <InputField label="Role" icon={ShieldCheck} defaultValue="System Administrator" disabled />
                                    <InputField label="Timezone" icon={Globe} defaultValue="(GMT+05:30) India Standard Time" />
                                </div>
                                <div className="pt-8 border-t border-slate-800/50">
                                    <h3 className="text-lg font-bold text-white mb-6">Profile Appearance</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-500/20">
                                            A
                                        </div>
                                        <div className="space-y-2">
                                            <button className="bg-slate-800 hover:bg-slate-700 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium">Change Avatar</button>
                                            <p className="text-slate-500 text-xs">JPG, GIF or PNG. Max size of 2MB</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "company" && (
                            <motion.div
                                key="company"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Company Name" icon={Building2} defaultValue="CollectAI Inc." />
                                    <InputField label="Website" icon={Globe} defaultValue="https://collectai.com" />
                                </div>
                                <div className="space-y-4 pt-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Company Address</label>
                                    <textarea
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white h-32 outline-none focus:border-blue-500 transition-all font-medium"
                                        defaultValue="123 Tech Avenue, Silicon Valley, CA 94025"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "security" && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <SettingRow
                                    label="Two-Factor Authentication"
                                    description="Add an extra layer of security to your account by requiring more than just a password to log in."
                                >
                                    <button className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-4 py-2 rounded-lg text-sm font-bold transition-all">Enable 2FA</button>
                                </SettingRow>
                                <SettingRow
                                    label="Password Requirements"
                                    description="Enforce strong passwords for all team members."
                                >
                                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                        <CheckCircle2 size={16} />
                                        Enabled
                                    </div>
                                </SettingRow>
                                <div className="pt-6">
                                    <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <InputField label="Current Password" icon={Lock} type="password" placeholder="••••••••" />
                                        <InputField label="New Password" icon={Lock} type="password" placeholder="••••••••" />
                                        <InputField label="Confirm Password" icon={Lock} type="password" placeholder="••••••••" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "notifications" && (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <SettingRow label="Email Notifications" description="Receive updates and alerts via email.">
                                    <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                    </div>
                                </SettingRow>
                                <SettingRow label="Desktop Alerts" description="Show browser push notifications.">
                                    <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full" />
                                    </div>
                                </SettingRow>
                                <SettingRow label="Payment Success" description="Notify when a client completes a payment.">
                                    <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                    </div>
                                </SettingRow>
                                <SettingRow label="Churn Alerts" description="AI alerts for clients at risk of churning.">
                                    <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                    </div>
                                </SettingRow>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Sparkles className="text-amber-500" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Pro Account</h4>
                        <p className="text-slate-500 text-sm">Your trial expires in 12 days. Upgrade to keep premium features.</p>
                    </div>
                </div>
                <button className="bg-white text-slate-950 px-6 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors">Upgrade Now</button>
            </div>
        </div>
    );
}

import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    return (
        <div className="flex bg-slate-950 min-h-screen relative overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-20"
            >
                <source src="/ai.mp4" type="video/mp4" />
            </video>

            <Sidebar />
            <main className="flex-1 md:ml-64 p-8 text-slate-200 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;

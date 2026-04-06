import React from "react";

export default function BackgroundWrapper({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-[#020617] overflow-hidden transition-colors duration-300">
      {/* 1. Base Layer handled by bg-slate-50 dark:bg-[#020617] */}
      
      {/* 2. Grid Layer */}
      <div 
        className="hidden dark:block absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden="true"
      />

      {/* 3. Glow Layer */}
      <div 
        className="hidden dark:block absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.10)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* 4. Depth Layer */}
      <div 
        className="hidden dark:block absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black/40"
        aria-hidden="true"
      />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

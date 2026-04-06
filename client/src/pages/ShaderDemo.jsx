import React from 'react';
import ShaderBackground from "../components/ui/shader-background";

const ShaderDemo = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <ShaderBackground />
      <div className="relative z-10 text-center p-10 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl max-w-lg">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Shader Background Demo</h1>
        <p className="text-slate-300 text-lg">
          A high-performance WebGL shader background with dynamic plasma lines and responsive sizing.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">Get Started</button>
          <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default ShaderDemo;

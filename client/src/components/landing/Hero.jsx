import React from 'react';

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 mb-8 sm:mb-10 text-sm font-medium text-gray-900 dark:text-white shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-cyan-500 mr-2"></span>
          Placeholder Badge Text
        </div>
        
        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
          Main Primary <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-orange-400">
            Headline Text Here
          </span>
        </h1>
        
        {/* Subhead */}
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10">
          This is a generic placeholder description. It explains what the product does in a short, concise, and engaging way without using specific industry terms.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/25">
            Primary Action
          </button>
          <button className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-gray-900 dark:text-white bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/20 hover:scale-105 transition-all duration-300">
            Secondary Action
          </button>
        </div>

        {/* Floating/Glass Stats Cards */}
        <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto cursor-default">
          {[
            { label: 'Metric One', value: '100+' },
            { label: 'Metric Two', value: '99%' },
            { label: 'Metric Three', value: '10x' },
            { label: 'Metric Four', value: '24/7' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-orange-400/10 dark:bg-orange-500/5 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default Hero;

import React from 'react';

const DashboardPreview = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 cursor-default">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Section Headline Title
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            A generic subheading text to support the main title of this section.
          </p>
        </div>

        {/* Dashboard Mockup (Glass UI + Glow) */}
        <div className="relative mx-auto rounded-3xl p-1 bg-gradient-to-b from-blue-500/20 to-transparent dark:from-cyan-500/20 lg:max-w-5xl shadow-2xl shadow-blue-500/10 dark:shadow-cyan-500/10">
          <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 backdrop-blur-xl">
            
            {/* Top Bar */}
            <div className="w-full h-12 bg-gray-100/50 dark:bg-black/20 border-b border-black/5 dark:border-white/10 flex items-center px-4 space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            </div>
            
            <div className="flex h-[500px]">
              {/* Sidebar Mock */}
              <div className="w-64 border-r border-black/5 dark:border-white/10 p-6 hidden md:block">
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700/50 rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-10 w-full bg-blue-50/50 dark:bg-white/5 rounded-xl border border-blue-100 dark:border-white/5"></div>
                  <div className="h-10 w-full bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"></div>
                  <div className="h-10 w-full bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"></div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700/50 rounded-lg"></div>
                  <div className="h-10 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl"></div>
                </div>
                
                {/* Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-2xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/20 shadow-sm">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700/50 rounded mb-4"></div>
                      <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700/80 rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Graph + Circular Progress row */}
                <div className="flex gap-6 h-64">
                  {/* Graph */}
                  <div className="flex-1 rounded-2xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/20 p-6 relative overflow-hidden flex flex-col justify-end">
                    <div className="absolute inset-x-6 top-6 bottom-6 flex flex-col justify-between pointer-events-none">
                      <div className="h-px w-full bg-gray-200/50 dark:bg-gray-800"></div>
                      <div className="h-px w-full bg-gray-200/50 dark:bg-gray-800"></div>
                      <div className="h-px w-full bg-gray-200/50 dark:bg-gray-800"></div>
                    </div>
                    {/* Fake line area gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-cyan-500/20 to-transparent"></div>
                    {/* Fake line stroke */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M 0 70 L 20 50 L 40 60 L 60 30 L 80 40 L 100 10" fill="none" stroke="currentColor" className="text-cyan-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  
                  {/* Circular Progress */}
                  <div className="w-64 rounded-2xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/20 p-6 flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path className="text-gray-200 dark:text-gray-800/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-orange-400 dark:text-orange-500" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">75%</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;

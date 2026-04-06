import React from 'react';

const Features = () => {
  const genericFeatures = [
    { title: 'Feature Title One', desc: 'Generic feature description text focusing on value instead of specifics.' },
    { title: 'Feature Title Two', desc: 'Detailed explanation of why this generic feature is important and useful.' },
    { title: 'Feature Title Three', desc: 'Another placeholder description highlighting a key benefit or capability.' },
    { title: 'Feature Title Four', desc: 'Brief summary of an advanced capability that solves a generic problem.' },
    { title: 'Feature Title Five', desc: 'Highlighting ease of use, integration, or performance benefits directly.' },
    { title: 'Feature Title Six', desc: 'Final generic feature description ensuring the layout looks full and balanced.' },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-semibold tracking-wide text-cyan-600 dark:text-cyan-400 uppercase">Category Tag</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Main Features Headline
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            A short paragraph describing the overall section and what the user can expect to see below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-default">
          {genericFeatures.map((feature, idx) => (
            <div key={idx} className="relative p-8 bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-200/50 dark:border-cyan-700/50">
                {/* Generic placeholder icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

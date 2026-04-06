import React from 'react';

const Process = () => {
  const steps = [
    { title: 'Step One Name', desc: 'Short generic description for the very first step.' },
    { title: 'Step Two Name', desc: 'Short generic description for the second progressive step.' },
    { title: 'Step Three Name', desc: 'Short generic description for the important third step.' },
    { title: 'Step Four Name', desc: 'Short generic description for the final concluding step.' },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            How It Works Headline
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 cursor-default">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-6 bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors duration-300">
              <div className="text-cyan-600 dark:text-cyan-400 font-mono text-sm font-bold mb-4">
                0{idx + 1}
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

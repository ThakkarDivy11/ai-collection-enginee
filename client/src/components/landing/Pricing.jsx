import React from 'react';

const Pricing = () => {
  const tiers = [
    { name: 'Tier One', price: '$0', desc: 'Generic description for the first tier.' },
    { name: 'Tier Two', price: '$49', desc: 'Generic description for the middle highlighted tier.', highlight: true },
    { name: 'Tier Three', price: '$99', desc: 'Generic description for the highest tier.' },
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Pricing Headline
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            A flexible pricing model description that fits standard SaaS products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center cursor-default">
          {tiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={`relative flex flex-col p-8 bg-white/70 dark:bg-white/10 backdrop-blur-xl border rounded-2xl transition-all duration-300
                ${tier.highlight 
                  ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/10 scale-100 md:scale-105 z-10' 
                  : 'border-black/10 dark:border-white/10 shadow-sm hover:scale-105 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5'
                }`}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10">{tier.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{tier.price}</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[1, 2, 3, 4].map(i => (
                  <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Generic feature item {i}
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-transform duration-300 hover:scale-[1.02] 
                ${tier.highlight 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25' 
                  : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                Action Button
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

import React from 'react';

interface IntroductionProps {
  onStart: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onStart }) => {
  const features = [
    {
      title: 'Agentic AI Reasoning',
      desc: 'Mixxd doesn\'t just alert. It reasons through complex infrastructure issues and prepares executable remediation strategies.',
      icon: (
        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
      )
    },
    {
      title: 'FinOps Optimization',
      desc: 'Detect zombie resources, right-size idle compute, and migrate dev workloads to Spot instances autonomously.',
      icon: (
        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
    {
      title: 'SecOps Remediation',
      desc: 'Close public ports, rotate exposed keys, and enforce encryption at rest without manual tickets.',
      icon: (
        <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full animate-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">How Mixxd Works</h2>
          <p className="text-slate-400 text-lg">A unified brain for your multi-cloud complexity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="mb-6 p-4 bg-slate-800 rounded-3xl w-fit group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-6">
          <button 
            onClick={onStart}
            className="px-12 py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95 shadow-2xl shadow-white/10"
          >
            Enter Command Center
          </button>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
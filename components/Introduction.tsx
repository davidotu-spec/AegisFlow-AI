import React from 'react';

interface IntroductionProps {
  onStart: () => void;
  onTryDemo: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onStart, onTryDemo }) => {
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-20 px-8 overflow-y-auto">
      <div className="max-w-5xl w-full animate-in slide-in-from-bottom-8 duration-700 space-y-24">
        
        {/* The Manifesto Section */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            The Mixxd Manifesto
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white">
            Governance is not <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">Observation.</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            For a decade, cloud tools have focused on "Visibility"—giving you more charts to ignore and more alerts to drown in. 
            <span className="text-white"> Mixxd is different.</span> We believe your cloud should be a self-healing organism. 
            One that identifies waste and security holes, reasons through the impact, and executes the fix before you even wake up.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
              <div className="mb-8 p-5 bg-slate-800 rounded-[2rem] w-fit group-hover:scale-110 transition-transform shadow-inner">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
              
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center space-y-8 pb-20">
          <div className="h-px w-32 bg-slate-800"></div>
          <div className="text-center space-y-4">
            <h4 className="text-2xl font-bold text-white">Ready to automate your multi-cloud?</h4>
            <p className="text-slate-500">Your agentic companion is waiting for initial instructions.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={onStart}
              className="group relative px-16 py-6 bg-white text-slate-950 font-black rounded-[2rem] hover:bg-indigo-50 transition-all active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center space-x-3 w-full sm:w-auto justify-center"
            >
              <span className="text-lg">Enter Command Center</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
            
            <button 
              onClick={onTryDemo}
              className="px-16 py-6 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-black rounded-[2rem] transition-all active:scale-95 flex items-center justify-center w-full sm:w-auto"
            >
              <span className="text-lg">Try Interactive Demo</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.129-6.514 11.235A1.438 1.438 0 0110 18.5a1.438 1.438 0 01-1.486-.264C4.597 14.129 2 9.946 2 7c0-.68.056-1.35.166-2.001zm9.496 2.193a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 10l2.248-2.808z" clipRule="evenodd" /></svg>
            <span>Biometric Verification Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
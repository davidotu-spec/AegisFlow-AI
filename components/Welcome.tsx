import React from 'react';

interface WelcomeProps {
  onNext: () => void;
  onTryDemo: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext, onTryDemo }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-4xl w-full text-center relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
          <span>The Next Generation of Cloud Management</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
          MIXXD
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          Stop watching your cloud. Let it govern itself. 
          The first truly autonomous <span className="text-indigo-400">Agentic FinOps</span> platform.
        </p>

        <div className="flex flex-col items-center justify-center space-y-16">
          <button 
            onClick={onNext}
            className="group relative px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 overflow-hidden active:scale-95 w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center space-x-3">
              <span className="text-lg">Begin Discovery</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
          </button>
          
          <div className="space-y-8 w-full">
            <div className="flex flex-col items-center space-y-4">
              <button 
                onClick={onTryDemo}
                className="text-slate-500 hover:text-indigo-400 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Enter Interactive Command Center
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
              <div className="flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="h-6 invert" /></div>
              <div className="flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg" alt="Azure" className="h-6 invert" /></div>
              <div className="flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_Logo.svg" alt="GCP" className="h-6 invert" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-1000">
        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
          Inquiries: <a href="mailto:info@mixxd.org" className="text-slate-500 hover:text-indigo-400 transition-colors">info@mixxd.org</a>
        </p>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    </div>
  );
};

export default Welcome;
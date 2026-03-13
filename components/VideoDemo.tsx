import React from 'react';

interface VideoDemoProps {
  src?: string;
  title?: string;
  description?: string;
  onClose?: () => void;
}

const VideoDemo: React.FC<VideoDemoProps> = ({ 
  src = "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-blue-circuit-board-4431-large.mp4",
  title = "Mixxd Agentic Autopilot",
  description = "Watch how Mixxd autonomously navigates cloud complexity.",
  onClose 
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="max-w-6xl w-full bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-full max-h-[800px]">
        {/* Video Area */}
        <div className="flex-1 bg-black relative group">
          <video 
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src={src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Video Controls Mockup */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-indigo-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" clipRule="evenodd" /></svg>
              </button>
              <div className="h-1 w-32 md:w-64 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-1/3"></div>
              </div>
              <span className="text-[10px] font-mono text-white/60">00:12 / 00:45</span>
            </div>
            <button className="text-white/60 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            </button>
          </div>
        </div>

        {/* Info Area */}
        <div className="w-full md:w-80 p-8 md:p-12 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              Interactive Demo
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter leading-tight">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {description}
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>Autonomous Reasoning</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                <span>Multi-Cloud Governance</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                <span>Real-time Remediation</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              Close Demo
            </button>
            <p className="text-[10px] text-slate-600 text-center font-bold uppercase tracking-widest">
              Powered by Mixxd AI Engine
            </p>
          </div>
        </div>

        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-full md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default VideoDemo;

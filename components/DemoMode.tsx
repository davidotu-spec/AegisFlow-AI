import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface LogEntry {
  type: 'observation' | 'reasoning' | 'action' | 'result';
  text: string;
  timestamp: string;
}

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  initialContext: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 's3_leak',
    title: 'Critical S3 Leakage',
    description: 'A dev bucket was accidentally switched to public read/write.',
    initialContext: 'Detected S3 Bucket "dev-frontend-assets" with ACL set to public-read-write. High risk of data exfiltration.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zM7 11V7a5 5 0 0110 0v4" /></svg>
  },
  {
    id: 'gpu_waste',
    title: 'Idle GPU Cluster',
    description: 'Forgotten P4d cluster in us-west-2 burning $32/hour.',
    initialContext: 'EC2 Cluster "ml-training-alpha" has been at 0.1% CPU utilization for 48 hours. Cost accumulation: $1,536.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
  },
  {
    id: 'iam_backdoor',
    title: 'Suspected Backdoor',
    description: 'New IAM user created with AdministratorAccess from unknown IP.',
    initialContext: 'CloudTrail Event: CreateUser "sys-admin-temp" with attached policy "AdministratorAccess". Source IP: 185.x.x.x (Anonymized Proxy).',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  },
  {
    id: 'multi_cloud_drift',
    title: 'Multi-Cloud Drift',
    description: 'Terraform state mismatch detected across AWS and Azure regions.',
    initialContext: 'Drift Detection: 12 resources in "prod-west" do not match defined HCL state. Unauthorized manual changes detected in Azure Portal.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
  }
];

const DemoMode: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [savings, setSavings] = useState(0);
  const [securityScore, setSecurityScore] = useState(88);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>('https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-blue-circuit-board-4431-large.mp4');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [showVideoHero, setShowVideoHero] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleUseSampleVideo = () => {
    setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-blue-circuit-board-4431-large.mp4');
    setVideoError(null);
  };

  const handleGenerateVideo = async () => {
    setVideoError(null);
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    setIsVideoGenerating(true);
    setGenerationStatus('Initializing cinematic engine...');
    
    try {
      // Guidelines: Always use process.env.GEMINI_API_KEY for the Gemini API.
      const env = (window as any).process?.env || {};
      const apiKey = env.GEMINI_API_KEY || env.API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not found. Please check your configuration in the Settings menu.');
      }
      
      const ai = new GoogleGenAI({ apiKey });
      
      setGenerationStatus('Synthesizing cloud topology visualization...');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A cinematic high-tech visualization of an autonomous Cloud FinOps and Security agent. The video features a sleek, futuristic AI entity (Mixxd) navigating a glowing 3D cloud network topology. Holographic interfaces display real-time cost savings metrics ($ saved) and security threat neutralization (shields blocking red attack vectors). Dark luxury aesthetic with deep navy, neon indigo, and vibrant emerald highlights. Professional, cinematic lighting with shallow depth of field. The atmosphere is calm, authoritative, and highly advanced, like a mission control center for the global cloud.',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      let pollCount = 0;
      const maxPolls = 30; // 5 minutes max

      while (!operation.done && pollCount < maxPolls) {
        pollCount++;
        setGenerationStatus(`Rendering frames and applying AI logic... (${Math.round((pollCount / maxPolls) * 100)}%)`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      if (!operation.done) {
        throw new Error('Video generation timed out. Please try again or use the sample video.');
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setGenerationStatus('Finalizing video stream...');
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': apiKey,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.statusText} (${response.status})`);
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } else {
        throw new Error('Video generation completed but no download link was provided.');
      }
    } catch (error: any) {
      console.error('Video generation failed:', error);
      setVideoError(error.message || 'An unexpected error occurred during video generation.');
      
      if (error?.message?.includes('entity was not found') || error?.message?.includes('API key')) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    } finally {
      setIsVideoGenerating(false);
      setGenerationStatus('');
    }
  };

  const runScenario = async (scenario: DemoScenario) => {
    setActiveScenario(scenario);
    setLogs([]);
    setIsProcessing(true);
    setCurrentStep('INITIALIZING');

    const addLog = (type: LogEntry['type'], text: string) => {
      setLogs(prev => [...prev, { type, text, timestamp: new Date().toLocaleTimeString() }]);
    };

    // Phase 1: Observation
    addLog('observation', `Intercepted CloudEvent: ${scenario.initialContext}`);
    await new Promise(r => setTimeout(r, 1500));
    setCurrentStep('REASONING');

    // Phase 2: Reasoning
    addLog('reasoning', "Querying internal knowledge base and compliance policies...");
    await new Promise(r => setTimeout(r, 1000));
    
    const reasoningText = scenario.id === 's3_leak' 
      ? "Bucket ACL violates 'SEC-001: No Public Read/Write'. Reasoning: Public access to frontend assets is expected via CDN, but direct bucket access is a misconfiguration. Action: Enforce Public Access Block."
      : scenario.id === 'gpu_waste'
      ? "Cluster 'ml-training-alpha' identified as 'Zombie Resource'. Reasoning: 0.1% CPU for 48h indicates a forgotten experiment. Cost exceeds threshold. Action: Terminate instance."
      : scenario.id === 'iam_backdoor'
      ? "IAM User 'sys-admin-temp' flagged as 'Anomalous Privilege Escalation'. Reasoning: Admin access granted from non-corporate IP range. Action: Disable user and revoke sessions."
      : "Infrastructure Drift detected in 'prod-west'. Reasoning: Manual overrides in Azure Portal bypassed CI/CD pipeline. Action: Trigger Terraform reconciliation and overwrite manual changes.";

    addLog('reasoning', reasoningText);
    await new Promise(r => setTimeout(r, 2000));
    setCurrentStep('REMEDIATING');

    // Phase 3: Action
    addLog('action', "Generating Terraform remediation plan...");
    await new Promise(r => setTimeout(r, 1500));
    addLog('action', `Executing API call to ${scenario.id === 's3_leak' ? 'S3:PutBucketPublicAccessBlock' : scenario.id === 'gpu_waste' ? 'EC2:TerminateInstances' : scenario.id === 'iam_backdoor' ? 'IAM:UpdateUser' : 'Terraform:Apply'}...`);
    
    // Phase 4: Result
    await new Promise(r => setTimeout(r, 2000));
    addLog('result', "Remediation Successful. State synchronized. Notifying SecOps team via Slack.");
    
    if (scenario.id === 'gpu_waste') setSavings(prev => prev + 1536);
    if (scenario.id === 's3_leak' || scenario.id === 'iam_backdoor') setSecurityScore(prev => Math.min(100, prev + 4));
    
    setIsProcessing(false);
    setCurrentStep('COMPLETED');
    
    setTimeout(() => setCurrentStep(null), 3000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-6xl mx-auto">
      {/* Hero Video Section */}
      {showVideoHero && (
        <section className="relative w-full aspect-[21/9] bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl group">
          {videoUrl ? (
            <video 
              key={videoUrl}
              ref={videoRef}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000"
              autoPlay
              muted
              loop
              playsInline
              src={videoUrl}
              onError={() => setVideoError('Failed to play video. The source might be inaccessible.')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
              <div className="text-center space-y-6 max-w-lg px-6">
                {isVideoGenerating ? (
                  <div className="space-y-8">
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">Generating Cinematic Demo</h4>
                      <p className="text-slate-500 text-sm font-mono animate-pulse">{generationStatus}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
                      <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-white tracking-tight">Experience Mixxd in Motion</h3>
                      <p className="text-slate-400 text-lg">Generate a custom AI-powered cinematic visualization of your autonomous cloud agent.</p>
                    </div>
                    
                    {videoError && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-medium">
                        {videoError}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={handleGenerateVideo}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 flex items-center space-x-3"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        <span>Generate AI Video</span>
                      </button>
                      <button 
                        onClick={handleUseSampleVideo}
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 active:scale-95"
                      >
                        Use Sample Video
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Overlay Content */}
          <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none">
             <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Live Agent Simulation</span>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter">Autonomous Cloud Governance</h2>
                <p className="text-slate-300 text-lg font-medium leading-relaxed opacity-80">
                  Watch as Mixxd reasons through infrastructure anomalies, optimizes spend, and hardens security posture in real-time.
                </p>
             </div>
          </div>
          
          {videoUrl && (
            <button 
              onClick={() => setShowVideoHero(false)}
              className="absolute top-8 right-8 p-3 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all border border-slate-700/50 backdrop-blur-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </section>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Simulated Savings</p>
          <h3 className="text-3xl font-black text-emerald-400 tabular-nums">${savings.toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Security Posture</p>
          <h3 className="text-3xl font-black text-indigo-400 tabular-nums">{securityScore}/100</h3>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl md:col-span-2 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Agent Status</p>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              <span className="text-xl font-bold text-white uppercase tracking-tight">{isProcessing ? 'Processing' : 'Standby'}</span>
            </div>
          </div>
          {currentStep && (
            <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">{currentStep}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
        {/* Scenarios Sidebar */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Select Simulation</h3>
          {DEMO_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => !isProcessing && runScenario(s)}
              disabled={isProcessing}
              className={`w-full text-left p-6 rounded-3xl border transition-all duration-300 group ${
                activeScenario?.id === s.id 
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-lg' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-2xl ${activeScenario?.id === s.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
                  {s.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{s.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.description}</p>
                </div>
              </div>
            </button>
          ))}
          
          <div className="bg-slate-900/20 border border-slate-800/50 p-6 rounded-3xl mt-8">
            <p className="text-xs text-slate-500 italic leading-relaxed">
              * The agent uses real-time reasoning to determine the impact of each anomaly before executing remediation.
            </p>
          </div>
        </div>

        {/* Console Output */}
        <div className="lg:col-span-2 flex flex-col bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Mixxd Agent Console v1.0.4-agentic</span>
            </div>
            {isProcessing && (
              <span className="flex items-center space-x-2 text-[10px] font-bold text-indigo-400 animate-pulse">
                <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                <span>AGENT_THINKING</span>
              </span>
            )}
          </div>

          {/* Log Stream */}
          <div className="flex-1 overflow-y-auto p-8 font-mono space-y-6 scrollbar-hide">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center space-y-4">
                <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-sm">Select a scenario to witness the <br/>Agentic Autopilot in action.</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`animate-in fade-in slide-in-from-left-2 duration-300 ${
                  log.type === 'result' ? 'bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl' : ''
                }`}>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-[10px] text-slate-600">[{log.timestamp}]</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      log.type === 'observation' ? 'text-amber-500' :
                      log.type === 'reasoning' ? 'text-indigo-400' :
                      log.type === 'action' ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                      {log.type}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    log.type === 'reasoning' ? 'text-slate-300 italic' : 
                    log.type === 'result' ? 'text-emerald-400 font-bold' : 'text-slate-400'
                  }`}>
                    {log.text}
                  </p>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>

          {/* Bottom Bar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <div className="text-[10px] text-slate-600 font-bold">STATE: <span className={isProcessing ? 'text-amber-400' : 'text-emerald-400'}>{isProcessing ? 'BUSY' : 'READY'}</span></div>
               <div className="text-[10px] text-slate-600 font-bold">MODE: <span className="text-indigo-400">AUTONOMOUS</span></div>
            </div>
            {logs.length > 0 && !isProcessing && (
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Clear Console
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoMode;

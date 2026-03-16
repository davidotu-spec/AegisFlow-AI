import React, { useState, useEffect, useRef } from 'react';

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
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

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
      {/* Metrics Overview */}

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

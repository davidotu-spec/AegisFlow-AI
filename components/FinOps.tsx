
import React, { useState, useEffect } from 'react';
import { MOCK_RESOURCES } from '../constants';
import { ResourceStatus, CloudResource, CloudProvider } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FinOps: React.FC = () => {
  const [resources, setResources] = useState<CloudResource[]>(MOCK_RESOURCES);
  const [selectedResource, setSelectedResource] = useState<CloudResource | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');

  // Calculate stats dynamically from the current resources state
  const totalWaste = resources.reduce((acc, res) => (res.wasteScore > 60 ? acc + res.monthlyCost : acc), 0);
  const zombieCount = resources.filter(res => res.status === ResourceStatus.ZOMBIE).length;
  const rightsizingCount = resources.filter(res => res.wasteScore > 30 && res.wasteScore <= 60).length;

  const startScan = () => {
    setIsConfirmModalOpen(false);
    setIsScanning(true);
    setScanProgress(0);
  };

  useEffect(() => {
    if (isScanning) {
      const statuses = [
        'Connecting to AWS CloudWatch API...',
        'Analyzing Azure Cost Management usage metrics...',
        'Fetching GCP Billing Export datasets...',
        'Heuristic analysis of idle compute instances...',
        'Identifying orphaned EBS volumes and S3 buckets...',
        'Deep scan complete. Updating insights.'
      ];
      
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => completeScan(), 600);
            return 100;
          }
          const next = prev + 1.2;
          const statusIdx = Math.min(Math.floor((next / 100) * statuses.length), statuses.length - 1);
          setScanStatus(statuses[statusIdx]);
          return next;
        });
      }, 40);

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const completeScan = () => {
    const newlyDiscovered: CloudResource[] = [
      { 
        id: 'i-af559922', 
        name: 'stale-jenkins-worker', 
        type: 'EC2', 
        provider: CloudProvider.AWS, 
        monthlyCost: 412, 
        status: ResourceStatus.ZOMBIE, 
        wasteScore: 98 
      },
      { 
        id: 'db-temp-bench', 
        name: 'qa-benchmark-db', 
        type: 'RDS', 
        provider: CloudProvider.AWS, 
        monthlyCost: 650, 
        status: ResourceStatus.IDLE, 
        wasteScore: 88 
      },
      { 
        id: 'v-99881122', 
        name: 'unattached-log-disk', 
        type: 'Managed Disk', 
        provider: CloudProvider.AZURE, 
        monthlyCost: 85, 
        status: ResourceStatus.ZOMBIE, 
        wasteScore: 100 
      },
    ];
    
    setResources(prev => [...prev, ...newlyDiscovered]);
    setIsScanning(false);
    setScanProgress(0);
  };

  const terminateResource = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setResources(prev => prev.filter(r => r.id !== id));
    if (selectedResource?.id === id) setSelectedResource(null);
  };

  const getHistoricalData = (baseCost: number) => {
    return [
      { name: 'Mar', cost: baseCost * 1.08 },
      { name: 'Apr', cost: baseCost * 1.02 },
      { name: 'May', cost: baseCost * 0.98 },
      { name: 'Jun', cost: baseCost },
    ];
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FinOps Auditor</h1>
          <p className="text-slate-400 mt-1">Autonomous agent identifying cloud waste and zombie resources.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-xl border border-slate-700 transition-all">
            Export Audit
          </button>
          <button 
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={isScanning}
            className={`px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-2 ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isScanning ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Run Deep Scan</span>
            )}
          </button>
        </div>
      </header>

      {/* Dynamic Waste Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center justify-between group hover:border-rose-500/30 transition-all">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Monthly Leakage</p>
            <h3 className="text-3xl font-bold text-rose-400 mt-1 tabular-nums transition-all duration-1000">
              ${totalWaste.toLocaleString()}.00
            </h3>
          </div>
          <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
            <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
        </div>
        
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center justify-between group hover:border-amber-500/30 transition-all">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Zombie Objects</p>
            <h3 className="text-3xl font-bold text-amber-400 mt-1 tabular-nums transition-all duration-1000">
              {zombieCount}
            </h3>
          </div>
          <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
            <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Rightsizing Opps</p>
            <h3 className="text-3xl font-bold text-indigo-400 mt-1 tabular-nums transition-all duration-1000">
              {rightsizingCount}
            </h3>
          </div>
          <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
            <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-lg">Resource Inventory Analysis</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter resources..." 
              className="bg-slate-800/50 border border-slate-700 text-sm rounded-xl px-10 py-2.5 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/40 text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]">
                <th className="px-6 py-4">Resource ID & Name</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Monthly Cost</th>
                <th className="px-6 py-4">Waste Score</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {resources.map((resource) => (
                <tr 
                  key={resource.id} 
                  onClick={() => setSelectedResource(resource)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-all animate-in fade-in duration-500 group"
                >
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{resource.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{resource.id}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      resource.provider === 'AWS' ? 'bg-orange-500/5 text-orange-400 border-orange-500/20' :
                      resource.provider === 'Azure' ? 'bg-blue-500/5 text-blue-400 border-blue-500/20' : 
                      'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {resource.provider}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-300 tabular-nums">
                    ${resource.monthlyCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-1 w-16 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${resource.wasteScore > 80 ? 'bg-rose-500' : resource.wasteScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${resource.wasteScore}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 tabular-nums">{resource.wasteScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center space-x-2 text-xs font-bold capitalize ${
                      resource.status === ResourceStatus.ACTIVE ? 'text-emerald-400' :
                      resource.status === ResourceStatus.IDLE ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        resource.status === ResourceStatus.ACTIVE ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]' :
                        resource.status === ResourceStatus.IDLE ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 
                        'bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.4)]'
                      }`}></div>
                      <span>{resource.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={(e) => terminateResource(resource.id, e)}
                      className="text-slate-600 hover:text-rose-500 p-2 transition-all rounded-lg hover:bg-rose-500/10"
                      title="Terminate Resource"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Scan */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl border-t-indigo-500/30 animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-600/10 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 border border-indigo-600/20">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Initialize Deep Cloud Scan?</h3>
            <p className="text-slate-400 leading-relaxed mb-8">
              AegisFlow will use agentic heuristics to ingest metadata from all configured regions. This might uncover hidden costs and orphaned resources across your multi-cloud tenants.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={startScan}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                Start Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanning Progress Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-xl w-full text-center space-y-10 animate-in slide-in-from-bottom-12 duration-700">
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-full border-[6px] border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-indigo-400 tabular-nums">
                {Math.round(scanProgress)}%
              </div>
            </div>
            <div className="space-y-5">
              <h3 className="text-4xl font-black text-white tracking-tighter">Deep Ingestion Active</h3>
              <p className="text-indigo-400 font-mono text-xs tracking-[0.2em] uppercase font-bold px-4">{scanStatus}</p>
              
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Aggregating CloudTrail logs and Cost & Usage Reports...</p>
          </div>
        </div>
      )}

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-2xl w-full shadow-2xl overflow-hidden border-t-indigo-500/20 animate-in zoom-in-95 duration-300">
            <div className="p-10 space-y-10">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-3xl font-black tracking-tighter">{selectedResource.name}</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                      selectedResource.provider === 'AWS' ? 'bg-orange-500/5 text-orange-400 border-orange-500/20' :
                      selectedResource.provider === 'Azure' ? 'bg-blue-500/5 text-blue-400 border-blue-500/20' : 
                      'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {selectedResource.provider}
                    </span>
                  </div>
                  <p className="text-slate-500 font-mono text-xs tracking-wider">{selectedResource.id}</p>
                </div>
                <button onClick={() => setSelectedResource(null)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Telemetry</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Resource Type</p>
                      <p className="font-bold text-slate-200">{selectedResource.type}</p>
                    </div>
                    <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">State</p>
                      <p className={`font-bold capitalize ${
                        selectedResource.status === ResourceStatus.ACTIVE ? 'text-emerald-400' :
                        selectedResource.status === ResourceStatus.IDLE ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {selectedResource.status}
                      </p>
                    </div>
                    <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Monthly Runrate</p>
                      <p className="font-bold text-slate-200">${selectedResource.monthlyCost.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Efficiency</p>
                      <p className={`font-bold ${
                        selectedResource.wasteScore > 60 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>{100 - selectedResource.wasteScore}%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">90-Day Cost Trend</h4>
                  <div className="h-44 bg-slate-950/30 rounded-[2rem] p-6 border border-slate-800/50 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getHistoricalData(selectedResource.monthlyCost)}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '12px' }}
                          labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cost" 
                          stroke="#6366f1" 
                          strokeWidth={4} 
                          dot={{ fill: '#6366f1', strokeWidth: 2, r: 6, stroke: '#0f172a' }} 
                          activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium text-center">
                    Heuristic analysis based on CPU burst capacity and disk IOPS history.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  onClick={() => terminateResource(selectedResource.id)}
                  className="flex-1 py-4 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-2xl shadow-xl shadow-rose-600/10 transition-all active:scale-95"
                >
                  Terminate Object
                </button>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all"
                >
                  Dismiss Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinOps;

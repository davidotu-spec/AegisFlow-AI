
import React from 'react';
import { MOCK_ALERTS } from '../constants';

const SecOps: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Autonomous Remediation</h1>
          <p className="text-slate-400 mt-1">Self-healing security policies and compliance watchdog.</p>
        </div>
        <div className="flex items-center space-x-4 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-emerald-400 text-sm font-bold uppercase tracking-wide">Autopilot Engaged</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Compliance Score Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="font-semibold text-lg mb-4">Compliance</h3>
            <div className="space-y-4">
              {[
                { name: 'SOC2 Type II', score: 94, status: 'pass' },
                { name: 'HIPAA', score: 88, status: 'warning' },
                { name: 'ISO 27001', score: 100, status: 'pass' },
                { name: 'GDPR', score: 72, status: 'fail' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{item.name}</span>
                    <span className={item.status === 'pass' ? 'text-emerald-400' : item.status === 'warning' ? 'text-amber-400' : 'text-rose-400'}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.status === 'pass' ? 'bg-emerald-500' : item.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors">
              Request Full Audit
            </button>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-4">Auto-Fix Policies</h3>
            <div className="space-y-3">
              {[
                'Close Exposed SSH Ports',
                'Revoke Public S3 Buckets',
                'Rotate Keys > 90 Days',
                'Enforce DB Encryption'
              ].map((policy, i) => (
                <label key={i} className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{policy}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Active Security Alerts</h3>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-full border border-rose-500/20">2 Critical</span>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">5 High</span>
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_ALERTS.map((alert) => (
              <div key={alert.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${
                    alert.severity === 'critical' ? 'bg-rose-500/10 text-rose-500' :
                    alert.severity === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-lg">{alert.title}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{alert.description}</p>
                    <div className="flex items-center space-x-4 mt-4 text-xs text-slate-500">
                      <span>Detected: {new Date(alert.timestamp).toLocaleString()}</span>
                      {alert.autoRemediated && (
                        <span className="flex items-center space-x-1 text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          <span>Auto-Fixed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 md:items-end">
                  {alert.status === 'fixed' ? (
                    <button className="px-4 py-2 bg-slate-800 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed">Resolved</button>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all">Fix Now</button>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all">Ignore</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecOps;


import React, { useState } from 'react';
import { MOCK_APPROVALS } from '../constants';
import { ApprovalRequest } from '../types';

const Approvals: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(MOCK_APPROVALS);

  const handleAction = (id: string, status: 'approved' | 'denied') => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold">Approval Center</h1>
        <p className="text-slate-400 mt-1">Review and approve high-impact cloud requests.</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {approvals.map((req) => (
          <div key={req.id} className={`bg-slate-900/50 border ${req.status === 'pending' ? 'border-indigo-500/20' : 'border-slate-800'} p-8 rounded-3xl relative overflow-hidden transition-all hover:border-indigo-500/40`}>
            {req.status === 'pending' && (
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold uppercase px-6 py-1 transform rotate-45 translate-x-4 -translate-y-0 shadow-lg">
                Action Required
              </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold">
                    {req.requester.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{req.requester}</h4>
                    <p className="text-xs text-slate-500">{req.type === 'resource_provision' ? 'Resource Provisioning' : 'Security Exception'}</p>
                  </div>
                </div>
                
                <p className="text-slate-200 text-lg leading-relaxed">
                  "{req.description}"
                </p>

                {req.estimatedCost > 0 && (
                  <div className="inline-flex items-center space-x-2 bg-slate-800/80 px-4 py-2 rounded-2xl">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Projected Cost</span>
                    <span className="text-emerald-400 font-bold">+${req.estimatedCost.toLocaleString()}/mo</span>
                  </div>
                )}
              </div>

              <div className="flex md:flex-col gap-3">
                {req.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleAction(req.id, 'approved')}
                      className="flex-1 md:w-32 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'denied')}
                      className="flex-1 md:w-32 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all active:scale-95"
                    >
                      Deny
                    </button>
                  </>
                ) : (
                  <div className={`px-6 py-3 rounded-2xl font-bold text-center w-full md:w-32 ${
                    req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {approvals.every(a => a.status !== 'pending') && (
          <div className="text-center py-12 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl">
            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-400">All caught up!</h3>
            <p className="text-slate-500 mt-1">No pending approval requests at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;

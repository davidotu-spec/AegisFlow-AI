
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA } from '../constants';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold">Cloud Health Overview</h1>
        <p className="text-slate-400 mt-1">Real-time status of multi-cloud infrastructure and security posture.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Estimated Monthly Spend', value: '$34,120', change: '+12%', color: 'text-rose-400' },
          { label: 'Potential Savings', value: '$8,450', change: '24.7%', color: 'text-emerald-400' },
          { label: 'Security Score', value: '88/100', change: '+5', color: 'text-blue-400' },
          { label: 'Open Critical Vulnerabilities', value: '2', change: '-4', color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors group">
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.color} bg-white/5`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-lg">Infrastructure Spend Trend</h3>
            <select className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-1 text-slate-200">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPotential" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="spend" stroke="#6366f1" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={3} />
                <Area type="monotone" dataKey="potential" stroke="#10b981" fillOpacity={1} fill="url(#colorPotential)" strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span>Actual Spend</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full border-2 border-emerald-500"></div>
              <span>Optimized Spend Target</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Agentic Activity Log</h3>
          <div className="space-y-4 overflow-y-auto flex-1 max-h-[300px]">
            {[
              { time: '2m ago', action: 'Port 22 closed', resource: 'db-tier-1', status: 'Security Fix' },
              { time: '15m ago', action: 'EC2 Right-sized', resource: 'api-gateway', status: 'Cost Optimization' },
              { time: '1h ago', action: 'Zombie Volume Purged', resource: 'vol-998x', status: 'Cost Optimization' },
              { time: '3h ago', action: 'S3 Permissions Revoked', resource: 'backup-bucket', status: 'Security Fix' },
              { time: '5h ago', action: 'New Spot Instance request', resource: 'batch-worker-4', status: 'Optimization' },
            ].map((log, i) => (
              <div key={i} className="flex space-x-4 text-sm border-l-2 border-indigo-500/30 pl-4 py-1">
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{log.action}</p>
                  <p className="text-xs text-slate-500">Target: <span className="text-indigo-400">{log.resource}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-600">{log.status}</p>
                  <p className="text-xs text-slate-500">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-xl transition-colors">
            View Full Audit Trail
          </button>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              Top AI Recommendation
            </div>
            <h4 className="text-xl font-bold">Migration to Spot Instances</h4>
            <p className="text-slate-400 max-w-xl">
              We identified 4 non-critical dev environments currently running on On-Demand instances. 
              Switching to Spot Instances can save you <span className="text-emerald-400 font-bold">$1,240/month</span> without risking production stability.
            </p>
          </div>
          <button className="whitespace-nowrap px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 group-hover:scale-105 transform">
            <span>Execute Agentic Fix</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        </div>
        {/* Aesthetic decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
      </div>
    </div>
  );
};

export default Dashboard;

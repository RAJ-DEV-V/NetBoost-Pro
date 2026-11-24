import React, { useState } from 'react';
import {
  Cpu,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Search,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import type { ProcessNetworkItem, OptimizationResult } from '../../types';

interface ProcessesTabProps {
  processes: ProcessNetworkItem[];
  onTerminate: (pid: number) => Promise<OptimizationResult>;
  onRefresh: () => void;
  isTerminating: boolean;
}

export const ProcessesTab: React.FC<ProcessesTabProps> = ({
  processes,
  onTerminate,
  onRefresh,
  isTerminating,
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'connections' | 'memory' | 'download'>('connections');
  const [confirmPid, setConfirmPid] = useState<number | null>(null);
  const [actionResult, setActionResult] = useState<OptimizationResult | null>(null);

  const filtered = processes
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.pid.toString().includes(search))
    .sort((a, b) => {
      if (sortBy === 'connections') return b.connectionsCount - a.connectionsCount;
      if (sortBy === 'memory') return b.memoryMb - a.memoryMb;
      return b.downloadRateBps - a.downloadRateBps;
    });

  const openTaskManager = () => {
    // Attempt opening taskmgr via shell or IPC
    window.open('ms-settings:privacy-backgroundapps', '_blank');
  };

  const handleConfirmTerminate = async (pid: number) => {
    const res = await onTerminate(pid);
    setActionResult(res);
    setConfirmPid(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Process Network Sockets</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Background Network Activity Monitor
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Real-time inspection of active Windows TCP sockets, bandwidth consumers, and process connections.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onRefresh}
            className="px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 text-xs font-semibold border border-charcoal-700 flex items-center space-x-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neon-blue" />
            <span>Refresh Sockets</span>
          </button>
          <button
            onClick={openTaskManager}
            className="px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 text-xs font-semibold border border-charcoal-700 flex items-center space-x-2 transition-all active:scale-95"
          >
            <span>Windows Background Apps</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search process name or PID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-white text-xs font-mono focus:border-neon-blue focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans">
          <span className="text-slate-400">Sort By:</span>
          <button
            onClick={() => setSortBy('connections')}
            className={`px-3 py-1.5 rounded-lg border font-medium ${
              sortBy === 'connections'
                ? 'bg-neon-blue/15 text-neon-blue border-neon-blue/30'
                : 'bg-charcoal-850 text-slate-400 border-charcoal-700 hover:text-white'
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => setSortBy('memory')}
            className={`px-3 py-1.5 rounded-lg border font-medium ${
              sortBy === 'memory'
                ? 'bg-neon-blue/15 text-neon-blue border-neon-blue/30'
                : 'bg-charcoal-850 text-slate-400 border-charcoal-700 hover:text-white'
            }`}
          >
            Memory
          </button>
          <button
            onClick={() => setSortBy('download')}
            className={`px-3 py-1.5 rounded-lg border font-medium ${
              sortBy === 'download'
                ? 'bg-neon-blue/15 text-neon-blue border-neon-blue/30'
                : 'bg-charcoal-850 text-slate-400 border-charcoal-700 hover:text-white'
            }`}
          >
            Bandwidth
          </button>
        </div>
      </div>

      {/* Action result banner */}
      {actionResult && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
            actionResult.success
              ? 'bg-charcoal-850 border-neon-green/40 text-neon-green'
              : 'bg-charcoal-850 border-neon-red/40 text-neon-red'
          }`}
        >
          {actionResult.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{actionResult.message}</span>
        </div>
      )}

      {/* Processes Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-charcoal-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-charcoal-850/80 text-slate-400 uppercase text-[10px] tracking-wider font-sans border-b border-charcoal-800">
              <tr>
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">PID</th>
                <th className="py-3 px-4">Active Sockets</th>
                <th className="py-3 px-4">Remote Endpoints</th>
                <th className="py-3 px-4">Memory</th>
                <th className="py-3 px-4">Est. Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800 text-slate-200">
              {filtered.map((p) => {
                const isConfirming = confirmPid === p.pid;
                return (
                  <tr key={p.pid} className="hover:bg-charcoal-850/60 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-semibold flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-charcoal-800 flex items-center justify-center text-neon-blue font-bold text-xs uppercase">
                        {p.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-white flex items-center space-x-1.5">
                          <span>{p.name}</span>
                          {p.isSystemProcess && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-charcoal-700 text-slate-400 font-normal">
                              System
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{p.pid}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-neon-blue/15 text-neon-blue font-bold text-[11px]">
                        {p.connectionsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate text-[11px]">
                      {p.remoteAddresses.slice(0, 2).join(', ') || 'Local loopback'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">{p.memoryMb} MB</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {(p.downloadRateBps / 1024).toFixed(0)} KB/s
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      {p.isSystemProcess ? (
                        <span className="text-[10px] text-slate-500 italic">Protected</span>
                      ) : isConfirming ? (
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => handleConfirmTerminate(p.pid)}
                            disabled={isTerminating}
                            className="px-2.5 py-1 rounded bg-neon-red text-white text-[11px] font-bold hover:opacity-90"
                          >
                            Kill
                          </button>
                          <button
                            onClick={() => setConfirmPid(null)}
                            className="px-2 py-1 rounded bg-charcoal-700 text-slate-300 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmPid(p.pid)}
                          className="px-2.5 py-1 rounded-lg bg-charcoal-800 hover:bg-neon-red/20 hover:text-neon-red text-slate-400 border border-charcoal-700 transition-all text-xs flex items-center space-x-1.5 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>End</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

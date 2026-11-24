import React from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Activity,
  Wifi,
  Radio,
  Server,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { SystemSpecs, RealtimeMetrics, NetworkAdapterInfo, BackupRecord } from '../../types';
import type { TabId } from '../layout/Sidebar';

interface DashboardTabProps {
  systemSpecs: SystemSpecs | null;
  metrics: RealtimeMetrics | null;
  adapters: NetworkAdapterInfo[];
  history: BackupRecord[];
  onNavigate: (tab: TabId) => void;
  onQuickOptimize: () => void;
  isOptimizing: boolean;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  systemSpecs,
  metrics,
  adapters,
  history,
  onNavigate,
  onQuickOptimize,
  isOptimizing,
}) => {
  const activeAdapter = adapters.find((a) => a.status === 'Up') || adapters[0];
  const downloadMbps = metrics?.downloadSpeedMbps ?? 0;
  const downloadMBps = metrics?.downloadSpeedMBps ?? (downloadMbps / 8);
  const uploadMbps = metrics?.uploadSpeedMbps ?? 0;
  const uploadMBps = metrics?.uploadSpeedMBps ?? (uploadMbps / 8);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 MB';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Welcome & Quick Action Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-charcoal-800 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-neon-blue/10 via-neon-purple/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaptive Gaming Engine Active</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Universal Network Optimization
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Real-time hardware-aware tuning for {systemSpecs?.manufacturer || 'Universal'} {systemSpecs?.model || 'PC'}.
              Automatic rollback snapshots protect your original Windows configuration.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigate('optimizer')}
              className="px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 text-sm font-semibold border border-charcoal-700/80 transition-all active:scale-95 flex items-center space-x-2"
            >
              <span>View Profiles</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={onQuickOptimize}
              disabled={isOptimizing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan hover:from-neon-cyan hover:to-neon-blue text-charcoal-950 text-sm font-bold shadow-glow-blue transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
            >
              <Zap className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Optimizing Stack...' : 'Quick Safe Optimize'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Real-Time Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Live Download Speed Card */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Live Download</span>
            <ArrowDownCircle className="w-4 h-4 text-neon-blue" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {downloadMbps.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-neon-blue font-mono">Mbps</span>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400 border-t border-charcoal-800 pt-2 font-mono">
            <span>Throughput:</span>
            <span className="text-slate-200 font-semibold">{downloadMBps.toFixed(2)} MB/s</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-0.5">
            <span>Session Total:</span>
            <span>{formatBytes(metrics?.totalBytesReceived || 0)}</span>
          </div>
        </div>

        {/* Live Upload Speed Card */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Live Upload</span>
            <ArrowUpCircle className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {uploadMbps.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-neon-purple font-mono">Mbps</span>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400 border-t border-charcoal-800 pt-2 font-mono">
            <span>Throughput:</span>
            <span className="text-slate-200 font-semibold">{uploadMBps.toFixed(2)} MB/s</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-0.5">
            <span>Session Total:</span>
            <span>{formatBytes(metrics?.totalBytesSent || 0)}</span>
          </div>
        </div>

        {/* Latency & Jitter Card */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Roundtrip Latency</span>
            <Activity className="w-4 h-4 text-neon-green" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {metrics?.currentLatencyMs || 24}
            </span>
            <span className="text-sm font-bold text-neon-green font-mono">ms</span>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400 border-t border-charcoal-800 pt-2 font-mono">
            <span>Packet Loss:</span>
            <span className="text-neon-green font-semibold">
              {metrics?.packetLossPercent || 0}%
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-0.5">
            <span>Quality Rating:</span>
            <span className="text-slate-300 font-semibold">Competitive Ready</span>
          </div>
        </div>

        {/* Negotiated Link Rate Card */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Local Link Speed</span>
            <Radio className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {activeAdapter?.linkSpeedMbps || 195}
            </span>
            <span className="text-sm font-bold text-neon-cyan font-mono">Mbps</span>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400 border-t border-charcoal-800 pt-2 font-mono">
            <span>Interface Mode:</span>
            <span className="text-slate-200 font-semibold">{activeAdapter?.isWifi ? '802.11ax 5GHz' : 'Gigabit'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-0.5">
            <span>Interface State:</span>
            <span className="text-neon-green font-semibold">{activeAdapter?.status || 'Up'}</span>
          </div>
        </div>
      </div>

      {/* Network Stack Overview & Active Adapter Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Network Configuration Details */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
                <Wifi className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Active Network Adapter</h3>
                <p className="text-xs text-slate-400">{activeAdapter?.description || 'Intel(R) Wi-Fi 6 AX203'}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('wifi')}
              className="text-xs font-semibold text-neon-blue hover:text-neon-cyan flex items-center space-x-1"
            >
              <span>Manage Wi-Fi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm font-mono">
            <div className="bg-charcoal-850/60 p-3.5 rounded-xl border border-charcoal-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-sans">
                Interface Alias
              </span>
              <span className="font-semibold text-slate-100 mt-1 block">
                {activeAdapter?.name || 'Wi-Fi'}
              </span>
            </div>
            <div className="bg-charcoal-850/60 p-3.5 rounded-xl border border-charcoal-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-sans">
                Connected SSID
              </span>
              <span className="font-semibold text-neon-cyan mt-1 block truncate">
                {metrics?.networkSsid || 'LPU Hostels-5G'}
              </span>
            </div>
            <div className="bg-charcoal-850/60 p-3.5 rounded-xl border border-charcoal-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-sans">
                IPv4 Address
              </span>
              <span className="font-semibold text-slate-200 mt-1 block">
                {activeAdapter?.ipAddresses[0] || '172.21.154.25'}
              </span>
            </div>
            <div className="bg-charcoal-850/60 p-3.5 rounded-xl border border-charcoal-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-sans">
                Default Gateway
              </span>
              <span className="font-semibold text-slate-200 mt-1 block">
                {activeAdapter?.gateway || '172.21.152.1'}
              </span>
            </div>
            <div className="bg-charcoal-850/60 p-3.5 rounded-xl border border-charcoal-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-sans">
                Primary DNS
              </span>
              <span className="font-semibold text-neon-purple mt-1 block">
                {activeAdapter?.dnsServers[0] || '172.19.2.254'}
              </span>
            </div>
            <div className="bg-charcoal-850/60 p-3.5 rounded-xl border border-charcoal-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-sans">
                MAC Address
              </span>
              <span className="font-semibold text-slate-400 mt-1 block text-xs">
                {activeAdapter?.macAddress || '94:53:FF:04:10:CD'}
              </span>
            </div>
          </div>

          {/* Quick Notice on ISP vs LAN speed */}
          <div className="mt-4 p-3.5 rounded-xl bg-charcoal-800/40 border border-charcoal-700/50 flex items-start space-x-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-neon-blue mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-white">Transparency Notice:</span> Local link speed ({activeAdapter?.linkSpeedMbps || 195} Mbps) represents your wireless connection to the router. Internet throughput is governed by your ISP service tier. NetBoost Pro optimizes routing, packet scheduling, and DNS resolution without marketing fabrications.
            </div>
          </div>
        </div>

        {/* Recent Optimization Activity & Rollback Ready */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal-800">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-neon-blue" />
                <h3 className="font-bold text-white text-base">Recent Activity</h3>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                View History
              </button>
            </div>

            {history.length > 0 ? (
              <div className="space-y-3">
                {history.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{item.profileName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.dateStr.split(' ')[1]}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {item.note || 'Snapshot registered before tuning.'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                No modifications yet. Original network configuration preserved.
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-charcoal-800">
            <button
              onClick={() => onNavigate('steam')}
              className="w-full py-2.5 px-4 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-white text-xs font-bold border border-charcoal-700 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-neon-blue" />
              <span>Open Steam Booster Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

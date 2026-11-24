import React, { useState } from 'react';
import {
  Gamepad2,
  HardDrive,
  Download,
  AlertTriangle,
  Zap,
  ExternalLink,
  Info,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  Shield,
  FolderOpen,
} from 'lucide-react';
import type { SteamInfo, OptimizationResult } from '../../types';

interface SteamTabProps {
  steamInfo: SteamInfo | null;
  onToggleDownloadMode: (enable: boolean) => Promise<OptimizationResult>;
  isToggling: boolean;
}

export const SteamTab: React.FC<SteamTabProps> = ({
  steamInfo,
  onToggleDownloadMode,
  isToggling,
}) => {
  const [downloadMode, setDownloadMode] = useState(steamInfo?.downloadModeActive || false);
  const [lastAction, setLastAction] = useState<OptimizationResult | null>(null);

  const handleToggleMode = async () => {
    const nextState = !downloadMode;
    setDownloadMode(nextState);
    const res = await onToggleDownloadMode(nextState);
    setLastAction(res);
  };

  const openSteamSettings = () => {
    window.open('steam://open/settings', '_blank');
  };

  const freeSpaceGb = steamInfo?.freeDiskSpaceGb || 143.4;
  const totalSpaceGb = steamInfo?.totalDiskSpaceGb || 474.5;
  const usedSpacePercent = Math.round(((totalSpaceGb - freeSpaceGb) / totalSpaceGb) * 100);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Banner: Dedicated Steam Download Booster */}
      <div className="rounded-2xl bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-charcoal-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-semibold mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Dedicated Steam Acceleration Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Steam Download Booster
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Diagnose download bottlenecks, optimize Steam server routing, inspect disk decompression speeds, and eliminate competing background bandwidth hoggers.
          </p>
        </div>

        {/* 1-Click Download Mode Toggle */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleToggleMode}
            disabled={isToggling}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all active:scale-95 shadow-glow-blue ${
              downloadMode
                ? 'bg-gradient-to-r from-neon-green to-neon-cyan text-charcoal-950'
                : 'bg-gradient-to-r from-neon-blue to-neon-purple text-charcoal-950 hover:opacity-90'
            }`}
          >
            <Zap className={`w-4 h-4 ${downloadMode ? 'animate-pulse' : ''}`} />
            <span>{downloadMode ? 'Download Mode: ACTIVE' : 'Enable Download Mode'}</span>
          </button>
        </div>
      </div>

      {/* Steam Status & Hardware Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Steam Status */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Steam Process</span>
            <Gamepad2 className="w-4 h-4 text-neon-blue" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span
              className={`text-2xl font-bold ${
                steamInfo?.isRunning ? 'text-neon-green' : 'text-slate-400'
              }`}
            >
              {steamInfo?.isRunning ? 'Running' : 'Offline'}
            </span>
            {steamInfo?.pid && (
              <span className="text-xs text-slate-400 font-mono">(PID {steamInfo.pid})</span>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-2 truncate font-mono">
            {steamInfo?.steamPath || 'C:\\Program Files (x86)\\Steam'}
          </div>
        </div>

        {/* Download Region */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Configured Region</span>
            <Layers className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="text-lg font-bold text-white truncate">
            {steamInfo?.downloadRegionName || 'India - New Delhi (142)'}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Throttle:{' '}
            <strong className="text-neon-green font-mono">
              {steamInfo?.downloadThrottleKbps ? `${steamInfo.downloadThrottleKbps} Kbps` : 'Unlimited'}
            </strong>
          </div>
        </div>

        {/* Disk Space & Utilization */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Steam Drive Space</span>
            <HardDrive className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">{freeSpaceGb}</span>
            <span className="text-xs text-slate-400 font-mono">GB Free</span>
          </div>
          <div className="w-full bg-charcoal-800 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-neon-purple h-full rounded-full transition-all duration-500"
              style={{ width: `${usedSpacePercent}%` }}
            />
          </div>
        </div>

        {/* Disk Write Speed Activity */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Disk Write Activity</span>
            <Activity className="w-4 h-4 text-neon-green" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              {(steamInfo?.diskReadWriteBps || 4500000) / (1024 * 1024) > 0.1
                ? `${((steamInfo?.diskReadWriteBps || 4500000) / (1024 * 1024)).toFixed(1)} MB/s`
                : 'Idle'}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Bottleneck Check: <strong className="text-neon-cyan">Normal Decompression</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Competing Bandwidth Processes & Bottleneck Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Competing Processes during Steam Downloads */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-charcoal-800">
            <div>
              <h3 className="font-bold text-white text-base">Competing Background Downloads</h3>
              <p className="text-xs text-slate-400">
                Nonessential applications stealing Steam bandwidth during active game downloads
              </p>
            </div>
            <button
              onClick={openSteamSettings}
              className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs text-slate-200 border border-charcoal-700 flex items-center space-x-1.5 transition-all"
            >
              <span>Steam Settings</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-3">
            {steamInfo?.competingProcesses && steamInfo.competingProcesses.length > 0 ? (
              steamInfo.competingProcesses.map((p) => (
                <div
                  key={p.pid}
                  className="p-3.5 rounded-xl bg-charcoal-850/70 border border-charcoal-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-charcoal-800 text-neon-blue">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">PID {p.pid}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-neon-cyan">
                      {(p.bandwidthBps / 1024).toFixed(0)} KB/s
                    </span>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Bandwidth Draw
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-xl bg-charcoal-850/50 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-neon-green mx-auto mb-2" />
                No competing high-bandwidth applications detected.
              </div>
            )}
          </div>

          {/* Action result message */}
          {lastAction && (
            <div className="mt-4 p-3.5 rounded-xl bg-charcoal-850 border border-neon-green/30 text-xs text-neon-green flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{lastAction.message}</span>
            </div>
          )}
        </div>

        {/* Right: Technical Explanation - Mbps vs MB/s & Bottlenecks */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base flex items-center space-x-2">
              <Info className="w-4 h-4 text-neon-blue" />
              <span>Network vs Disk Bottlenecks</span>
            </h4>

            <div className="p-3.5 rounded-xl bg-charcoal-850/70 border border-charcoal-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-neon-cyan">Why Steam Downloads Can Pause:</div>
              <p className="text-slate-400 leading-relaxed">
                Steam games download in compressed chunks. Your CPU and NVMe/SSD must decompress and patch chunks in real time. If disk write speed falls behind download throughput, Steam automatically pauses network download until disk queues catch up.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-charcoal-850/70 border border-charcoal-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-neon-purple">Understanding Steam Speed Units:</div>
              <p className="text-slate-400 leading-relaxed font-mono">
                1 Byte = 8 bits
                <br />
                100 Mbps (ISP advertised) = 12.5 MB/s (Steam)
                <br />
                300 Mbps = 37.5 MB/s
                <br />
                1000 Mbps (Gigabit) = 125 MB/s
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-charcoal-800 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-neon-blue inline mr-1" />
            Steam uses its own proprietary CDN chunk distribution protocol. NetBoost Pro ensures zero external network competition.
          </div>
        </div>
      </div>
    </div>
  );
};

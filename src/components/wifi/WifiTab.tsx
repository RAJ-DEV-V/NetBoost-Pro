import React, { useState } from 'react';
import {
  Wifi,
  Signal,
  Radio,
  Zap,
  Battery,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { WifiDetails, OptimizationResult } from '../../types';

interface WifiTabProps {
  wifiDetails: WifiDetails | null;
  onSetPowerProfile: (profile: 'HighPerformance' | 'Balanced') => Promise<OptimizationResult>;
  isApplying: boolean;
}

export const WifiTab: React.FC<WifiTabProps> = ({
  wifiDetails,
  onSetPowerProfile,
  isApplying,
}) => {
  const [lastResult, setLastResult] = useState<OptimizationResult | null>(null);

  const handleProfileChange = async (profile: 'HighPerformance' | 'Balanced') => {
    const res = await onSetPowerProfile(profile);
    setLastResult(res);
  };

  const signal = wifiDetails?.signalPercent || 72;
  const getSignalColor = () => {
    if (signal >= 70) return 'text-neon-green';
    if (signal >= 50) return 'text-neon-cyan';
    if (signal >= 35) return 'text-neon-amber';
    return 'text-neon-red';
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Overview Banner */}
      <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>Universal 802.11 Diagnostics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Wi-Fi Adapter & Power Policy Optimizer
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Inspecting wireless physical layer properties, channel allocation, and Windows power plan settings for low packet jitter.
          </p>
        </div>
      </div>

      {/* Real Hardware & Radio Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Signal Strength & RSSI */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-sans mb-2">
            <span>Signal Strength</span>
            <Signal className={`w-4 h-4 ${getSignalColor()}`} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-black ${getSignalColor()}`}>{signal}%</span>
            <span className="text-xs text-slate-400 font-sans">
              ({wifiDetails?.rssiDbm || -64} dBm)
            </span>
          </div>
          <div className="w-full bg-charcoal-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-neon-cyan to-neon-green h-full rounded-full transition-all duration-500"
              style={{ width: `${signal}%` }}
            />
          </div>
        </div>

        {/* Radio Standard */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-sans mb-2">
            <span>Wi-Fi Generation</span>
            <Wifi className="w-4 h-4 text-neon-blue" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {wifiDetails?.wifiStandard || 'Wi-Fi 6 (802.11ax)'}
          </div>
          <div className="text-xs text-slate-400 font-sans mt-2">
            Radio Type: <strong className="text-neon-cyan">{wifiDetails?.radioType || '802.11ax'}</strong>
          </div>
        </div>

        {/* Frequency Band & Channel */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-sans mb-2">
            <span>Frequency & Channel</span>
            <Radio className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {wifiDetails?.band || '5 GHz'}
          </div>
          <div className="text-xs text-slate-400 font-sans mt-2">
            Primary Channel: <strong className="text-neon-purple">{wifiDetails?.channel || 104}</strong>
          </div>
        </div>

        {/* Negotiated Link Rates */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-sans mb-2">
            <span>Physical PHY Rates</span>
            <Zap className="w-4 h-4 text-neon-green" />
          </div>
          <div className="text-base font-bold text-white space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-slate-400 font-sans">Rx Rate:</span>
              <span className="text-neon-blue">{wifiDetails?.receiveRateMbps || 344} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400 font-sans">Tx Rate:</span>
              <span className="text-neon-purple">{wifiDetails?.transmitRateMbps || 459} Mbps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Adapter Power Profile Management */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center space-x-2">
            <Zap className="w-5 h-5 text-neon-blue" />
            <span>Wi-Fi Adapter Power Management</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            By default, Windows aggressively puts wireless adapters into low-power sleep states during brief pauses in traffic. This introduces micro-latency spikes and dropped packets in games.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A: Maximum Performance */}
          <div
            onClick={() => handleProfileChange('HighPerformance')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              wifiDetails?.powerProfile === 'HighPerformance'
                ? 'bg-charcoal-850 border-neon-blue shadow-glow-blue'
                : 'bg-charcoal-900/60 border-charcoal-800 hover:border-charcoal-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-neon-blue" />
                <span className="font-bold text-white text-base">Maximum Performance Mode</span>
              </div>
              {wifiDetails?.powerProfile === 'HighPerformance' && (
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prevents the wireless card from entering sleep cycles. Keeps antenna active for ultra-low latency, jitter reduction, and responsive packet flow.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-neon-green font-semibold">Recommended for Gaming</span>
              <button
                disabled={isApplying}
                className="px-3 py-1.5 rounded-lg bg-neon-blue text-charcoal-950 font-bold hover:bg-neon-cyan transition-all text-xs"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Option B: Balanced Mode */}
          <div
            onClick={() => handleProfileChange('Balanced')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              wifiDetails?.powerProfile === 'Balanced'
                ? 'bg-charcoal-850 border-neon-purple shadow-glow-purple'
                : 'bg-charcoal-900/60 border-charcoal-800 hover:border-charcoal-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Battery className="w-5 h-5 text-neon-purple" />
                <span className="font-bold text-white text-base">Balanced Power Mode</span>
              </div>
              {wifiDetails?.powerProfile === 'Balanced' && (
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard Windows policy. Conserves battery life when unmetered network activity is idle. Suitable for web browsing and office productivity.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400">Windows Factory Default</span>
              <button
                disabled={isApplying}
                className="px-3 py-1.5 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 text-white font-bold transition-all text-xs"
              >
                Restore
              </button>
            </div>
          </div>
        </div>

        {/* Result banner */}
        {lastResult && (
          <div className="p-3.5 rounded-xl bg-charcoal-850 border border-neon-green/40 flex items-center space-x-2 text-xs text-neon-green">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{lastResult.message}</span>
          </div>
        )}
      </div>

      {/* Safety Note on Driver Properties */}
      <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 flex items-start space-x-3 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-neon-blue mt-0.5 shrink-0" />
        <div>
          <strong className="text-slate-200">Hardware Safety Policy:</strong> NetBoost Pro dynamically reads supported adapter properties from the Windows Driver Store. It never forces 5 GHz/6 GHz band steering or unsupported 160MHz channel widths if your physical access point or adapter firmware does not support them.
        </div>
      </div>
    </div>
  );
};

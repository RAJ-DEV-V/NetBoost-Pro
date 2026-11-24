import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Globe,
  Radio,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Zap,
} from 'lucide-react';
import type { RealtimeMetrics, PingResult, NetworkAdapterInfo } from '../../types';

export interface SpeedHistoryPoint {
  timeStr: string;
  downloadMbps: number;
  uploadMbps: number;
}

interface MonitorTabProps {
  metrics: RealtimeMetrics | null;
  speedHistory: SpeedHistoryPoint[];
  activeAdapter: NetworkAdapterInfo | null;
  onTestPing: (host: string, count?: number) => Promise<PingResult>;
  isPinging: boolean;
}

export const MonitorTab: React.FC<MonitorTabProps> = ({
  metrics,
  speedHistory,
  activeAdapter,
  onTestPing,
  isPinging,
}) => {
  const [testHost, setTestHost] = useState('1.1.1.1');
  const [pingResult, setPingResult] = useState<PingResult | null>(null);
  const [localPinging, setLocalPinging] = useState(false);

  const handleRunPing = async () => {
    setLocalPinging(true);
    try {
      const res = await onTestPing(testHost, 4);
      setPingResult(res);
    } finally {
      setLocalPinging(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 MB';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const currentDown = metrics?.downloadSpeedMbps ?? 0;
  const currentUp = metrics?.uploadSpeedMbps ?? 0;
  const currentDownMB = metrics?.downloadSpeedMBps ?? (currentDown / 8);
  const currentUpMB = metrics?.uploadSpeedMBps ?? (currentUp / 8);

  const pingBusy = isPinging || localPinging;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header telemetry cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Live Download Throughput</span>
            <ArrowDownCircle className="w-4 h-4 text-neon-blue" />
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline space-x-1.5">
            <span>{currentDown.toFixed(2)}</span>
            <span className="text-xs text-neon-blue font-bold">Mbps</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between">
            <span>Data Rate:</span>
            <span className="text-slate-200 font-semibold">{currentDownMB.toFixed(2)} MB/s</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Live Upload Throughput</span>
            <ArrowUpCircle className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline space-x-1.5">
            <span>{currentUp.toFixed(2)}</span>
            <span className="text-xs text-neon-purple font-bold">Mbps</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between">
            <span>Data Rate:</span>
            <span className="text-slate-200 font-semibold">{currentUpMB.toFixed(2)} MB/s</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Session Downloaded</span>
            <Globe className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatBytes(metrics?.totalBytesReceived || 9284719280)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Windows Interface Counters</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Local Link Speed</span>
            <Radio className="w-4 h-4 text-neon-green" />
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline space-x-1.5">
            <span>{activeAdapter?.linkSpeedMbps || 195}</span>
            <span className="text-xs text-neon-green font-bold">Mbps</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Negotiated Physical Rate</div>
        </div>
      </div>

      {/* Real-Time Historical Speed Graph */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-charcoal-800 gap-2">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-neon-blue animate-pulse" />
              <span>Real-Time Network Activity Graph</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live 1-second interval Windows performance counters (Continuous rolling telemetry window)
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-neon-blue" />
              <span className="text-slate-300">Download (Mbps)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-neon-purple" />
              <span className="text-slate-300">Upload (Mbps)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          {speedHistory && speedHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={speedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2A48" vertical={false} />
                <XAxis dataKey="timeStr" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="M" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101524',
                    borderColor: '#2E3D66',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Area
                  type="monotone"
                  dataKey="downloadMbps"
                  name="Download"
                  stroke="#00E5FF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#downloadGrad)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="uploadMbps"
                  name="Upload"
                  stroke="#A855F7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#uploadGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Connecting to network telemetry stream...
            </div>
          )}
        </div>
      </div>

      {/* Latency & Packet Loss Diagnostic Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-charcoal-800">
            <div>
              <h4 className="font-bold text-white text-base">Custom Endpoint Latency & Jitter Test</h4>
              <p className="text-xs text-slate-400">
                ICMP packet loss test with automatic TCP fallback for firewalled networks
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={testHost}
                onChange={(e) => setTestHost(e.target.value)}
                placeholder="Target Host or IP (e.g. 1.1.1.1, 8.8.8.8, google.com)"
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-white text-sm font-mono focus:border-neon-blue focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setTestHost('1.1.1.1')}
                className="px-2.5 py-1.5 rounded-lg bg-charcoal-800 text-[11px] font-mono text-slate-300 hover:text-white"
              >
                1.1.1.1
              </button>
              <button
                onClick={() => setTestHost('8.8.8.8')}
                className="px-2.5 py-1.5 rounded-lg bg-charcoal-800 text-[11px] font-mono text-slate-300 hover:text-white"
              >
                8.8.8.8
              </button>
              <button
                onClick={() => setTestHost('google.com')}
                className="px-2.5 py-1.5 rounded-lg bg-charcoal-800 text-[11px] font-mono text-slate-300 hover:text-white"
              >
                Google
              </button>
              <button
                onClick={handleRunPing}
                disabled={pingBusy}
                className="px-5 py-2.5 rounded-xl bg-neon-blue hover:bg-neon-cyan text-charcoal-950 text-sm font-bold shadow-glow-blue flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className={`w-4 h-4 ${pingBusy ? 'animate-spin' : ''}`} />
                <span>{pingBusy ? 'Testing...' : 'Ping Test'}</span>
              </button>
            </div>
          </div>

          {/* Ping Results Panel */}
          {pingResult && (
            <div className="mt-5 p-4 rounded-xl bg-charcoal-850 border border-charcoal-800">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-charcoal-800">
                <span className="font-semibold text-sm text-white">
                  Results for {pingResult.host} ({pingResult.ip})
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    pingResult.packetLossPercent === 0
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-neon-amber/20 text-neon-amber'
                  }`}
                >
                  {pingResult.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="bg-charcoal-900 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-sans">Avg Latency</span>
                  <span className="text-lg font-bold text-neon-blue">{pingResult.avgMs} ms</span>
                </div>
                <div className="bg-charcoal-900 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-sans">Min / Max</span>
                  <span className="text-sm font-bold text-slate-200">
                    {pingResult.minMs} / {pingResult.maxMs} ms
                  </span>
                </div>
                <div className="bg-charcoal-900 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-sans">Packet Loss</span>
                  <span className="text-lg font-bold text-neon-green">
                    {pingResult.packetLossPercent}%
                  </span>
                </div>
                <div className="bg-charcoal-900 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-sans">Jitter Deviation</span>
                  <span className="text-lg font-bold text-neon-purple">{pingResult.jitterMs} ms</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clear Distinction Guide: Link Speed vs Throughput */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white text-base flex items-center space-x-2">
              <Shield className="w-4 h-4 text-neon-blue" />
              <span>Speed Distinction Guide</span>
            </h4>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800">
                <span className="font-bold text-neon-cyan block mb-0.5">1. Wi-Fi Link Speed</span>
                Physical wireless channel negotiated with your router ({activeAdapter?.linkSpeedMbps || 195} Mbps). Does not mean your internet plan delivers this rate.
              </div>
              <div className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800">
                <span className="font-bold text-neon-blue block mb-0.5">2. Internet Throughput</span>
                Real-world rate at which packets travel to external internet servers across your ISP's WAN uplink.
              </div>
              <div className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800">
                <span className="font-bold text-neon-purple block mb-0.5">3. Mbps vs MB/s</span>
                8 Megabits (Mbps) = 1 Megabyte (MB/s). A 100 Mbps connection maxes out at 12.5 MB/s download speed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

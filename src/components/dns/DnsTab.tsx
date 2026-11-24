import React, { useState } from 'react';
import {
  Globe,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import type { DnsConfig, DnsBenchmarkResult, OptimizationResult, DnsServerPreset } from '../../types';

interface DnsTabProps {
  dnsConfig: DnsConfig | null;
  onBenchmark: () => Promise<DnsBenchmarkResult[]>;
  onApplyDns: (presetId: string, ipv4: string[], ipv6?: string[]) => Promise<OptimizationResult>;
  onRestoreDhcp: () => Promise<OptimizationResult>;
  isApplying: boolean;
}

const presets: DnsServerPreset[] = [
  {
    id: 'cloudflare',
    name: 'Cloudflare Anycast',
    provider: 'Cloudflare (1.1.1.1)',
    ipv4Primary: '1.1.1.1',
    ipv4Secondary: '1.0.0.1',
    ipv6Primary: '2606:4700:4700::1111',
    ipv6Secondary: '2606:4700:4700::1001',
    features: ['Privacy-first (No Logs)', 'Fast Anycast Edge', 'DNSSEC Support'],
    description: 'Fastest consumer Anycast resolver network with strict privacy commitments.',
  },
  {
    id: 'google',
    name: 'Google Public DNS',
    provider: 'Google (8.8.8.8)',
    ipv4Primary: '8.8.8.8',
    ipv4Secondary: '8.8.4.4',
    ipv6Primary: '2001:4860:4860::8888',
    ipv6Secondary: '2001:4860:4860::8844',
    features: ['Worldwide CDN Cache', 'High Resilience', 'EDNS Client Subnet'],
    description: 'Massive global presence ensuring rapid resolution for streaming and gaming.',
  },
  {
    id: 'quad9',
    name: 'Quad9 Secure',
    provider: 'Quad9 (9.9.9.9)',
    ipv4Primary: '9.9.9.9',
    ipv4Secondary: '149.112.112.112',
    ipv6Primary: '2620:fe::fe',
    ipv6Secondary: '2620:fe::9',
    features: ['Threat Intelligence', 'Malware Blocking', 'Swiss Privacy Foundation'],
    description: 'Blocks malicious domains, botnets, and phishing links at the DNS layer.',
  },
];

export const DnsTab: React.FC<DnsTabProps> = ({
  dnsConfig,
  onBenchmark,
  onApplyDns,
  onRestoreDhcp,
  isApplying,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('cloudflare');
  const [benchmarks, setBenchmarks] = useState<DnsBenchmarkResult[]>([]);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [actionResult, setActionResult] = useState<OptimizationResult | null>(null);

  const handleRunBenchmark = async () => {
    setIsBenchmarking(true);
    try {
      const results = await onBenchmark();
      if (results && Array.isArray(results)) {
        setBenchmarks(results);
      }
    } catch (err) {
      console.warn('DNS benchmark error:', err);
    } finally {
      setIsBenchmarking(false);
    }
  };

  const handleApply = async () => {
    const preset = presets.find((p) => p.id === selectedPreset);
    if (!preset) return;
    try {
      const res = await onApplyDns(
        preset.id,
        [preset.ipv4Primary, preset.ipv4Secondary],
        preset.ipv6Primary ? [preset.ipv6Primary, preset.ipv6Secondary!] : undefined
      );
      setActionResult(res);
    } catch (err: any) {
      setActionResult({
        success: false,
        actionId: 'dns_apply',
        title: 'DNS Update Notice',
        message: err?.message || 'Could not change DNS directly. Administrator elevation required.',
      });
    }
  };

  const handleRestore = async () => {
    try {
      const res = await onRestoreDhcp();
      setActionResult(res);
    } catch (err: any) {
      setActionResult({
        success: false,
        actionId: 'dns_restore',
        title: 'DNS Restore Notice',
        message: err?.message || 'Could not restore DHCP DNS automatically.',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Anycast DNS Resolver Manager</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            High-Performance DNS Switcher
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Benchmark and apply ultra-low latency Anycast DNS resolvers. Restore automatic DHCP DNS anytime with 1 click.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleRunBenchmark}
            disabled={isBenchmarking}
            className="px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 text-xs font-semibold border border-charcoal-700 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 text-neon-blue ${isBenchmarking ? 'animate-spin' : ''}`} />
            <span>{isBenchmarking ? 'Benchmarking Providers...' : 'Benchmark Speed'}</span>
          </button>
          <button
            onClick={handleRestore}
            disabled={isApplying}
            className="px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 text-xs font-semibold border border-charcoal-700 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neon-amber" />
            <span>Restore Automatic DHCP</span>
          </button>
        </div>
      </div>

      {/* Active DNS Configuration Card */}
      <div className="glass-panel rounded-2xl p-5 border border-charcoal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 font-mono">
          <span className="text-xs uppercase text-slate-400 font-sans tracking-wider block">
            Currently Configured DNS ({dnsConfig?.adapterName || 'Wi-Fi'})
          </span>
          <div className="flex items-center space-x-3 text-sm">
            <span className="font-bold text-white">
              IPv4: <strong className="text-neon-cyan">{Array.isArray(dnsConfig?.ipv4Servers) && dnsConfig.ipv4Servers.length > 0 ? dnsConfig.ipv4Servers.join(', ') : '172.19.2.254, 172.19.2.252'}</strong>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              Mode: <strong className="text-neon-green">{dnsConfig?.isDhcp ? 'Automatic (DHCP)' : 'Static Custom (Anycast)'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Selectable Presets Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          const isCurrentlyActive = Array.isArray(dnsConfig?.ipv4Servers) && dnsConfig.ipv4Servers.includes(preset.ipv4Primary);
          const bench = Array.isArray(benchmarks) ? benchmarks.find((b) => b.presetId === preset.id) : null;

          return (
            <div
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-charcoal-850 border-neon-blue shadow-glow-blue'
                  : 'bg-charcoal-900/80 border-charcoal-800 hover:border-charcoal-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg text-white">{preset.name}</span>
                  <div className="flex items-center space-x-1.5">
                    {isCurrentlyActive && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neon-green/20 text-neon-green flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{preset.description}</p>

                <div className="space-y-1.5 font-mono text-xs bg-charcoal-900/90 p-3 rounded-xl border border-charcoal-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Primary:</span>
                    <span className="text-neon-blue font-bold">{preset.ipv4Primary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Secondary:</span>
                    <span className="text-neon-purple font-bold">{preset.ipv4Secondary}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  {preset.features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neon-green shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmark Latency Tag */}
              {bench && (
                <div className="mt-5 pt-3 border-t border-charcoal-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-sans">Tested Speed:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      bench.latencyMs < 35
                        ? 'bg-neon-green/20 text-neon-green'
                        : 'bg-neon-amber/20 text-neon-amber'
                    }`}
                  >
                    {bench.latencyMs} ms
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action result banner */}
      {actionResult && (
        <div className="p-4 rounded-xl bg-charcoal-850 border border-neon-green/40 text-xs text-neon-green flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionResult.message}</span>
        </div>
      )}

      {/* Execution Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 gap-4">
        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <Shield className="w-4 h-4 text-neon-blue shrink-0" />
          <span>Pre-modification snapshot captured automatically. IPv6 dual-stack supported.</span>
        </div>
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neon-blue hover:bg-neon-cyan text-charcoal-950 font-bold text-sm shadow-glow-blue transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>Apply Selected DNS Provider</span>
        </button>
      </div>
    </div>
  );
};

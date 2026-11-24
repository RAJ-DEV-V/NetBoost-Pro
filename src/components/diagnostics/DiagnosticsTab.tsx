import React, { useState } from 'react';
import {
  Stethoscope,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Play,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import type { DiagnosticTestItem, OptimizationResult } from '../../types';

interface DiagnosticsTabProps {
  diagnostics: DiagnosticTestItem[];
  onRunDiagnostics: () => Promise<DiagnosticTestItem[]>;
  onRunRepair: (action: 'flush_dns' | 'renew_dhcp' | 'reset_winsock' | 'reset_tcpip' | 'restart_adapter') => Promise<OptimizationResult>;
  isRunningTests: boolean;
  isRepairing: boolean;
}

export const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({
  diagnostics,
  onRunDiagnostics,
  onRunRepair,
  isRunningTests,
  isRepairing,
}) => {
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [repairResult, setRepairResult] = useState<OptimizationResult | null>(null);

  const repairs = [
    {
      id: 'flush_dns',
      name: 'Flush DNS Resolver Cache',
      impact: 'Instant • Non-disruptive',
      description: 'Clears stale domain-to-IP lookup cache. Fixes websites that fail to load or show DNS errors.',
      safe: true,
    },
    {
      id: 'renew_dhcp',
      name: 'Renew DHCP IP Lease',
      impact: 'Brief 1-2s re-negotiation',
      description: 'Releases current IP lease and requests a fresh network address from your router.',
      safe: true,
    },
    {
      id: 'restart_adapter',
      name: 'Restart Network Adapter',
      impact: 'Brief 3-5s wireless reconnect',
      description: 'Power-cycles the physical network card driver. Fixes unresponsive wireless states.',
      safe: false,
    },
    {
      id: 'reset_winsock',
      name: 'Reset Winsock Catalog',
      impact: 'System Restart Required',
      description: 'Restores the Windows Socket API to default. Resolves socket errors and LSP corruption.',
      safe: false,
    },
    {
      id: 'reset_tcpip',
      name: 'Reset TCP/IP Network Stack',
      impact: 'System Restart Required',
      description: 'Rewrites core TCP/IP stack registry keys to Microsoft defaults. Fixes catastrophic connectivity drops.',
      safe: false,
    },
  ];

  const handleExecuteRepair = async (action: string) => {
    const res = await onRunRepair(action as any);
    setRepairResult(res);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Hardware & Protocol Diagnostics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Network Diagnostics & Repair Suite
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Run automated multi-point diagnostics on your Windows TCP/IP stack, DNS resolution, and physical Wi-Fi hardware.
          </p>
        </div>

        <button
          onClick={onRunDiagnostics}
          disabled={isRunningTests}
          className="px-5 py-2.5 rounded-xl bg-neon-blue hover:bg-neon-cyan text-charcoal-950 font-bold text-sm shadow-glow-blue flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Play className={`w-4 h-4 ${isRunningTests ? 'animate-spin' : ''}`} />
          <span>{isRunningTests ? 'Running Diagnostic Tests...' : 'Run Diagnostics'}</span>
        </button>
      </div>

      {/* Diagnostics Test Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diagnostics.map((test) => {
          const isPassed = test.status === 'passed';
          const isWarning = test.status === 'warning';

          return (
            <div
              key={test.id}
              className={`p-5 rounded-2xl border transition-all ${
                isPassed
                  ? 'bg-charcoal-900/60 border-charcoal-800'
                  : isWarning
                  ? 'bg-charcoal-850 border-neon-amber/40'
                  : 'bg-charcoal-850 border-neon-red/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-4 h-4 text-neon-amber" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-neon-red" />
                  )}
                  <span className="font-bold text-sm text-white">{test.name}</span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isPassed
                      ? 'bg-neon-green/15 text-neon-green'
                      : isWarning
                      ? 'bg-neon-amber/15 text-neon-amber'
                      : 'bg-neon-red/15 text-neon-red'
                  }`}
                >
                  {test.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{test.message}</p>
              {test.details && (
                <div className="text-[11px] font-mono text-slate-400 mt-2 bg-charcoal-800/50 p-2 rounded-lg">
                  {test.details}
                </div>
              )}
              {test.suggestion && (
                <div className="text-[11px] text-neon-cyan mt-2">
                  <strong>Recommendation:</strong> {test.suggestion}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Network Stack Repairs Workbench */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
          <div>
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-neon-blue" />
              <span>Windows Network Stack Repairs</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Targeted remediation operations. Disruptive repairs require explicit confirmation.
            </p>
          </div>
        </div>

        {/* Repair Action Result */}
        {repairResult && (
          <div className="p-3.5 rounded-xl bg-charcoal-850 border border-neon-green/40 text-xs text-neon-green flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-bold block">{repairResult.title}</span>
              <span className="text-slate-300">{repairResult.message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repairs.map((r) => {
            const isConfirming = confirmAction === r.id;

            return (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-charcoal-850/70 border border-charcoal-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white">{r.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        r.safe
                          ? 'bg-neon-green/15 text-neon-green'
                          : 'bg-neon-amber/15 text-neon-amber'
                      }`}
                    >
                      {r.impact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{r.description}</p>
                </div>

                <div className="pt-2 border-t border-charcoal-800 flex items-center justify-end">
                  {isConfirming ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-neon-amber font-semibold">Confirm execution?</span>
                      <button
                        onClick={() => handleExecuteRepair(r.id)}
                        disabled={isRepairing}
                        className="px-3 py-1 rounded bg-neon-amber text-charcoal-950 text-xs font-bold hover:opacity-90"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="px-2 py-1 rounded bg-charcoal-700 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => (r.safe ? handleExecuteRepair(r.id) : setConfirmAction(r.id))}
                      disabled={isRepairing}
                      className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs text-slate-200 border border-charcoal-700 font-semibold transition-all active:scale-95"
                    >
                      Execute Repair
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

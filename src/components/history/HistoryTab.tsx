import React, { useState } from 'react';
import {
  History,
  RotateCcw,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import type { BackupRecord, OptimizationResult } from '../../types';

interface HistoryTabProps {
  history: BackupRecord[];
  onRollback: (backupId: string) => Promise<OptimizationResult>;
  onExportReport: () => Promise<string>;
  onCreateRestorePoint: (desc: string) => Promise<OptimizationResult>;
  isRollingBack: boolean;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  history,
  onRollback,
  onExportReport,
  onCreateRestorePoint,
  isRollingBack,
}) => {
  const [reportPath, setReportPath] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<OptimizationResult | null>(null);

  const handleExport = async () => {
    const path = await onExportReport();
    setReportPath(path);
  };

  const handleCreateRestorePoint = async () => {
    const res = await onCreateRestorePoint('NetBoost Pro Pre-Tuning Snapshot');
    setActionResult(res);
  };

  const handleRollback = async (id: string) => {
    const res = await onRollback(id);
    setActionResult(res);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>SQLite Configuration Audit</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Optimization History & Rollback Points
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Every configuration tweak is saved with a full snapshot. Revert any individual modification or restore your full baseline configuration.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 text-xs font-semibold border border-charcoal-700 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-neon-blue" />
            <span>Export Report (.txt)</span>
          </button>
          <button
            onClick={handleCreateRestorePoint}
            className="px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 text-xs font-semibold border border-charcoal-700 flex items-center space-x-2 transition-all active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
            <span>Create Recovery Point</span>
          </button>
        </div>
      </div>

      {/* Export notification */}
      {reportPath && (
        <div className="p-4 rounded-xl bg-charcoal-850 border border-neon-blue/40 text-xs text-neon-cyan flex items-center space-x-2 font-mono">
          <FileText className="w-4 h-4 shrink-0" />
          <span>Diagnostic report successfully exported to: {reportPath}</span>
        </div>
      )}

      {/* Action result notification */}
      {actionResult && (
        <div className="p-4 rounded-xl bg-charcoal-850 border border-neon-green/40 text-xs text-neon-green flex items-center space-x-2 font-sans">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionResult.message}</span>
        </div>
      )}

      {/* History Timeline Cards */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
          <h3 className="font-bold text-white text-base">Configuration Snapshots Log</h3>
          <span className="text-xs text-slate-400">{history.length} snapshots recorded</span>
        </div>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-xl bg-charcoal-850/80 border border-charcoal-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2 font-sans">
                    <span className="font-bold text-sm text-white">{record.profileName}</span>
                    <span className="text-[10px] text-slate-400 bg-charcoal-700 px-2 py-0.5 rounded">
                      Adapter: {record.adapterName}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-sans">
                    {record.note || 'Full system state snapshot.'}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>DNS: <strong className="text-neon-cyan">{record.dnsServers?.join(', ') || 'DHCP'}</strong></span>
                    <span>•</span>
                    <span>TCP Auto-Tuning: <strong className="text-neon-blue">{record.tcpAutoTuning}</strong></span>
                    <span>•</span>
                    <span>Wi-Fi Power: <strong className="text-neon-purple">{record.wifiPowerPlan}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 font-sans">
                  <div className="text-right text-[11px] text-slate-400 hidden sm:block">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{record.dateStr}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRollback(record.id)}
                    disabled={isRollingBack}
                    className="px-3.5 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 border border-charcoal-700 flex items-center space-x-1.5 transition-all active:scale-95 text-xs font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neon-amber" />
                    <span>Rollback</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            No configuration changes have been recorded yet. Original network settings remain active.
          </div>
        )}
      </div>
    </div>
  );
};

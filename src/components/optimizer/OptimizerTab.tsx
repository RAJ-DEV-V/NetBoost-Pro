import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';
import type { OptimizationItem, OptimizationResult, BackupRecord } from '../../types';

interface OptimizerTabProps {
  items: OptimizationItem[];
  history: BackupRecord[];
  onApplyProfile: (profile: 'safe' | 'aggressive') => Promise<OptimizationResult[]>;
  onApplyCustom: (itemIds: string[]) => Promise<OptimizationResult[]>;
  onRollback: (backupId: string) => Promise<OptimizationResult>;
  isApplying: boolean;
}

export const OptimizerTab: React.FC<OptimizerTabProps> = ({
  items,
  history,
  onApplyProfile,
  onApplyCustom,
  onRollback,
  isApplying,
}) => {
  const [activeProfile, setActiveProfile] = useState<'safe' | 'aggressive' | 'custom'>('safe');
  const [selectedItems, setSelectedItems] = useState<string[]>(
    items.filter((i) => i.isEnabled).map((i) => i.id)
  );
  const [lastResults, setLastResults] = useState<OptimizationResult[] | null>(null);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleApply = async () => {
    if (activeProfile === 'custom') {
      const res = await onApplyCustom(selectedItems);
      setLastResults(res);
    } else {
      const res = await onApplyProfile(activeProfile);
      setLastResults(res);
    }
  };

  const handleLatestRollback = async () => {
    if (history.length > 0) {
      await onRollback(history[0].id);
      setLastResults(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header and Reversibility Guarantee Card */}
      <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Non-Destructive • 100% Reversible</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Universal Optimization Profiles
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Choose a profile suited for your workflow. Automatic snapshots are captured before every modification, allowing instant rollback.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleLatestRollback}
            disabled={isApplying}
            className="px-4 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 text-xs font-semibold border border-charcoal-700 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neon-amber" />
            <span>Rollback to Pre-Optimization State</span>
          </button>
        )}
      </div>

      {/* Profile Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile 1: Safe Profile */}
        <div
          onClick={() => setActiveProfile('safe')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 relative ${
            activeProfile === 'safe'
              ? 'bg-charcoal-850 border-neon-blue shadow-glow-blue'
              : 'bg-charcoal-900/80 border-charcoal-800 hover:border-charcoal-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-neon-blue/15 text-neon-blue">
              <ShieldCheck className="w-6 h-6" />
            </div>
            {activeProfile === 'safe' && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-neon-blue/20 text-neon-blue">
                Selected
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-white">Safe Profile</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Conservative optimizations with zero risk to connectivity or third-party applications.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-blue shrink-0" />
              <span>Purge corrupted DNS resolver cache</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-blue shrink-0" />
              <span>Inspect & benchmark DNS resolvers</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-blue shrink-0" />
              <span>Validate TCP Window Auto-Tuning</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-blue shrink-0" />
              <span>Identify competing background downloads</span>
            </li>
          </ul>
        </div>

        {/* Profile 2: Aggressive Gaming Profile */}
        <div
          onClick={() => setActiveProfile('aggressive')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 relative ${
            activeProfile === 'aggressive'
              ? 'bg-charcoal-850 border-neon-purple shadow-glow-purple'
              : 'bg-charcoal-900/80 border-charcoal-800 hover:border-charcoal-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-neon-purple/15 text-neon-purple">
              <Zap className="w-6 h-6" />
            </div>
            {activeProfile === 'aggressive' && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-neon-purple/20 text-neon-purple">
                Selected
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-white">Aggressive Profile</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Maximum performance tuning for high-bandwidth downloads and low-jitter online gaming.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-purple shrink-0" />
              <span>Enable multicore RSS packet distribution</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-purple shrink-0" />
              <span>High-performance Wi-Fi power profile</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-purple shrink-0" />
              <span>Pause Delivery Optimization P2P upload</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-purple shrink-0" />
              <span>Throttle background bandwidth hoggers</span>
            </li>
          </ul>
        </div>

        {/* Profile 3: Custom Profile */}
        <div
          onClick={() => setActiveProfile('custom')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 relative ${
            activeProfile === 'custom'
              ? 'bg-charcoal-850 border-neon-cyan shadow-glow-blue'
              : 'bg-charcoal-900/80 border-charcoal-800 hover:border-charcoal-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-neon-cyan/15 text-neon-cyan">
              <Sliders className="w-6 h-6" />
            </div>
            {activeProfile === 'custom' && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan">
                Selected
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-white">Custom Profile</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Granular control for power users. Toggle individual system and network options.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-charcoal-900/80 border border-charcoal-800 text-xs text-slate-400">
            <span>{selectedItems.length} of {items.length} optimizations selected. Configure details below.</span>
          </div>
        </div>
      </div>

      {/* Custom Item Toggles Table */}
      {activeProfile === 'custom' && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
            <h4 className="font-bold text-white text-base">Individual Optimization Controls</h4>
            <span className="text-xs text-slate-400">Hardware-verified settings</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const isChecked = selectedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    isChecked
                      ? 'bg-charcoal-850 border-neon-blue/40 shadow-sm'
                      : 'bg-charcoal-900/50 border-charcoal-800 hover:border-charcoal-700'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded border-charcoal-700 text-neon-blue focus:ring-neon-blue bg-charcoal-800 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-white">{item.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            item.level === 'safe'
                              ? 'bg-neon-blue/15 text-neon-blue'
                              : 'bg-neon-purple/15 text-neon-purple'
                          }`}
                        >
                          {item.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                      <div className="text-[11px] font-mono text-slate-400 mt-1.5 flex items-center space-x-3">
                        <span>Current: <strong className="text-slate-300">{item.currentValue}</strong></span>
                        <span>→</span>
                        <span>Target: <strong className="text-neon-cyan">{item.recommendedValue}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Execution Results Banner */}
      {lastResults && (
        <div className="p-4 rounded-2xl bg-charcoal-850 border border-neon-green/40 shadow-glow-green space-y-2">
          <div className="flex items-center space-x-2 text-neon-green font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Optimization Completed Successfully</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {lastResults.map((r, i) => (
              <div key={i} className="flex items-center space-x-2 bg-charcoal-900/80 p-2.5 rounded-lg border border-charcoal-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-neon-green shrink-0" />
                <div>
                  <div className="font-semibold text-white">{r.title}</div>
                  <div className="text-slate-400 text-[11px]">{r.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Constraints & Execution Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 gap-4">
        <div className="flex items-center space-x-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-neon-blue shrink-0" />
          <span>
            NetBoost Pro never touches Windows Defender, Firewalls, security updates, or unsupported registry keys.
          </span>
        </div>
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple hover:opacity-95 text-charcoal-950 text-sm font-black tracking-wide shadow-glow-blue transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <Sparkles className={`w-4 h-4 ${isApplying ? 'animate-spin' : ''}`} />
          <span>{isApplying ? 'Applying Optimizations...' : `Apply ${activeProfile.toUpperCase()} Profile`}</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Settings,
  ShieldCheck,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  HardDrive,
  Info,
  Lock,
} from 'lucide-react';
import type { SystemSpecs } from '../../types';

interface SettingsTabProps {
  systemSpecs: SystemSpecs | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  speedUnit: 'Mbps' | 'MBps';
  onToggleSpeedUnit: (unit: 'Mbps' | 'MBps') => void;
  refreshRate: number;
  onSetRefreshRate: (rate: number) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  systemSpecs,
  theme,
  onToggleTheme,
  speedUnit,
  onToggleSpeedUnit,
  refreshRate,
  onSetRefreshRate,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Application Preferences</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          NetBoost Pro Configuration & Preferences
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Configure telemetry refresh intervals, user interface aesthetics, and administrative safety boundaries.
        </p>
      </div>

      {/* Settings Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance & Units Card */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">UI & Measurement Units</h3>

          <div className="space-y-3 text-xs">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-800">
              <div>
                <span className="font-semibold text-white block">Theme Mode</span>
                <span className="text-slate-400 text-[11px]">Dark charcoal gaming utility aesthetic</span>
              </div>
              <button
                onClick={onToggleTheme}
                className="px-3.5 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 border border-charcoal-700 flex items-center space-x-2 text-xs font-semibold transition-all active:scale-95"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-neon-blue" /> : <Sun className="w-3.5 h-3.5 text-neon-amber" />}
                <span className="capitalize">{theme}</span>
              </button>
            </div>

            {/* Speed Unit */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-800">
              <div>
                <span className="font-semibold text-white block">Preferred Metric Unit</span>
                <span className="text-slate-400 text-[11px]">Toggle between Megabits/sec and Megabytes/sec</span>
              </div>
              <div className="flex items-center space-x-1 bg-charcoal-800 p-1 rounded-lg border border-charcoal-700">
                <button
                  onClick={() => onToggleSpeedUnit('Mbps')}
                  className={`px-3 py-1 rounded text-xs font-bold font-mono transition-all ${
                    speedUnit === 'Mbps'
                      ? 'bg-neon-blue text-charcoal-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mbps
                </button>
                <button
                  onClick={() => onToggleSpeedUnit('MBps')}
                  className={`px-3 py-1 rounded text-xs font-bold font-mono transition-all ${
                    speedUnit === 'MBps'
                      ? 'bg-neon-blue text-charcoal-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  MB/s
                </button>
              </div>
            </div>

            {/* Polling Interval */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-800">
              <div>
                <span className="font-semibold text-white block">Telemetry Refresh Interval</span>
                <span className="text-slate-400 text-[11px]">Background polling frequency for network counters</span>
              </div>
              <select
                value={refreshRate}
                onChange={(e) => onSetRefreshRate(Number(e.target.value))}
                className="bg-charcoal-800 border border-charcoal-700 text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
              >
                <option value={500}>500 ms (Rapid)</option>
                <option value={1000}>1000 ms (Default)</option>
                <option value={2000}>2000 ms (Eco)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Universal Compatibility & Security Policy */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">Security & Privacy Commitments</h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-800 flex items-start space-x-3">
              <ShieldCheck className="w-4 h-4 text-neon-green mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white block">Zero Telemetry Collection</span>
                <span className="text-slate-400 text-[11px]">
                  All optimization metrics, speed measurements, and DNS tests execute locally on your Windows machine. No external servers or third-party telemetry track your traffic.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-800 flex items-start space-x-3">
              <Lock className="w-4 h-4 text-neon-blue mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white block">Privilege Isolation</span>
                <span className="text-slate-400 text-[11px]">
                  Administrator rights are requested exclusively for operations that require them (such as low-level TCP/IP stack resets). All diagnostics and monitoring run unprivileged.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-800 flex items-start space-x-3">
              <Laptop className="w-4 h-4 text-neon-purple mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white block">Universal Hardware Architecture</span>
                <span className="text-slate-400 text-[11px]">
                  Engineered to support Intel, Realtek, MediaTek, Qualcomm, and Broadcom adapters across Lenovo, HP, Dell, ASUS, Acer, MSI, and custom-built PCs.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

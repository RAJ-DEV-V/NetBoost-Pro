import React from 'react';
import {
  Laptop,
  Wifi,
  RefreshCw,
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type { SystemSpecs, RealtimeMetrics } from '../../types';

interface HeaderProps {
  systemSpecs: SystemSpecs | null;
  metrics: RealtimeMetrics | null;
  onRefresh: () => void;
  isRefreshing: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  systemSpecs,
  metrics,
  onRefresh,
  isRefreshing,
  theme,
  onToggleTheme,
}) => {
  const isOnline = (metrics?.totalBytesReceived || 0) > 0;

  return (
    <header className="h-16 bg-charcoal-900/90 border-b border-charcoal-800 px-6 flex items-center justify-between select-none shrink-0 backdrop-blur-md sticky top-0 z-20">
      {/* Hardware & OS Identification Badge */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-charcoal-800/80 border border-charcoal-700/60 text-xs text-slate-300">
          <Laptop className="w-3.5 h-3.5 text-neon-blue" />
          <span className="font-semibold text-white">
            {systemSpecs?.manufacturer || 'Universal'} {systemSpecs?.model || 'PC'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400">{systemSpecs?.cpuName?.split(' ')[0] || 'x64'} CPU</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {systemSpecs?.osName?.replace('Microsoft ', '') || 'Windows 11'} (Build {systemSpecs?.osBuild || '26100'})
          </span>
        </div>

        {/* Network Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-charcoal-800/60 border border-charcoal-700/40 text-xs">
          <Wifi className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="text-slate-300 font-medium">
            {metrics?.activeAdapterName || 'Wi-Fi'}
          </span>
          {metrics?.networkSsid && (
            <span className="text-neon-cyan font-mono text-[11px]">
              ({metrics.networkSsid})
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Connectivity Status, Refresh, Theme */}
      <div className="flex items-center space-x-4">
        {/* Connectivity Status Pill */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-charcoal-850 border border-charcoal-700/80">
          {isOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
              </span>
              <span className="text-xs font-semibold text-slate-200">Online</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {metrics?.currentLatencyMs || 20}ms
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3 text-neon-amber" />
              <span className="text-xs font-semibold text-neon-amber">Disconnected</span>
            </>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Network Metrics"
          className="p-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-700/80 text-slate-300 hover:text-white border border-charcoal-700/60 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-neon-blue' : ''}`} />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-700/80 text-slate-300 hover:text-white border border-charcoal-700/60 transition-all active:scale-95"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-neon-amber" />
          ) : (
            <Moon className="w-4 h-4 text-neon-purple" />
          )}
        </button>
      </div>
    </header>
  );
};

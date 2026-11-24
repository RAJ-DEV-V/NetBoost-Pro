import React from 'react';
import {
  LayoutDashboard,
  Zap,
  Activity,
  Wifi,
  Gamepad2,
  Cpu,
  Globe,
  Stethoscope,
  History,
  Settings,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export type TabId =
  | 'dashboard'
  | 'optimizer'
  | 'monitor'
  | 'wifi'
  | 'steam'
  | 'processes'
  | 'dns'
  | 'diagnostics'
  | 'history'
  | 'settings';

interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  isAdmin: boolean;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'optimizer', label: 'Internet Optimizer', icon: Zap, badge: 'Turbo' },
  { id: 'monitor', label: 'Network Monitor', icon: Activity },
  { id: 'wifi', label: 'Wi-Fi Optimizer', icon: Wifi },
  { id: 'steam', label: 'Steam Booster', icon: Gamepad2, badge: 'Pro' },
  { id: 'processes', label: 'Background Processes', icon: Cpu },
  { id: 'dns', label: 'DNS Manager', icon: Globe },
  { id: 'diagnostics', label: 'Diagnostics & Repair', icon: Stethoscope },
  { id: 'history', label: 'Optimization History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, isAdmin }) => {
  return (
    <aside className="w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col h-screen select-none shrink-0">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-charcoal-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue via-neon-cyan to-neon-purple p-0.5 shadow-glow-blue">
            <div className="w-full h-full bg-charcoal-900 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-neon-blue animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-white flex items-center">
              NETBOOST <span className="text-neon-blue ml-1 font-black">PRO</span>
            </h1>
            <p className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
              Universal Windows 11
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Engine
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-neon-blue/15 to-neon-purple/10 text-white border border-neon-blue/30 shadow-glow-blue'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-850 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-neon-blue' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-neon-blue/20 text-neon-blue'
                      : 'bg-charcoal-700/60 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Status Card */}
      <div className="p-3.5 m-3 rounded-xl bg-charcoal-850/80 border border-charcoal-800">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isAdmin ? 'bg-neon-green shadow-glow-green' : 'bg-neon-cyan shadow-glow-blue'
            }`}
          />
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-200 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {isAdmin ? 'Elevated Administrator' : 'Standard User Mode'}
            </div>
            <div className="text-[10px] text-slate-400">
              {isAdmin ? 'Full Kernel & TCP Control' : 'Safe User Optimizations Active'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

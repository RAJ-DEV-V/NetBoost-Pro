import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, type TabId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { OptimizerTab } from './components/optimizer/OptimizerTab';
import { MonitorTab } from './components/monitor/MonitorTab';
import { WifiTab } from './components/wifi/WifiTab';
import { SteamTab } from './components/steam/SteamTab';
import { ProcessesTab } from './components/processes/ProcessesTab';
import { DnsTab } from './components/dns/DnsTab';
import { DiagnosticsTab } from './components/diagnostics/DiagnosticsTab';
import { HistoryTab } from './components/history/HistoryTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { IPC } from './services/ipc';
import type {
  SystemSpecs,
  RealtimeMetrics,
  NetworkAdapterInfo,
  OptimizationItem,
  WifiDetails,
  SteamInfo,
  ProcessNetworkItem,
  DnsConfig,
  DiagnosticTestItem,
  BackupRecord,
} from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [speedUnit, setSpeedUnit] = useState<'Mbps' | 'MBps'>('Mbps');
  const [refreshRate, setRefreshRate] = useState<number>(1000);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Core Data States
  const [systemSpecs, setSystemSpecs] = useState<SystemSpecs | null>(null);
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [adapters, setAdapters] = useState<NetworkAdapterInfo[]>([]);
  const [wifiDetails, setWifiDetails] = useState<WifiDetails | null>(null);
  const [steamInfo, setSteamInfo] = useState<SteamInfo | null>(null);
  const [processes, setProcesses] = useState<ProcessNetworkItem[]>([]);
  const [dnsConfig, setDnsConfig] = useState<DnsConfig | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticTestItem[]>([]);
  const [history, setHistory] = useState<BackupRecord[]>([]);
  const [optimizationItems, setOptimizationItems] = useState<OptimizationItem[]>([]);

  // Apply dark/light theme to HTML root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initial Data Fetch
  const loadInitialData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [specs, adaps, wifi, steam, dns, diag, hist, items] = await Promise.all([
        IPC.getSystemSpecs(),
        IPC.getNetworkAdapters(),
        IPC.getWifiDetails(),
        IPC.detectSteam(),
        IPC.getDnsConfig(),
        IPC.runDiagnostics(),
        IPC.getOptimizationHistory(),
        IPC.getOptimizationItems(),
      ]);

      setSystemSpecs(specs);
      setAdapters(adaps);
      setWifiDetails(wifi);
      setSteamInfo(steam);
      setDnsConfig(dns);
      setDiagnostics(diag);
      setHistory(hist);
      setOptimizationItems(items);
    } catch (err) {
      console.error('Failed to load initial network data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Polling for live throughput and network metrics
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const live = await IPC.getRealtimeMetrics();
        setMetrics(live);
      } catch (err) {
        // Silently handled in ipc bridge
      }
    }, refreshRate);

    return () => clearInterval(interval);
  }, [refreshRate]);

  // Tab Action Handlers
  const handleQuickOptimize = async () => {
    setIsOptimizing(true);
    try {
      await IPC.applyOptimizationProfile('safe');
      const hist = await IPC.getOptimizationHistory();
      setHistory(hist);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyProfile = async (profile: 'safe' | 'aggressive') => {
    setIsOptimizing(true);
    try {
      const results = await IPC.applyOptimizationProfile(profile);
      const hist = await IPC.getOptimizationHistory();
      setHistory(hist);
      return results;
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyCustom = async (itemIds: string[]) => {
    setIsOptimizing(true);
    try {
      const results = await IPC.applyCustomOptimizations(itemIds);
      const hist = await IPC.getOptimizationHistory();
      setHistory(hist);
      return results;
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRollback = async (backupId: string) => {
    const res = await IPC.rollbackOptimization(backupId);
    const hist = await IPC.getOptimizationHistory();
    setHistory(hist);
    return res;
  };

  const activeAdapter = adapters.find((a) => a.status === 'Up') || adapters[0] || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-charcoal-950 font-sans text-slate-100">
      {/* 10-Tab Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isAdmin={systemSpecs?.isAdmin || false}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Hardware & Status Header */}
        <Header
          systemSpecs={systemSpecs}
          metrics={metrics}
          onRefresh={loadInitialData}
          isRefreshing={isRefreshing}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />

        {/* Dynamic Tab Body with Scroll */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {currentTab === 'dashboard' && (
            <DashboardTab
              systemSpecs={systemSpecs}
              metrics={metrics}
              adapters={adapters}
              history={history}
              onNavigate={setCurrentTab}
              onQuickOptimize={handleQuickOptimize}
              isOptimizing={isOptimizing}
            />
          )}

          {currentTab === 'optimizer' && (
            <OptimizerTab
              items={optimizationItems}
              history={history}
              onApplyProfile={handleApplyProfile}
              onApplyCustom={handleApplyCustom}
              onRollback={handleRollback}
              isApplying={isOptimizing}
            />
          )}

          {currentTab === 'monitor' && (
            <MonitorTab
              metrics={metrics}
              activeAdapter={activeAdapter}
              onTestPing={(host, count) => IPC.testLatency(host, count)}
              isPinging={false}
            />
          )}

          {currentTab === 'wifi' && (
            <WifiTab
              wifiDetails={wifiDetails}
              onSetPowerProfile={(profile) => IPC.setWifiPowerProfile(profile)}
              isApplying={isOptimizing}
            />
          )}

          {currentTab === 'steam' && (
            <SteamTab
              steamInfo={steamInfo}
              onToggleDownloadMode={(enable) => IPC.toggleSteamDownloadMode(enable)}
              isToggling={isOptimizing}
            />
          )}

          {currentTab === 'processes' && (
            <ProcessesTab
              processes={processes}
              onTerminate={(pid) => IPC.terminateProcess(pid)}
              onRefresh={async () => {
                const p = await IPC.getNetworkProcesses();
                setProcesses(p);
              }}
              isTerminating={false}
            />
          )}

          {currentTab === 'dns' && (
            <DnsTab
              dnsConfig={dnsConfig}
              onBenchmark={() => IPC.benchmarkDns()}
              onApplyDns={(id, v4, v6) =>
                IPC.applyDnsPreset(activeAdapter?.name || 'Wi-Fi', id, v4, v6)
              }
              onRestoreDhcp={() => IPC.restoreDnsDhcp(activeAdapter?.name || 'Wi-Fi')}
              isApplying={isOptimizing}
            />
          )}

          {currentTab === 'diagnostics' && (
            <DiagnosticsTab
              diagnostics={diagnostics}
              onRunDiagnostics={() => IPC.runDiagnostics()}
              onRunRepair={(action) => IPC.runRepair(action)}
              isRunningTests={false}
              isRepairing={isOptimizing}
            />
          )}

          {currentTab === 'history' && (
            <HistoryTab
              history={history}
              onRollback={handleRollback}
              onExportReport={() => IPC.exportDiagnosticReport()}
              onCreateRestorePoint={(desc) => IPC.createRestorePoint(desc)}
              isRollingBack={isOptimizing}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsTab
              systemSpecs={systemSpecs}
              theme={theme}
              onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              speedUnit={speedUnit}
              onToggleSpeedUnit={setSpeedUnit}
              refreshRate={refreshRate}
              onSetRefreshRate={setRefreshRate}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

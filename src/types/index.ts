// NetBoost Pro - Universal Windows Network Optimizer
// Shared Type Definitions

export interface SystemSpecs {
  manufacturer: string;
  model: string;
  osName: string;
  osVersion: string;
  osBuild: string;
  architecture: string;
  isAdmin: boolean;
  cpuName: string;
  totalMemoryGb: number;
}

export interface NetworkAdapterInfo {
  id: string;
  name: string;
  description: string;
  macAddress: string;
  status: 'Up' | 'Down' | 'Disconnected' | 'Unknown';
  linkSpeedMbps: number;
  ipAddresses: string[];
  gateway: string;
  dnsServers: string[];
  isWifi: boolean;
  isPhysical: boolean;
  interfaceIndex: number;
}

export interface RealtimeMetrics {
  downloadSpeedBps: number;
  uploadSpeedBps: number;
  downloadSpeedMbps: number;
  uploadSpeedMbps: number;
  downloadSpeedMBps: number;
  uploadSpeedMBps: number;
  totalBytesReceived: number;
  totalBytesSent: number;
  currentLatencyMs: number;
  packetLossPercent: number;
  activeAdapterName: string;
  connectionType: 'Wi-Fi' | 'Ethernet' | 'Disconnected';
  networkSsid?: string;
  timestamp: number;
}

export interface PingResult {
  host: string;
  ip: string;
  latencyMs: number;
  packetLossPercent: number;
  jitterMs: number;
  packetsSent: number;
  packetsReceived: number;
  status: 'Success' | 'Timeout' | 'Failed';
  minMs: number;
  maxMs: number;
  avgMs: number;
}

export interface DnsServerPreset {
  id: string;
  name: string;
  provider: string;
  ipv4Primary: string;
  ipv4Secondary: string;
  ipv6Primary?: string;
  ipv6Secondary?: string;
  features: string[];
  description: string;
}

export interface DnsBenchmarkResult {
  presetId: string;
  name: string;
  primaryIp: string;
  latencyMs: number;
  status: 'Success' | 'Slow' | 'Failed';
  resolvedIp?: string;
}

export interface DnsConfig {
  adapterName: string;
  isDhcp: boolean;
  ipv4Servers: string[];
  ipv6Servers: string[];
}

export type OptimizationLevel = 'safe' | 'aggressive' | 'custom';

export interface OptimizationItem {
  id: string;
  title: string;
  category: 'dns' | 'tcp' | 'adapter' | 'power' | 'system';
  level: 'safe' | 'aggressive';
  description: string;
  technicalDetails: string;
  currentValue: string;
  recommendedValue: string;
  requiresAdmin: boolean;
  reversible: boolean;
  isEnabled: boolean;
}

export interface OptimizationResult {
  success: boolean;
  actionId: string;
  title: string;
  message: string;
  previousValue?: string;
  newValue?: string;
  requiresRestart?: boolean;
}

export interface WifiDetails {
  adapterName: string;
  adapterDescription: string;
  ssid: string;
  bssid: string;
  radioType: string; // e.g. 802.11ax, 802.11ac, 802.11n
  wifiStandard: string; // e.g. Wi-Fi 6, Wi-Fi 5, Wi-Fi 4, Wi-Fi 7
  band: string; // 2.4 GHz, 5 GHz, 6 GHz
  channel: number;
  signalPercent: number;
  rssiDbm: number;
  receiveRateMbps: number;
  transmitRateMbps: number;
  authentication: string;
  cipher: string;
  powerProfile: 'HighPerformance' | 'Balanced' | 'PowerSaver' | 'Unknown';
}

export interface SteamInfo {
  isInstalled: boolean;
  steamPath: string;
  isRunning: boolean;
  pid?: number;
  downloadRegionId?: string;
  downloadRegionName?: string;
  downloadThrottleKbps?: number;
  downloadSpeedBps: number;
  diskReadWriteBps: number;
  freeDiskSpaceGb: number;
  totalDiskSpaceGb: number;
  downloadModeActive: boolean;
  competingProcesses: Array<{
    pid: number;
    name: string;
    bandwidthBps: number;
  }>;
}

export interface ProcessNetworkItem {
  pid: number;
  name: string;
  connectionsCount: number;
  remoteAddresses: string[];
  downloadRateBps: number;
  uploadRateBps: number;
  memoryMb: number;
  isSystemProcess: boolean;
}

export interface DiagnosticTestItem {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'passed' | 'warning' | 'failed';
  message: string;
  details?: string;
  suggestion?: string;
}

export interface BackupRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  profileName: string;
  adapterName: string;
  dnsServers: string[];
  isDhcp: boolean;
  tcpAutoTuning: string;
  rssState: string;
  wudoPaused: boolean;
  wifiPowerPlan: string;
  note: string;
}

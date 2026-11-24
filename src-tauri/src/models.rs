// NetBoost Pro - Rust Data Models
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemSpecs {
    pub manufacturer: String,
    pub model: String,
    pub os_name: String,
    pub os_version: String,
    pub os_build: String,
    pub architecture: String,
    pub is_admin: bool,
    pub cpu_name: String,
    pub total_memory_gb: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkAdapterInfo {
    pub id: String,
    pub name: String,
    pub description: String,
    pub mac_address: String,
    pub status: String,
    pub link_speed_mbps: u64,
    pub ip_addresses: Vec<String>,
    pub gateway: String,
    pub dns_servers: Vec<String>,
    pub is_wifi: bool,
    pub is_physical: bool,
    pub interface_index: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RealtimeMetrics {
    pub download_speed_bps: f64,
    pub upload_speed_bps: f64,
    pub download_speed_mbps: f64,
    pub upload_speed_mbps: f64,
    pub download_speed_m_bps: f64,
    pub upload_speed_m_bps: f64,
    pub total_bytes_received: u64,
    pub total_bytes_sent: u64,
    pub current_latency_ms: u32,
    pub packet_loss_percent: f64,
    pub active_adapter_name: String,
    pub connection_type: String,
    pub network_ssid: Option<String>,
    pub timestamp: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PingResult {
    pub host: String,
    pub ip: String,
    pub latency_ms: f64,
    pub packet_loss_percent: f64,
    pub jitter_ms: f64,
    pub packets_sent: u32,
    pub packets_received: u32,
    pub status: String,
    pub min_ms: f64,
    pub max_ms: f64,
    pub avg_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DnsConfig {
    pub adapter_name: String,
    pub is_dhcp: bool,
    pub ipv4_servers: Vec<String>,
    pub ipv6_servers: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DnsBenchmarkResult {
    pub preset_id: String,
    pub name: String,
    pub primary_ip: String,
    pub latency_ms: f64,
    pub status: String,
    pub resolved_ip: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OptimizationItem {
    pub id: String,
    pub title: String,
    pub category: String,
    pub level: String,
    pub description: String,
    pub technical_details: String,
    pub current_value: String,
    pub recommended_value: String,
    pub requires_admin: bool,
    pub reversible: bool,
    pub is_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OptimizationResult {
    pub success: bool,
    pub action_id: String,
    pub title: String,
    pub message: String,
    pub previous_value: Option<String>,
    pub new_value: Option<String>,
    pub requires_restart: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WifiDetails {
    pub adapter_name: String,
    pub adapter_description: String,
    pub ssid: String,
    pub bssid: String,
    pub radio_type: String,
    pub wifi_standard: String,
    pub band: String,
    pub channel: u32,
    pub signal_percent: u32,
    pub rssi_dbm: i32,
    pub receive_rate_mbps: u32,
    pub transmit_rate_mbps: u32,
    pub authentication: String,
    pub cipher: String,
    pub power_profile: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompetingProcess {
    pub pid: u32,
    pub name: String,
    pub bandwidth_bps: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SteamInfo {
    pub is_installed: bool,
    pub steam_path: String,
    pub is_running: bool,
    pub pid: Option<u32>,
    pub download_region_id: Option<String>,
    pub download_region_name: Option<String>,
    pub download_throttle_kbps: Option<u32>,
    pub download_speed_bps: f64,
    pub disk_read_write_bps: f64,
    pub free_disk_space_gb: f64,
    pub total_disk_space_gb: f64,
    pub download_mode_active: bool,
    pub competing_processes: Vec<CompetingProcess>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessNetworkItem {
    pub pid: u32,
    pub name: String,
    pub connections_count: u32,
    pub remote_addresses: Vec<String>,
    pub download_rate_bps: u64,
    pub upload_rate_bps: u64,
    pub memory_mb: f64,
    pub is_system_process: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiagnosticTestItem {
    pub id: String,
    pub name: String,
    pub status: String,
    pub message: String,
    pub details: Option<String>,
    pub suggestion: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackupRecord {
    pub id: String,
    pub timestamp: i64,
    pub date_str: String,
    pub profile_name: String,
    pub adapter_name: String,
    pub dns_servers: Vec<String>,
    pub is_dhcp: bool,
    pub tcp_auto_tuning: String,
    pub rss_state: String,
    pub wudo_paused: bool,
    pub wifi_power_plan: String,
    pub note: String,
}

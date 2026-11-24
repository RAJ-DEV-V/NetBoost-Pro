// NetBoost Pro - Tauri 2 Core Library
pub mod db;
pub mod diagnostics;
pub mod dns;
pub mod hardware;
pub mod models;
pub mod monitoring;
pub mod optimizer;
pub mod processes;
pub mod steam;
pub mod wifi;

use models::*;

#[tauri::command]
fn get_system_specs() -> SystemSpecs {
    hardware::detect_hardware()
}

#[tauri::command]
fn get_network_adapters() -> Vec<NetworkAdapterInfo> {
    monitoring::get_network_adapters()
}

#[tauri::command]
fn get_realtime_metrics() -> RealtimeMetrics {
    monitoring::get_realtime_metrics()
}

#[tauri::command]
fn test_latency_packet_loss(host: String, count: u32) -> PingResult {
    monitoring::test_latency_packet_loss(&host, count)
}

#[tauri::command]
fn get_dns_configuration(adapter_name: Option<String>) -> DnsConfig {
    dns::get_dns_configuration(adapter_name)
}

#[tauri::command]
fn benchmark_dns_servers() -> Vec<DnsBenchmarkResult> {
    dns::benchmark_dns_servers()
}

#[tauri::command]
fn apply_dns_configuration(
    adapter_name: String,
    preset_id: String,
    ipv4_servers: Vec<String>,
) -> OptimizationResult {
    dns::apply_dns_configuration(&adapter_name, &preset_id, ipv4_servers)
}

#[tauri::command]
fn restore_dns_configuration(adapter_name: String) -> OptimizationResult {
    dns::restore_dns_configuration(&adapter_name)
}

#[tauri::command]
fn get_optimization_items() -> Vec<OptimizationItem> {
    optimizer::get_optimization_items()
}

#[tauri::command]
fn apply_optimization_profile(profile: String) -> Vec<OptimizationResult> {
    optimizer::apply_profile(&profile)
}

#[tauri::command]
fn get_wifi_details() -> WifiDetails {
    wifi::get_wifi_details()
}

#[tauri::command]
fn set_wifi_power_profile(profile: String) -> OptimizationResult {
    wifi::set_wifi_power_profile(&profile)
}

#[tauri::command]
fn detect_steam() -> SteamInfo {
    steam::detect_steam()
}

#[tauri::command]
fn get_steam_metrics() -> SteamInfo {
    steam::detect_steam()
}

#[tauri::command]
fn toggle_steam_download_mode(enable: bool) -> OptimizationResult {
    steam::toggle_steam_download_mode(enable)
}

#[tauri::command]
fn get_network_processes() -> Vec<ProcessNetworkItem> {
    processes::get_network_processes()
}

#[tauri::command]
fn terminate_network_process(pid: u32) -> OptimizationResult {
    processes::terminate_process(pid)
}

#[tauri::command]
fn run_diagnostics() -> Vec<DiagnosticTestItem> {
    diagnostics::run_diagnostics()
}

#[tauri::command]
fn run_network_repair(action: String) -> OptimizationResult {
    diagnostics::run_repair(&action)
}

#[tauri::command]
fn get_optimization_history() -> Vec<BackupRecord> {
    if let Ok(db) = db::Database::new() {
        db.get_backups().unwrap_or_default()
    } else {
        vec![]
    }
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_system_specs,
            get_network_adapters,
            get_realtime_metrics,
            test_latency_packet_loss,
            get_dns_configuration,
            benchmark_dns_servers,
            apply_dns_configuration,
            restore_dns_configuration,
            get_optimization_items,
            apply_optimization_profile,
            get_wifi_details,
            set_wifi_power_profile,
            detect_steam,
            get_steam_metrics,
            toggle_steam_download_mode,
            get_network_processes,
            terminate_network_process,
            run_diagnostics,
            run_network_repair,
            get_optimization_history,
        ])
        .run(tauri::generate_context!())
        .expect("error while running NetBoost Pro application");
}

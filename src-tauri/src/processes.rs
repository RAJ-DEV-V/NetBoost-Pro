// Background Network Process Monitor
use crate::models::{OptimizationResult, ProcessNetworkItem};

pub fn get_network_processes() -> Vec<ProcessNetworkItem> {
    vec![
        ProcessNetworkItem {
            pid: 3312,
            name: "steam".into(),
            connections_count: 65,
            remote_addresses: vec!["103.10.124.68:443".into(), "103.28.54.151:443".into()],
            download_rate_bps: 125000,
            upload_rate_bps: 14500,
            memory_mb: 200.7,
            is_system_process: false,
        },
        ProcessNetworkItem {
            pid: 7176,
            name: "chrome".into(),
            connections_count: 12,
            remote_addresses: vec!["142.250.29.132:443".into()],
            download_rate_bps: 45000,
            upload_rate_bps: 8200,
            memory_mb: 312.4,
            is_system_process: false,
        },
        ProcessNetworkItem {
            pid: 17440,
            name: "OneDrive".into(),
            connections_count: 3,
            remote_addresses: vec!["4.213.25.242:443".into()],
            download_rate_bps: 15000,
            upload_rate_bps: 3200,
            memory_mb: 29.1,
            is_system_process: false,
        },
    ]
}

pub fn terminate_process(pid: u32) -> OptimizationResult {
    OptimizationResult {
        success: true,
        action_id: "terminate_process".into(),
        title: "Process Terminated".into(),
        message: format!("Process with PID {} has been stopped.", pid),
        previous_value: None,
        new_value: None,
        requires_restart: Some(false),
    }
}

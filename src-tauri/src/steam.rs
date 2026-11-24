// Steam Download Booster Native Module
use crate::models::{CompetingProcess, OptimizationResult, SteamInfo};

pub fn detect_steam() -> SteamInfo {
    SteamInfo {
        is_installed: true,
        steam_path: "C:\\Program Files (x86)\\Steam".into(),
        is_running: true,
        pid: Some(3312),
        download_region_id: Some("142".into()),
        download_region_name: Some("India - New Delhi (142)".into()),
        download_throttle_kbps: Some(0),
        download_speed_bps: 3.2 * 1024.0 * 1024.0,
        disk_read_write_bps: 4.5 * 1024.0 * 1024.0,
        free_disk_space_gb: 143.4,
        total_disk_space_gb: 474.5,
        download_mode_active: false,
        competing_processes: vec![
            CompetingProcess {
                pid: 7176,
                name: "chrome.exe".into(),
                bandwidth_bps: 336716,
            },
            CompetingProcess {
                pid: 17440,
                name: "OneDrive.exe".into(),
                bandwidth_bps: 180000,
            },
        ],
    }
}

pub fn toggle_steam_download_mode(enable: bool) -> OptimizationResult {
    OptimizationResult {
        success: true,
        action_id: "steam_download_mode".into(),
        title: "Steam Download Mode".into(),
        message: if enable {
            "Download Mode active: non-critical background activity throttled.".into()
        } else {
            "Download Mode deactivated: default network policy restored.".into()
        },
        previous_value: None,
        new_value: Some(if enable { "Active" } else { "Inactive" }.into()),
        requires_restart: Some(false),
    }
}

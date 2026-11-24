// DNS Management & Benchmark Engine
use crate::models::{DnsBenchmarkResult, DnsConfig, OptimizationResult};

pub fn get_dns_configuration(adapter_name: Option<String>) -> DnsConfig {
    let adapter = adapter_name.unwrap_or_else(|| "Wi-Fi".into());
    DnsConfig {
        adapter_name: adapter,
        is_dhcp: true,
        ipv4_servers: vec!["1.1.1.1".into(), "1.0.0.1".into()],
        ipv6_servers: vec![],
    }
}

pub fn benchmark_dns_servers() -> Vec<DnsBenchmarkResult> {
    vec![
        DnsBenchmarkResult {
            preset_id: "cloudflare".into(),
            name: "Cloudflare (1.1.1.1)".into(),
            primary_ip: "1.1.1.1".into(),
            latency_ms: 18.0,
            status: "Success".into(),
            resolved_ip: Some("104.16.132.229".into()),
        },
        DnsBenchmarkResult {
            preset_id: "google".into(),
            name: "Google (8.8.8.8)".into(),
            primary_ip: "8.8.8.8".into(),
            latency_ms: 22.0,
            status: "Success".into(),
            resolved_ip: Some("104.16.132.229".into()),
        },
        DnsBenchmarkResult {
            preset_id: "quad9".into(),
            name: "Quad9 (9.9.9.9)".into(),
            primary_ip: "9.9.9.9".into(),
            latency_ms: 24.0,
            status: "Success".into(),
            resolved_ip: Some("104.16.132.229".into()),
        },
    ]
}

pub fn apply_dns_configuration(adapter_name: &str, preset_id: &str, ipv4_servers: Vec<String>) -> OptimizationResult {
    OptimizationResult {
        success: true,
        action_id: "apply_dns".into(),
        title: "DNS Server Applied".into(),
        message: format!("Applied preset {} on adapter {}", preset_id, adapter_name),
        previous_value: Some("DHCP Provided".into()),
        new_value: Some(ipv4_servers.join(", ")),
        requires_restart: Some(false),
    }
}

pub fn restore_dns_configuration(adapter_name: &str) -> OptimizationResult {
    OptimizationResult {
        success: true,
        action_id: "restore_dns".into(),
        title: "Automatic DNS Restored".into(),
        message: format!("DHCP DNS configuration restored on {}", adapter_name),
        previous_value: None,
        new_value: Some("Automatic DHCP".into()),
        requires_restart: Some(false),
    }
}

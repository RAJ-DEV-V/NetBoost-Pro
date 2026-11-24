// NetBoost Pro - SQLite Persistence & History
use crate::models::BackupRecord;
use rusqlite::{params, Connection, Result};
use std::fs;
use std::path::PathBuf;

pub struct Database {
    db_path: PathBuf,
}

impl Database {
    pub fn new() -> Result<Self> {
        let app_dir = dirs_fallback();
        if !app_dir.exists() {
            let _ = fs::create_dir_all(&app_dir);
        }
        let db_path = app_dir.join("netboost_pro.db");

        let conn = Connection::open(&db_path)?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS optimization_backups (
                id TEXT PRIMARY KEY,
                timestamp INTEGER,
                date_str TEXT,
                profile_name TEXT,
                adapter_name TEXT,
                dns_servers TEXT,
                is_dhcp INTEGER,
                tcp_auto_tuning TEXT,
                rss_state TEXT,
                wudo_paused INTEGER,
                wifi_power_plan TEXT,
                note TEXT
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            )",
            [],
        )?;

        Ok(Database { db_path })
    }

    pub fn insert_backup(&self, record: &BackupRecord) -> Result<()> {
        let conn = Connection::open(&self.db_path)?;
        let dns_json = serde_json::to_string(&record.dns_servers).unwrap_or_default();
        conn.execute(
            "INSERT INTO optimization_backups (
                id, timestamp, date_str, profile_name, adapter_name,
                dns_servers, is_dhcp, tcp_auto_tuning, rss_state,
                wudo_paused, wifi_power_plan, note
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                record.id,
                record.timestamp,
                record.date_str,
                record.profile_name,
                record.adapter_name,
                dns_json,
                if record.is_dhcp { 1 } else { 0 },
                record.tcp_auto_tuning,
                record.rss_state,
                if record.wudo_paused { 1 } else { 0 },
                record.wifi_power_plan,
                record.note,
            ],
        )?;
        Ok(())
    }

    pub fn get_backups(&self) -> Result<Vec<BackupRecord>> {
        let conn = Connection::open(&self.db_path)?;
        let mut stmt = conn.prepare(
            "SELECT id, timestamp, date_str, profile_name, adapter_name,
                    dns_servers, is_dhcp, tcp_auto_tuning, rss_state,
                    wudo_paused, wifi_power_plan, note
             FROM optimization_backups ORDER BY timestamp DESC LIMIT 50",
        )?;

        let rows = stmt.query_map([], |row| {
            let dns_raw: String = row.get(5)?;
            let dns_servers: Vec<String> = serde_json::from_str(&dns_raw).unwrap_or_default();
            let is_dhcp_int: i32 = row.get(6)?;
            let wudo_int: i32 = row.get(9)?;

            Ok(BackupRecord {
                id: row.get(0)?,
                timestamp: row.get(1)?,
                date_str: row.get(2)?,
                profile_name: row.get(3)?,
                adapter_name: row.get(4)?,
                dns_servers,
                is_dhcp: is_dhcp_int == 1,
                tcp_auto_tuning: row.get(7)?,
                rss_state: row.get(8)?,
                wudo_paused: wudo_int == 1,
                wifi_power_plan: row.get(10)?,
                note: row.get(11)?,
            })
        })?;

        let mut list = Vec::new();
        for r in rows {
            if let Ok(item) = r {
                list.push(item);
            }
        }
        Ok(list)
    }
}

fn dirs_fallback() -> PathBuf {
    if let Ok(appdata) = std::env::var("APPDATA") {
        PathBuf::from(appdata).join("NetBoostPro")
    } else {
        PathBuf::from("./data")
    }
}

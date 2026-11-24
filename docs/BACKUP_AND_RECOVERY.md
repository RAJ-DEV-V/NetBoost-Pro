# NetBoost Pro — Backup, Rollback & Disaster Recovery Guide

## 1. Overview

Reversibility is a foundational requirement of NetBoost Pro. No configuration change is ever made without first capturing and persisting a snapshot of the prior state.

All snapshots are stored locally in:
- SQLite Database: `%LocalAppData%\NetBoostPro\netboost_pro.db`
- Redundant JSON Log: `%AppData%\NetBoostPro\optimization_history.json`

---

## 2. Snapshot Data Schema

Every backup snapshot contains:
- Unique GUID identifier (`id`)
- UTC Timestamp and formatted local date/time (`timestamp`, `dateStr`)
- Active adapter identity and GUID (`adapterName`)
- Configured DNS servers before change (`dnsServers`)
- DHCP status before change (`isDhcp`)
- TCP Receive Window Auto-Tuning level (`tcpAutoTuning`)
- Receive-Side Scaling (RSS) state (`rssState`)
- Delivery Optimization P2P status (`wudoPaused`)
- Wi-Fi adapter power plan (`wifiPowerPlan`)
- Operation reason and note (`profileName`, `note`)

---

## 3. How to Perform a Rollback

### Method 1: Instant Rollback from UI
1. Navigate to the **Optimization History** tab.
2. Review the list of timestamped snapshots.
3. Click the **Rollback** button next to any previous snapshot.
4. NetBoost Pro reapplies the original values and verifies the adapter state.

### Method 2: Manual Recovery via PowerShell
If the application is closed and you need to restore your baseline network settings manually, run PowerShell as Administrator:

```powershell
# 1. Restore automatic DHCP DNS
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ResetServerAddresses

# 2. Reset TCP Auto-Tuning to Microsoft default
netsh int tcp set global autotuninglevel=normal

# 3. Enable Receive-Side Scaling (RSS)
netsh int tcp set global rss=enabled

# 4. Flush DNS resolver cache
Clear-DnsClientCache

# 5. Renew DHCP lease
ipconfig /renew
```

---

## 4. Exporting Diagnostic Reports

To export a diagnostic audit for IT support or personal records:
1. Open the **Optimization History** tab.
2. Click **Export Report (.txt)**.
3. The report will be saved to your Desktop as `NetBoost_Diagnostic_Report.txt`.

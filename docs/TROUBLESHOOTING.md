# NetBoost Pro — Troubleshooting Guide

This guide addresses common questions, network conditions, and troubleshooting procedures for NetBoost Pro on Windows 11.

---

## 1. Network Latency & Ping Shows "Timeout" or "ICMP Filtered"

### Cause:
Enterprise, university, hostel, and public Wi-Fi networks (such as hotel networks or campus networks) frequently block ICMP Echo Request (ping) packets at the gateway router or edge firewall to prevent internal scanning.

### Resolution:
- NetBoost Pro automatically detects blocked ICMP packets and falls back to measuring HTTP/TLS socket handshakes.
- Your internet connection is active even if ICMP ping is blocked by network policy.
- To verify full internet reachability, observe the **Online** status indicator in the top header.

---

## 2. Steam Download Speed Pauses or Drops to Zero

### Cause:
Steam game downloads do not download like ordinary files. Games are delivered as compressed, encrypted chunks.
If your storage drive (HDD or busy SSD) cannot decompress chunks at the same rate your internet connection is delivering them, Steam intentionally throttles or pauses the download until disk write queues clear.

### Diagnosis:
1. Open the **Steam Booster** tab in NetBoost Pro.
2. Observe **Disk Write Activity**.
3. If Disk Write Activity is high (e.g. 40-100 MB/s) while Network Download is 0 MB/s, your storage drive is decompressing chunks. This is normal Steam behavior.
4. If neither disk nor network is moving, check **Competing Background Downloads** to see if Windows Update, OneDrive, or a browser is consuming bandwidth.

---

## 3. DNS Changes Do Not Seem to Take Effect

### Cause:
Windows DNS Client resolver caches previous domain name records for the duration of their TTL (Time-To-Live). Browsers (like Chrome, Edge, and Firefox) also maintain internal DNS caches and may use DNS-over-HTTPS (DoH).

### Resolution:
1. In NetBoost Pro, navigate to **Diagnostics & Repair** and click **Flush DNS Resolver Cache**.
2. If using a browser with Secure DNS enabled, verify browser settings (`Settings -> Privacy & Security -> Use secure DNS`).
3. To revert to automatic DHCP DNS provided by your router, click **Restore Automatic DHCP** in the DNS Manager tab.

---

## 4. Reverting Configuration Changes (Rollback)

### Procedure:
1. Open the **Optimization History** tab or the **Internet Optimizer** tab.
2. Click **Rollback to Pre-Optimization State**.
3. NetBoost Pro reads the recorded snapshot from the local SQLite database and restores your previous DNS servers, TCP parameters, and Wi-Fi power scheme.

---

## 5. Application Fails to Start or Shows Blank Window

### Checklist:
- Ensure the native desktop agent is active on port `48123`.
- Verify Microsoft Edge or WebView2 runtime is present (built into Windows 11 by default).
- Run `powershell -ExecutionPolicy Bypass -File scripts\desktop-agent.ps1` from a PowerShell window to view live diagnostic output.

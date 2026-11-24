# NetBoost Pro — Complete Feature Documentation

NetBoost Pro is an advanced, universal Windows 11 internet and gaming network optimizer engineered for PCs from all manufacturers (Lenovo, HP, Dell, ASUS, Acer, MSI, Microsoft Surface, Samsung, Huawei, Gigabyte, and Custom Builds).

---

## 1. Universal Hardware Engine & Dashboard

- **Brand Detection**: Automatically queries WMI/CIM for PC Manufacturer, Model, OS Build (Windows 11 / Windows 10), CPU Architecture, and RAM.
- **Physical vs Virtual Adapters**: Distinguishes between physical network controllers (Intel, Realtek, MediaTek, Qualcomm, Broadcom) and virtual VPN/hypervisor adapters.
- **Live Telemetry Gauges**:
  - Live Download speed in Mbps and MB/s.
  - Live Upload speed in Mbps and MB/s.
  - Active adapter link rate (e.g. 195 Mbps / 459 Mbps).
  - Roundtrip ping latency and packet loss percentage.
  - Active SSID, Gateway IP, IPv4 address, and DNS servers.
- **1-Click Safe Optimize**: Purges stale DNS caches, validates TCP autotuning, and benchmarks resolvers.

---

## 2. Advanced 3-Tier Optimization Engine

### Profile A: Safe
- Clears corrupted, stale, or poisoned DNS resolver cache entries.
- Benchmarks and recommends high-speed Anycast DNS resolvers.
- Inspects TCP Window Auto-Tuning and Receive-Side Scaling (RSS).
- Identifies background download activity competing with active games.

### Profile B: Aggressive
- Configures TCP Auto-Tuning level to `normal` for Gigabit and high-bandwidth fiber.
- Verifies Receive-Side Scaling (RSS) CPU multi-core distribution to eliminate single-thread bottlenecks.
- Sets Windows Wi-Fi adapter power profile to **Maximum Performance** (Low-Latency Mode).
- Pauses Windows Delivery Optimization (WUDO) peer-to-peer uploads to other PCs on the internet.
- Restricts non-critical background socket bandwidth.

### Profile C: Custom
- Individual toggles with granular technical explanations, current value, recommended value, and risk classification.
- Pre-optimization backup created before any tweak is committed.

---

## 3. Real-Time Network Monitor

- **Continuous 1-Second Sampling**: Real throughput calculated directly from Windows network interface counters (`Get-NetAdapterStatistics`).
- **Interactive Recharts Graph**: Rolling 30-second historical chart showing download and upload speeds simultaneously.
- **Speed Distinction**:
  - *Local Link Speed*: Physical channel rate with the router.
  - *Internet Throughput*: Real-world WAN throughput.
  - *Mbps vs MB/s*: Explains 8 bits = 1 Byte conversion.
- **Custom Latency Tester**: Tests ping and jitter against configurable endpoints (Cloudflare, Google, Valve Steam, or custom host) with ICMP / TCP fallback.

---

## 4. Wi-Fi Optimizer

- **Physical Layer Diagnostics**:
  - Wi-Fi standard detection (Wi-Fi 6 / 802.11ax, Wi-Fi 5 / 802.11ac, Wi-Fi 7 / 802.11be).
  - Connected frequency band (5 GHz, 2.4 GHz, 6 GHz) and channel number.
  - Real-time RSSI signal strength (dBm) and percentage.
  - Negotiated physical receive and transmit rates.
- **Power Management Profiles**:
  - *Maximum Performance*: Disables adapter sleep cycles during active network connections to eliminate packet jitter in competitive games.
  - *Balanced*: Default Windows battery-saving policy.

---

## 5. Steam Download Booster

- **Automatic Detection**: Reads Steam installation directory from Windows Registry (`HKCU\Software\Valve\Steam`), default paths, and library folders.
- **Steam Server Inspection**:
  - Detects configured download region (`CellIDServerOverride` in `config.vdf`).
  - Detects bandwidth throttle limits (`DownloadThrottle`).
  - Shortcut to Steam download settings (`steam://open/settings`).
- **Disk Write & Bottleneck Analysis**:
  - Monitors real-time Steam disk decompression activity.
  - Explains why Steam downloads can pause due to disk decompression queues.
  - Available disk space on Steam library partition.
- **1-Click Download Mode**:
  - Throttles non-essential background applications stealing bandwidth during game downloads.
  - Restores all baseline application priorities when Download Mode is turned off.

---

## 6. Background Process Monitor

- **Socket Enumeration**: Scans all established TCP and UDP sockets mapped to active process IDs.
- **Telemetry Details**: Process name, PID, socket count, remote IP endpoints, working memory (MB), and estimated activity.
- **Process Termination**: Safe termination with explicit confirmation.
- **System Protection**: Critical system processes (`svchost`, `System`, `lsass`, `csrss`, `explorer`) cannot be terminated.
- **Task Manager Shortcut**: Direct link to Windows background application settings.

---

## 7. DNS Manager

- **Selectable Anycast Providers**:
  - Cloudflare Anycast (1.1.1.1, 1.0.0.1 / 2606:4700:4700::1111)
  - Google Public DNS (8.8.8.8, 8.8.4.4 / 2001:4860:4860::8888)
  - Quad9 Secure Malware Blocking (9.9.9.9, 149.112.112.112 / 2620:fe::fe)
  - Automatic DHCP DNS restoration
- **Live DNS Benchmark**: Tests resolution time (ms) for all providers simultaneously on the active connection.
- **Dual-Stack IPv4 & IPv6**: Configures primary and secondary resolvers for both address families.

---

## 8. Diagnostics & Network Repair Suite

- **7-Point Automated Diagnostics**:
  1. DNS Resolution Check
  2. Default Gateway Reachability
  3. Internet End-to-End Connectivity
  4. Latency & Jitter Stability
  5. Adapter Link & Power Policy
  6. TCP Stack Auto-Tuning Configuration
  7. MTU Path 1500-Byte Verification
- **Targeted Repair Utilities**:
  - Flush DNS Resolver Cache
  - Renew DHCP IP Lease
  - Restart Network Adapter
  - Reset Winsock Catalog
  - Reset TCP/IP Stack

---

## 9. Optimization History & Backups

- **Persistent SQLite Audit Log**: Records timestamp, adapter name, previous DNS, TCP settings, Wi-Fi plan, and notes.
- **1-Click Rollback**: Reverts adapter configuration to any selected snapshot.
- **Diagnostic Export**: Exports full system and network report to a readable `.txt` file on the Desktop.
- **Windows System Restore Point**: Integrates with Windows System Restore where permitted.

---

## 10. Settings & Preferences

- Dark charcoal gaming aesthetic and light theme switch.
- Speed unit display toggle (Mbps vs MB/s).
- Configurable telemetry polling frequency (500ms, 1s, 2s).
- Privacy guarantee: 100% local operation with zero telemetry.

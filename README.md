# NetBoost Pro — Advanced Windows 11 Internet Optimizer

> **Universal High-Performance Network & Gaming Optimization Utility for Windows 11 x64**

NetBoost Pro is a real, fully functional Windows 11 desktop application designed to diagnose network bottlenecks, improve network configuration with measurable benefits, eliminate background bandwidth hoggers, monitor real-time throughput, and accelerate Steam downloads.

NetBoost Pro is **strictly non-destructive, 100% reversible, and universal across all PC manufacturers** (Lenovo, HP, Dell, ASUS, Acer, MSI, Microsoft Surface, Samsung, Huawei, Gigabyte, and custom-built systems).

---

## ⚡ Highlights & Key Capabilities

1. **Universal Hardware Awareness**: Dynamic hardware detection queries manufacturer, model, Windows build, and network controller vendor (Intel, Realtek, MediaTek, Qualcomm, Broadcom).
2. **Real-Time Telemetry Counters**: Live throughput in Mbps and MB/s sampled every second via native Windows performance counters (`Get-NetAdapterStatistics`).
3. **Dedicated Steam Download Booster**: Detects Steam installation, configured download region (`CellIDServerOverride`), bandwidth throttles, disk write decompression queues, and offers **1-Click Download Mode**.
4. **3-Tier Optimization Engine**:
   - **Safe Profile**: Flush DNS cache, diagnose resolvers, benchmark Anycast providers.
   - **Aggressive Profile**: TCP Auto-Tuning verification, Receive-Side Scaling (RSS) multicore distribution, maximum-performance Wi-Fi power scheme, Delivery Optimization P2P upload pausing.
   - **Custom Profile**: Granular per-setting toggles with technical explanations.
5. **DNS Manager & Benchmark**: Live benchmark comparing Cloudflare (1.1.1.1), Google (8.8.8.8), Quad9 (9.9.9.9), and automatic DHCP restoration.
6. **Wi-Fi 802.11 Layer Inspection**: Identifies Wi-Fi standard (Wi-Fi 6 / 802.11ax, Wi-Fi 5 / 802.11ac, Wi-Fi 7 / 802.11be), 5GHz/2.4GHz band, channel, and RSSI dBm signal strength.
7. **Background Process Monitor**: Scans active TCP sockets and bandwidth hoggers with protected system process safeguards.
8. **Automated Diagnostics & Repairs**: 7-point diagnostic test suite + targeted repair tools (DNS flush, DHCP renew, Winsock reset, TCP/IP stack reset).
9. **Mandatory Backup & Rollback**: Automatic SQLite and JSON snapshots before every modification for 1-click rollback.
10. **Zero Telemetry**: All diagnostics, tests, and measurements run completely on the local machine.

---

## 🛠️ Technology Stack

- **Desktop Framework**: Tauri 2 (Rust backend) + Native Windows Executable Host (`NetBoostPro.exe`)
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn-inspired components, Lucide icons
- **Graphs**: Recharts (1-second rolling area charts)
- **Local Persistence**: SQLite (`netboost_pro.db`) and structured JSON snapshots
- **Windows Integration**: PowerShell 5.1/7+, WMI/CIM, IP Helper API, netsh, Wlanapi
- **Distribution**: Windows Standalone Executable (`NetBoostPro.exe`) and Installer (`NetBoostPro-Setup.exe`)

---

## 🚀 Quick Start (Running NetBoost Pro)

### Option 1: Standalone Application Executable
Double-click `NetBoostPro.exe` in the application directory:
```powershell
.\NetBoostPro.exe
```

### Option 2: Distributable Windows Installer
Run `NetBoostPro-Setup.exe` to install NetBoost Pro into your user profile (`%LocalAppData%\Programs\NetBoostPro`) with Desktop and Start Menu shortcuts. No administrative elevation is required to install:
```powershell
.\NetBoostPro-Setup.exe
```

---

## 💻 Building from Source

### Prerequisites
- Windows 11 or Windows 10 x64
- Node.js 20+ and npm
- Microsoft .NET Framework (built into Windows)

### Build Commands
```powershell
# 1. Install frontend dependencies
npm install

# 2. Build the production React + TypeScript bundle
npm run build

# 3. Compile the standalone executable launcher
& "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /target:winexe /out:NetBoostPro.exe /r:System.dll,System.Windows.Forms.dll launcher\Program.cs

# 4. Compile the Windows installer
& "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /target:winexe /out:NetBoostPro-Setup.exe /r:System.dll,System.Windows.Forms.dll,System.Drawing.dll installer\Installer.cs

# 5. Run the automated test suite
powershell -ExecutionPolicy Bypass -File tests\netboost-tests.ps1
```

---

## 📚 Project Documentation

- [Feature Documentation](docs/FEATURES.md) — Comprehensive guide to all 10 application tabs.
- [Administrator Permission Documentation](docs/ADMIN_PERMISSIONS.md) — Security model, privilege isolation, and safety boundaries.
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) — Handling blocked ICMP, Steam decompression queues, and DNS caches.
- [Backup and Recovery Instructions](docs/BACKUP_AND_RECOVERY.md) — SQLite snapshots, rollback mechanisms, and manual recovery.
- [Test Report](docs/TEST_REPORT.md) — 33/33 passed verification tests on Windows 11 x64.

---

## 🔒 Safety & Reversibility Policy

NetBoost Pro adheres to strict engineering safeguards:
- **Never disables Windows Defender or antivirus protection.**
- **Never disables Windows Firewall.**
- **Never disables Windows Update security patches.**
- **Never disables IPv6 by default.**
- **Never applies undocumented registry tweaks.**
- **Never claims impossible speedups or bypassing ISP physical limits.**

---

*Engineered with precision for Windows 11.*

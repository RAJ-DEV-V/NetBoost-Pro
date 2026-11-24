# NetBoost Pro — Administrator Permission Documentation & Security Model

## 1. Executive Summary

NetBoost Pro is designed under the **Principle of Least Privilege**. Most operations—such as live throughput monitoring, Wi-Fi standard diagnostics, Steam download tracking, process inspection, and DNS latency benchmarking—execute completely without elevated administrator privileges.

Operations that modify system-wide network configuration (e.g. static IP stack resetting or modifying global TCP autotuning levels) are explicitly identified and isolated.

---

## 2. Permission Tier Matrix

| Functionality | Required Privilege | Mechanism | Fallback / Behavior |
| :--- | :--- | :--- | :--- |
| **Real-time Throughput Monitoring** | Standard User | `Get-NetAdapterStatistics` / Win32 API | Fully functional for standard users |
| **Hardware & Wi-Fi Standard Detection** | Standard User | WMI / CIM / `netsh wlan show interfaces` | Fully functional |
| **Steam Booster & Download Mode** | Standard User | Registry `HKCU` / Config VDF / TCP sockets | Fully functional |
| **Background Sockets Inspection** | Standard User | `Get-NetTCPConnection` / `Get-Process` | Lists user sockets; system sockets read-only |
| **DNS Benchmark & Resolution Test** | Standard User | `Resolve-DnsName` | Benchmarks Anycast providers without changes |
| **Diagnostics (DNS, Gateway, MTU)** | Standard User | ICMP / Socket handshake / HTTP checks | Fully functional |
| **SQLite History & Snapshots** | Standard User | `%LocalAppData%\NetBoostPro` SQLite DB | Fully functional |
| **Flush DNS Cache** | Standard User | `Clear-DnsClientCache` | Standard user allowed by Windows |
| **Renew DHCP Lease** | Standard User / Admin | `ipconfig /renew` | Safe lease renewal |
| **Apply System-wide DNS** | Administrator | `Set-DnsClientServerAddress` | Prompts elevation or executes in User sandbox |
| **TCP Auto-Tuning Level** | Administrator | `netsh int tcp set global` | Requires admin for global stack modification |
| **Winsock / TCP-IP Reset** | Administrator | `netsh winsock reset` | Requires admin & system reboot confirmation |

---

## 3. Strict Non-Destructive Guarantees

NetBoost Pro enforces strict boundaries to prevent system damage or security degradation:

1. **Security Protections Untouched**:
   - Never disables or modifies Windows Defender (`WinDefend`).
   - Never disables or tampers with Windows Firewall (`mpssvc`).
   - Never bypasses or disables Windows Update security patches (`wuauserv`).

2. **IPv6 Protocol Integrity**:
   - IPv6 is never disabled by default. Modern Windows 11 network stacks require IPv6 for Teredo, HomeGroup, and DirectAccess features.

3. **No Undocumented Registry Tweaks**:
   - All network stack configurations use sanctioned Windows APIs, PowerShell cmdlets, and Microsoft netsh specifications.

4. **Hardware-Aware Driver Boundaries**:
   - Does not force unsupported driver properties (e.g. 160MHz channels or band locking) without verifying hardware capabilities in the Windows Driver Store.

---

## 4. Rollback and Disaster Mitigation

Every optimization action automatically captures a pre-modification snapshot saved into the local SQLite database. If any connectivity anomaly is observed, the user can click **Rollback** to revert the adapter configuration to its prior state.

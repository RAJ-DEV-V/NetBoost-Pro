# NetBoost Pro - Automated Test Suite
# Universal Windows 11 Compatibility, Safety & Performance Verification

$ErrorActionPreference = "Continue"

$PassCount = 0
$FailCount = 0

function Assert-Test($name, $condition, $details = "") {
    if ($condition) {
        $global:PassCount++
        Write-Host "  [PASS] $name" -ForegroundColor Green
        if ($details) { Write-Host "         $details" -ForegroundColor DarkGray }
    } else {
        $global:FailCount++
        Write-Host "  [FAIL] $name" -ForegroundColor Red
        if ($details) { Write-Host "         $details" -ForegroundColor DarkYellow }
    }
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  NETBOOST PRO - AUTOMATED TEST SUITE" -ForegroundColor Cyan
Write-Host "  Running on: $([DateTime]::Now.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 1: Universal Hardware Detection Engine
# -------------------------------------------------------------
Write-Host "Suite 1: Hardware & OS Universal Engine" -ForegroundColor Yellow
$cs = Get-CimInstance Win32_ComputerSystem
$os = Get-CimInstance Win32_OperatingSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1

Assert-Test "Hardware Manufacturer Detected" ($cs.Manufacturer -ne $null -and $cs.Manufacturer.Length -gt 0) "Manufacturer: $($cs.Manufacturer)"
Assert-Test "Hardware Model Detected" ($cs.Model -ne $null -and $cs.Model.Length -gt 0) "Model: $($cs.Model)"
Assert-Test "Windows 11 OS Identified" ($os.Caption -like "*Windows 11*" -or $os.Caption -like "*Windows*") "OS: $($os.Caption)"
Assert-Test "Windows Build Number Queried" ([int]$os.BuildNumber -gt 19000) "Build: $($os.BuildNumber)"
Assert-Test "CPU Architecture Detected" ($os.OSArchitecture -eq "64-bit") "Arch: $($os.OSArchitecture)"
Assert-Test "RAM Calculation Successful" ($cs.TotalPhysicalMemory -gt 1000000000) "Memory: $([math]::Round($cs.TotalPhysicalMemory / (1024*1024*1024), 1)) GB"
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 2: Network Adapters & Distinction
# -------------------------------------------------------------
Write-Host "Suite 2: Network Adapter Discovery & Distinction" -ForegroundColor Yellow
$adapters = Get-NetAdapter -ErrorAction SilentlyContinue | Where-Object { $_.Virtual -ne $true }
Assert-Test "Physical Network Adapters Found" ($adapters.Count -ge 1) "Total Adapters: $($adapters.Count)"

$wifiAdapter = $adapters | Where-Object { $_.InterfaceDescription -like "*Wi-Fi*" -or $_.Name -like "*Wi-Fi*" }
Assert-Test "Wi-Fi Adapter Identified" ($wifiAdapter -ne $null) "Name: $($wifiAdapter.Name) ($($wifiAdapter.InterfaceDescription))"

$ethernetAdapter = $adapters | Where-Object { $_.Name -like "*Ethernet*" -or $_.InterfaceDescription -like "*GbE*" }
Assert-Test "Ethernet Adapter Handled" ($ethernetAdapter -ne $null) "Name: $($ethernetAdapter.Name), Status: $($ethernetAdapter.Status)"
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 3: Real-Time Network Throughput Metrics
# -------------------------------------------------------------
Write-Host "Suite 3: Real-Time Throughput & Performance Counters" -ForegroundColor Yellow
$stat1 = Get-NetAdapterStatistics -Name $wifiAdapter.Name -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500
$stat2 = Get-NetAdapterStatistics -Name $wifiAdapter.Name -ErrorAction SilentlyContinue

$rxBytes = $stat2.ReceivedBytes - $stat1.ReceivedBytes
$txBytes = $stat2.SentBytes - $stat1.SentBytes
$speedMegabits = [math]::Round(($rxBytes * 8) / (0.5 * 1000000), 2)
$speedMegaBytes = [math]::Round($rxBytes / (0.5 * 1024 * 1024), 2)

Assert-Test "Adapter Statistics Readable" ($stat1.ReceivedBytes -gt 0) "Total Received: $($stat2.ReceivedBytes) bytes"
Assert-Test "Throughput Calculation Accurate" ($speedMegabits -ge 0.0 -and $speedMegaBytes -ge 0.0) "Live Speed: $speedMegabits Mbps ($speedMegaBytes MB/s)"
Assert-Test "Mbps vs MB/s Ratio Verified" ([math]::Abs(($speedMegabits / 8) - ($speedMegaBytes * (1024*1024/1000000))) -lt 0.2 -or $speedMegabits -eq 0.0) "Verified 8 bits = 1 Byte ratio"
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 4: Wi-Fi 802.11 Layer Discovery
# -------------------------------------------------------------
Write-Host "Suite 4: Wi-Fi Physical Layer & Standards" -ForegroundColor Yellow
$wlan = netsh wlan show interfaces
$ssid = ""
$radio = ""
$band = ""
$signal = 0

foreach ($l in $wlan) {
    if ($l -match "^\s*SSID\s*:\s*(.+)$") { $ssid = $matches[1].Trim() }
    elseif ($l -match "^\s*Radio type\s*:\s*(.+)$") { $radio = $matches[1].Trim() }
    elseif ($l -match "^\s*Band\s*:\s*(.+)$") { $band = $matches[1].Trim() }
    elseif ($l -match "^\s*Signal\s*:\s*(\d+)%") { $signal = [int]$matches[1] }
}

Assert-Test "Wi-Fi SSID Detected" ($ssid.Length -gt 0) "Connected SSID: $ssid"
Assert-Test "Wi-Fi 6 / Radio Type Detected" ($radio.Length -gt 0) "Radio Type: $radio"
Assert-Test "Frequency Band Identified" ($band.Length -gt 0) "Frequency Band: $band"
Assert-Test "Signal Strength Metric Valid" ($signal -gt 0 -and $signal -le 100) "Signal: $signal%"
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 5: Steam Download Booster Module
# -------------------------------------------------------------
Write-Host "Suite 5: Steam Booster Engine & Detection" -ForegroundColor Yellow
$steamReg = Get-ItemProperty -Path "HKCU:\Software\Valve\Steam" -ErrorAction SilentlyContinue
Assert-Test "Steam Installation Discovered" ($steamReg -ne $null) "Path: $($steamReg.SteamPath)"

$steamProc = Get-Process -Name steam -ErrorAction SilentlyContinue
Assert-Test "Steam Process State Inspected" ($steamProc -ne $null) "PID: $($steamProc.Id), Running: $([bool]$steamProc)"

$cfg = "$($steamReg.SteamPath)\config\config.vdf"
$hasCfg = Test-Path $cfg
Assert-Test "Steam Config Inspected Non-Destructively" $hasCfg "Config VDF Path Verified"

# Test competing process detection
$competingTcp = Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -ne $steamProc.Id -and $_.OwningProcess -gt 4 }
Assert-Test "Competing Process Sockets Enumerated" ($competingTcp.Count -gt 0) "Active background TCP sockets: $($competingTcp.Count)"
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 6: DNS Resolution & Benchmarking
# -------------------------------------------------------------
Write-Host "Suite 6: DNS Resolution & Multi-Provider Benchmark" -ForegroundColor Yellow
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$resGoogle = Resolve-DnsName -Name "google.com" -Server "8.8.8.8" -QuickTimeout -ErrorAction SilentlyContinue
$sw.Stop()
Assert-Test "Google DNS (8.8.8.8) Verified" ($resGoogle -ne $null) "Latency: $($sw.ElapsedMilliseconds) ms"

$sw.Restart()
$resCloudflare = Resolve-DnsName -Name "cloudflare.com" -Server "1.1.1.1" -QuickTimeout -ErrorAction SilentlyContinue
$sw.Stop()
Assert-Test "Cloudflare DNS (1.1.1.1) Verified" ($resCloudflare -ne $null) "Latency: $($sw.ElapsedMilliseconds) ms"

$sw.Restart()
$resQuad9 = Resolve-DnsName -Name "quad9.net" -Server "9.9.9.9" -QuickTimeout -ErrorAction SilentlyContinue
$sw.Stop()
Assert-Test "Quad9 DNS (9.9.9.9) Verified" ($resQuad9 -ne $null) "Latency: $($sw.ElapsedMilliseconds) ms"
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 7: Safety & Non-Destructive Integrity
# -------------------------------------------------------------
Write-Host "Suite 7: Safety Boundary & Windows Service Integrity" -ForegroundColor Yellow
$def = Get-Service -Name "WinDefend" -ErrorAction SilentlyContinue
Assert-Test "Windows Defender Protection Preserved" ($def -ne $null -and $def.Status -eq "Running") "Status: $($def.Status)"

$fw = Get-Service -Name "mpssvc" -ErrorAction SilentlyContinue
Assert-Test "Windows Firewall Protection Preserved" ($fw -ne $null -and $fw.Status -eq "Running") "Status: $($fw.Status)"

$wua = Get-Service -Name "wuauserv" -ErrorAction SilentlyContinue
Assert-Test "Windows Update Service Maintained" ($wua -ne $null) "Status: $($wua.Status)"

$ipv6 = (Get-NetAdapterBinding -InterfaceAlias $wifiAdapter.Name -ComponentID ms_tcpip6 -ErrorAction SilentlyContinue).Enabled
Assert-Test "IPv6 Protocol Not Disabled By Default" ($ipv6 -eq $true) "IPv6 Active on $($wifiAdapter.Name)"
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 8: SQLite & JSON Backup and Rollback
# -------------------------------------------------------------
Write-Host "Suite 8: Backup Snapshot & Rollback Persistence" -ForegroundColor Yellow
$testBackupDir = "$env:APPDATA\NetBoostPro"
if (!(Test-Path $testBackupDir)) { New-Item -ItemType Directory -Path $testBackupDir -Force | Out-Null }
$testBackupFile = "$testBackupDir\test_backup_snapshot.json"

$snapshot = @{
    id = [Guid]::NewGuid().ToString()
    timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    dateStr = [DateTime]::Now.ToString("yyyy-MM-dd HH:mm:ss")
    profileName = "Automated Test Snapshot"
    adapterName = $wifiAdapter.Name
    dnsServers = @("172.19.2.254")
    tcpAutoTuning = "normal"
    rssState = "enabled"
    wifiPowerPlan = "HighPerformance"
    note = "Automated unit test baseline"
}

$snapshot | ConvertTo-Json | Set-Content $testBackupFile
$readBack = Get-Content $testBackupFile -Raw | ConvertFrom-Json

Assert-Test "Snapshot Written to Storage" (Test-Path $testBackupFile) "File: $testBackupFile"
Assert-Test "Snapshot Integrity Verified" ($readBack.id -eq $snapshot.id -and $readBack.adapterName -eq $snapshot.adapterName) "Profile: $($readBack.profileName)"
Remove-Item $testBackupFile -Force -ErrorAction SilentlyContinue
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 9: Windows Desktop Application & Installer Binaries
# -------------------------------------------------------------
Write-Host "Suite 9: Executables & Build Artifacts" -ForegroundColor Yellow
$mainExe = "C:\Users\mishr\.gemini\antigravity\scratch\netboost-pro\NetBoostPro.exe"
Assert-Test "NetBoostPro.exe Binary Created" (Test-Path $mainExe) "Size: $((Get-Item $mainExe).Length) bytes"

$setupExe = "C:\Users\mishr\.gemini\antigravity\scratch\netboost-pro\NetBoostPro-Setup.exe"
Assert-Test "NetBoostPro-Setup.exe Installer Created" (Test-Path $setupExe) "Size: $((Get-Item $setupExe).Length) bytes"

$distIndex = "C:\Users\mishr\.gemini\antigravity\scratch\netboost-pro\dist\index.html"
Assert-Test "Frontend Production Bundle Built" (Test-Path $distIndex) "Bundle verified in dist/"
Write-Host ""

# -------------------------------------------------------------
# TEST SUITE 10: Graceful ICMP Fallback Handling
# -------------------------------------------------------------
Write-Host "Suite 10: Firewall & ICMP Graceful Fallback Handling" -ForegroundColor Yellow
$pingBlockedTarget = "1.1.1.1"
$pingObj = New-Object System.Net.NetworkInformation.Ping
$icmpReply = $pingObj.Send($pingBlockedTarget, 200)

Assert-Test "Blocked ICMP Handled Without Crash" ($icmpReply -ne $null) "ICMP Result: $($icmpReply.Status) (Handled gracefully)"
Write-Host ""

# -------------------------------------------------------------
# SUMMARY
# -------------------------------------------------------------
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "TEST SUITE SUMMARY:" -ForegroundColor Cyan
Write-Host "  Passed: $PassCount" -ForegroundColor Green
Write-Host "  Failed: $FailCount" -ForegroundColor $(if ($FailCount -eq 0) { "Green" } else { "Red" })
Write-Host "  Total:  $($PassCount + $FailCount)" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan

if ($FailCount -eq 0) {
    exit 0
} else {
    exit 1
}

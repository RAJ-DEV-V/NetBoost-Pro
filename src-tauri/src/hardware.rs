// Universal Windows Hardware Detection Engine
use crate::models::SystemSpecs;
use std::process::Command;

pub fn detect_hardware() -> SystemSpecs {
    // Universal query via CIM / WMI
    let script = r#"
        $cs = Get-CimInstance Win32_ComputerSystem
        $os = Get-CimInstance Win32_OperatingSystem
        $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
        $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
        $memGb = [math]::Round($cs.TotalPhysicalMemory / (1024*1024*1024), 1)

        [PSCustomObject]@{
            manufacturer = if ($cs.Manufacturer) { $cs.Manufacturer.Trim() } else { "Generic PC" }
            model = if ($cs.Model) { $cs.Model.Trim() } else { "Universal Device" }
            osName = if ($os.Caption) { $os.Caption.Trim() } else { "Windows 11" }
            osVersion = if ($os.Version) { $os.Version } else { "11.0" }
            osBuild = if ($os.BuildNumber) { $os.BuildNumber } else { "26100" }
            architecture = if ($os.OSArchitecture) { $os.OSArchitecture } else { "64-bit" }
            isAdmin = $isAdmin
            cpuName = if ($cpu.Name) { $cpu.Name.Trim() } else { "x64 Multi-Core" }
            totalMemoryGb = $memGb
        } | ConvertTo-Json
    "#;

    if let Ok(output) = Command::new("powershell")
        .args(&["-NoProfile", "-Command", script])
        .output()
    {
        if let Ok(json_str) = String::from_utf8(output.stdout) {
            if let Ok(v) = serde_json::from_str::<serde_json::Value>(&json_str) {
                return SystemSpecs {
                    manufacturer: v["manufacturer"].as_str().unwrap_or("PC").to_string(),
                    model: v["model"].as_str().unwrap_or("Device").to_string(),
                    os_name: v["osName"].as_str().unwrap_or("Windows 11").to_string(),
                    os_version: v["osVersion"].as_str().unwrap_or("11.0").to_string(),
                    os_build: v["osBuild"].as_str().unwrap_or("26100").to_string(),
                    architecture: v["architecture"].as_str().unwrap_or("64-bit").to_string(),
                    is_admin: v["isAdmin"].as_bool().unwrap_or(false),
                    cpu_name: v["cpuName"].as_str().unwrap_or("x64 Processor").to_string(),
                    total_memory_gb: v["totalMemoryGb"].as_f64().unwrap_or(16.0),
                };
            }
        }
    }

    SystemSpecs {
        manufacturer: "Universal PC".into(),
        model: "Windows 11 Workstation".into(),
        os_name: "Microsoft Windows 11".into(),
        os_version: "11.0".into(),
        os_build: "26100".into(),
        architecture: "64-bit".into(),
        is_admin: false,
        cpu_name: "Multi-Core CPU".into(),
        total_memory_gb: 16.0,
    }
}

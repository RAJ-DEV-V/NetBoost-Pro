// NetBoost Pro - Windows 11 Desktop Application Entrypoint
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    netboost_pro::run();
}

use std::process::Command;
use std::path::Path;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/**
 * Find native application on the system
 *
 * Searches for an application executable in standard locations
 * Returns the full path if found, None otherwise
 */
#[tauri::command]
fn find_app(app_names: Vec<String>) -> Option<String> {
    #[cfg(target_os = "windows")]
    {
        find_app_windows(app_names)
    }

    #[cfg(target_os = "macos")]
    {
        find_app_macos(app_names)
    }

    #[cfg(target_os = "linux")]
    {
        find_app_linux(app_names)
    }
}

/**
 * Launch native application if found, otherwise return false
 */
#[tauri::command]
fn launch_app(app_path: String) -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        launch_app_windows(app_path)
    }

    #[cfg(target_os = "macos")]
    {
        launch_app_macos(app_path)
    }

    #[cfg(target_os = "linux")]
    {
        launch_app_linux(app_path)
    }
}

// ========================================
// Windows Implementation
// ========================================
#[cfg(target_os = "windows")]
fn find_app_windows(app_names: Vec<String>) -> Option<String> {
    use std::env;

    // Standard Windows installation paths
    let search_paths = vec![
        env::var("ProgramFiles").unwrap_or_else(|_| "C:\\Program Files".to_string()),
        env::var("ProgramFiles(x86)").unwrap_or_else(|_| "C:\\Program Files (x86)".to_string()),
        format!("{}\\AppData\\Local\\Programs", env::var("USERPROFILE").unwrap_or_default()),
        format!("{}\\AppData\\Local", env::var("USERPROFILE").unwrap_or_default()),
    ];

    // Search for each app name
    for app_name in &app_names {
        // Try using 'where' command (like 'which' on Unix)
        let output = Command::new("where")
            .arg(app_name)
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                if let Ok(path) = String::from_utf8(output.stdout) {
                    let path = path.trim();
                    if !path.is_empty() {
                        return Some(path.lines().next().unwrap_or(path).to_string());
                    }
                }
            }
        }

        // Manual search in common directories
        for base_path in &search_paths {
            let potential_paths = vec![
                format!("{}\\{}.exe", base_path, app_name),
                format!("{}\\{}\\{}.exe", base_path, app_name, app_name),
            ];

            for path in potential_paths {
                if Path::new(&path).exists() {
                    return Some(path);
                }
            }
        }
    }

    None
}

#[cfg(target_os = "windows")]
fn launch_app_windows(app_path: String) -> Result<bool, String> {
    Command::new("cmd")
        .args(&["/C", "start", "", &app_path])
        .spawn()
        .map(|_| true)
        .map_err(|e| format!("Failed to launch app: {}", e))
}

// ========================================
// macOS Implementation
// ========================================
#[cfg(target_os = "macos")]
fn find_app_macos(app_names: Vec<String>) -> Option<String> {
    // Create bindings to extend lifetime
    let home_dir = std::env::var("HOME").unwrap_or_default();
    let home_apps_path = format!("{}/Applications", home_dir);

    // Standard macOS application paths
    let search_paths = vec![
        "/Applications",
        &home_apps_path,
        "/System/Applications",
    ];

    for app_name in &app_names {
        // Try using mdfind (Spotlight search)
        let output = Command::new("mdfind")
            .arg(format!("kMDItemKind == 'Application' && kMDItemFSName == '{}.app'", app_name))
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                if let Ok(path) = String::from_utf8(output.stdout) {
                    let path = path.trim();
                    if !path.is_empty() {
                        return Some(path.lines().next().unwrap_or(path).to_string());
                    }
                }
            }
        }

        // Check if it's a bundle ID
        if app_name.contains('.') {
            // Try to find by bundle ID
            let output = Command::new("mdfind")
                .arg(format!("kMDItemCFBundleIdentifier == '{}'", app_name))
                .output();

            if let Ok(output) = output {
                if output.status.success() {
                    if let Ok(path) = String::from_utf8(output.stdout) {
                        let path = path.trim();
                        if !path.is_empty() {
                            return Some(path.lines().next().unwrap_or(path).to_string());
                        }
                    }
                }
            }
        }

        // Manual search in standard directories
        for base_path in &search_paths {
            let app_path = format!("{}/{}.app", base_path, app_name);
            if Path::new(&app_path).exists() {
                return Some(app_path);
            }
        }
    }

    None
}

#[cfg(target_os = "macos")]
fn launch_app_macos(app_path: String) -> Result<bool, String> {
    Command::new("open")
        .arg(&app_path)
        .spawn()
        .map(|_| true)
        .map_err(|e| format!("Failed to launch app: {}", e))
}

// ========================================
// Linux Implementation
// ========================================
#[cfg(target_os = "linux")]
fn find_app_linux(app_names: Vec<String>) -> Option<String> {
    for app_name in &app_names {
        // Try using 'which' command
        let output = Command::new("which")
            .arg(app_name)
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                if let Ok(path) = String::from_utf8(output.stdout) {
                    let path = path.trim();
                    if !path.is_empty() {
                        return Some(path.to_string());
                    }
                }
            }
        }

        // Try whereis command
        let output = Command::new("whereis")
            .arg("-b")
            .arg(app_name)
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                if let Ok(result) = String::from_utf8(output.stdout) {
                    // whereis output: "appname: /path/to/app"
                    let parts: Vec<&str> = result.split(':').collect();
                    if parts.len() > 1 {
                        let path = parts[1].trim().split_whitespace().next();
                        if let Some(path) = path {
                            if !path.is_empty() {
                                return Some(path.to_string());
                            }
                        }
                    }
                }
            }
        }

        // Check standard binary paths
        let home_local_bin = format!("{}/.local/bin", std::env::var("HOME").unwrap_or_default());
        let search_paths = vec![
            "/usr/bin",
            "/usr/local/bin",
            "/opt",
            "/snap/bin",
            home_local_bin.as_str(),
        ];

        for base_path in &search_paths {
            let app_path = format!("{}/{}", base_path, app_name);
            if Path::new(&app_path).exists() {
                return Some(app_path);
            }
        }

        // Check flatpak
        let output = Command::new("flatpak")
            .args(&["list", "--app", "--columns=application"])
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                if let Ok(list) = String::from_utf8(output.stdout) {
                    if list.contains(app_name) {
                        return Some(format!("flatpak:{}", app_name));
                    }
                }
            }
        }
    }

    None
}

#[cfg(target_os = "linux")]
fn launch_app_linux(app_path: String) -> Result<bool, String> {
    // Handle flatpak apps
    if app_path.starts_with("flatpak:") {
        let app_id = app_path.strip_prefix("flatpak:").unwrap_or(&app_path);
        return Command::new("flatpak")
            .args(&["run", app_id])
            .spawn()
            .map(|_| true)
            .map_err(|e| format!("Failed to launch flatpak app: {}", e));
    }

    // Regular executable 
    Command::new(&app_path)
        .spawn()
        .map(|_| true)
        .map_err(|e| format!("Failed to launch app: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            find_app,
            launch_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    // Load .env file if it exists
    if let Ok(_) = dotenv::dotenv() {
        println!("cargo:rerun-if-changed=../.env");
    }

    tauri_build::build()
}

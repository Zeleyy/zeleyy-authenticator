use tauri::Manager;
use tauri_plugin_log::log;

mod commands;
mod vault;
use crate::vault::{database::Database, keyring::get_or_create_master_key};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log::info!("Starting application...");

    let builder = tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init());

    #[cfg(desktop)]
    let builder = builder
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            log::info!("Second instance detected, focusing main window");
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_updater::Builder::new().build());

    #[cfg(target_os = "android")]
    android_keyring::set_android_keyring_credential_builder().unwrap();

    let master_key = match get_or_create_master_key() {
        Ok(master_key) => master_key,
        Err(e) => {
            log::error!("Failed to initialize master key: {}", e);
            panic!("Failed to initialize master key: {}", e);
        }
    };
    log::info!("Master key initialized successfully");

    builder
        .setup(move |app| {
            log::info!("Setting up application...");
            let app_path = app.path().app_local_data_dir()?;
            std::fs::create_dir_all(&app_path)?;
            log::info!("App data directory ready");

            let pool = match Database::init(&app_path, &master_key) {
                Ok(pool) => pool,
                Err(e) => {
                    log::error!("Database init failed: {}", e);
                    panic!("Database init failed: {}", e);
                }
            };
            app.manage(pool);

            log::info!("Application setup completed");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_accounts,
            commands::add_account,
            commands::update_account,
            commands::delete_account,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

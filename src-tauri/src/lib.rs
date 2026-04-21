use tauri::Manager;

mod commands;
mod vault;
use crate::vault::{database::Database, keyring::get_or_create_master_key};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let master_key = get_or_create_master_key().expect("Failed to get master key");

    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init());

    #[cfg(desktop)]
    let builder = builder
        .plugin(tauri_plugin_single_instance::init(|app, args, _| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
            println!("Second instance attempted with args: {:?}", args);
        }))
        .plugin(tauri_plugin_updater::Builder::new().build());

    builder
        .setup(move |app| {
            let app_path = app.path().app_local_data_dir()?;
            std::fs::create_dir_all(&app_path)?;

            let pool = Database::init(&app_path, &master_key).expect("Database init failed");
            app.manage(pool);

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

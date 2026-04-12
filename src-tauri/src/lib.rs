use tauri::Manager;

mod commands;
mod vault;
use crate::vault::{database::Database, keyring::get_or_create_master_key};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let master_key = get_or_create_master_key().expect("Failed to get master key");

    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(move |app| {
            let app_path = app.path().app_local_data_dir()?;
            std::fs::create_dir_all(&app_path)?;

            let conn = tauri::async_runtime::block_on(async {
                Database::init(&app_path, &master_key)
                    .await
                    .expect("Database init failed")
            });
            app.manage(conn);

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

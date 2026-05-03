use tauri::State;
use tauri_plugin_log::log::{info, error};
use zeleyy_authenticator_core::{AccountWithCode, CreateAccount, DbPool, UpdateAccount, create_account_service, delete_account_service, get_all_accounts_with_codes, update_account_service};

use crate::core_logic::{get_secure_flag, set_secure_flag};

#[tauri::command]
pub async fn check_biometry_status() -> Result<bool, String> {
    get_secure_flag("biometry_enabled")
}

#[tauri::command]
pub async fn set_biometry_status(enabled: bool) -> Result<(), String> {
    set_secure_flag("biometry_enabled", enabled)
}

#[tauri::command]
pub async fn get_accounts(pool: State<'_, DbPool>) -> Result<Vec<AccountWithCode>, String> {
    let conn = pool.get().map_err(|e| e.to_string())?;
    let result = get_all_accounts_with_codes(&conn)?;
    Ok(result)
}

#[tauri::command]
pub async fn add_account(
    pool: State<'_, DbPool>,
    account_name: String,
    secret: String,
    issuer: Option<String>,
    digits: Option<i32>,
    interval: Option<i32>,
) -> Result<(), String> {
    info!("Adding new account: {}", account_name);

    let account_data = CreateAccount {
        account_name,
        secret,
        issuer,
        digits,
        interval,
    };

    let conn = pool.get().map_err(|e| e.to_string())?;
    
    create_account_service(&conn, account_data)
    .map_err(|e| {
        error!("Failed to insert account into database: {}", e);
        e.to_string()
    })?;

    info!("Account added successfully");
    Ok(())
}

#[tauri::command]
pub async fn update_account(
    pool: State<'_, DbPool>,
    account_id: i64,
    new_name: String,
) -> Result<(), String> {
    info!(
        "Updating account ID {}: new name '{}'",
        account_id,
        new_name
    );

    let udpate_data = UpdateAccount {
        account_id,
        new_name,
    };

    let conn = pool.get().map_err(|e| e.to_string())?;

    update_account_service(&conn, udpate_data)?;

    Ok(())
}

#[tauri::command]
pub async fn delete_account(pool: State<'_, DbPool>, account_id: i64) -> Result<(), String> {
    info!("Deleting account ID: {}", account_id);
    let conn = pool.get().map_err(|e| e.to_string())?;

    delete_account_service(&conn, account_id)?;

    Ok(())
}

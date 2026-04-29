use base32::Alphabet;
use serde::Serialize;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::State;
use tauri_plugin_log::log;
use totp_lite::{totp_custom, Sha1};

use crate::vault::{database::DbPool, keyring::SERVICE_NAME};

#[tauri::command]
pub async fn check_biometry_status() -> Result<bool, String> {
    let entry = keyring::Entry::new(SERVICE_NAME, "biometry_enabled").map_err(|e| e.to_string())?;

    match entry.get_password() {
        Ok(val) => Ok(val == "true"),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
pub async fn set_biometry_status(enabled: bool) -> Result<(), String> {
    let entry = keyring::Entry::new(SERVICE_NAME, "biometry_enabled").map_err(|e| e.to_string())?;

    if enabled {
        entry.set_password("true").map_err(|e| e.to_string())?;
    } else {
        entry.delete_credential().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[derive(Serialize)]
pub struct Account {
    pub account_id: i64,
    pub issuer: Option<String>,
    pub account_name: String,
    pub secret: String,
    pub digits: i32,
    pub interval: i32,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AccountWithCode {
    pub account_id: i64,
    pub issuer: Option<String>,
    pub account_name: String,
    pub code: String,
    pub remaining_seconds: u64,
}

#[tauri::command]
pub async fn get_accounts(pool: State<'_, DbPool>) -> Result<Vec<AccountWithCode>, String> {
    let conn = pool.get().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT account_id, issuer, account_name, secret, digits, interval FROM accounts")
        .map_err(|e| e.to_string())?;

    let account_iter = stmt
        .query_map([], |row| {
            Ok(Account {
                account_id: row.get(0)?,
                issuer: row.get(1)?,
                account_name: row.get(2)?,
                secret: row.get(3)?,
                digits: row.get(4)?,
                interval: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut result = Vec::new();

    for acc_res in account_iter {
        let acc = acc_res.map_err(|e| e.to_string())?;

        let interval = acc.interval as u64;
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|e| e.to_string())?
            .as_secs();

        let code_result = match base32::decode(
            Alphabet::Rfc4648 { padding: false },
            &acc.secret.trim().to_uppercase(),
        ) {
            Some(secret_bytes) => {
                totp_custom::<Sha1>(interval, acc.digits as u32, &secret_bytes, now)
            }
            None => "Error".to_string(),
        };

        result.push(AccountWithCode {
            account_id: acc.account_id,
            issuer: acc.issuer,
            account_name: acc.account_name,
            code: code_result,
            remaining_seconds: interval - (now % interval),
        });
    }

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
    log::info!("Adding new account: {}", account_name);

    let secret = secret.trim();
    if secret.is_empty() {
        return Err("Secret cannot be empty".to_string());
    }

    match base32::decode(Alphabet::Rfc4648 { padding: false }, &secret.to_uppercase()) {
        Some(_) => (),
        None => return Err("Invalid base32 secret".to_string()),
    }

    let conn = pool.get().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO accounts (issuer, account_name, secret, digits, interval) 
         VALUES (?1, ?2, ?3, ?4, ?5)",
        (
            issuer,
            account_name,
            secret,
            digits.unwrap_or(6),
            interval.unwrap_or(30),
        ),
    )
    .map_err(|e| {
        log::error!("Failed to insert account into database: {}", e);
        e.to_string()
    })?;

    log::info!("Account added successfully");
    Ok(())
}

#[tauri::command]
pub async fn update_account(
    pool: State<'_, DbPool>,
    account_id: i32,
    new_name: String,
) -> Result<(), String> {
    log::info!(
        "Updating account ID {}: new name '{}'",
        account_id,
        new_name
    );
    let conn = pool.get().map_err(|e| e.to_string())?;

    let rows_affected = conn
        .execute(
            "UPDATE accounts
        SET account_name = ?1
        WHERE account_id = ?2",
            (new_name, account_id),
        )
        .map_err(|e| {
            log::error!("Failed to update account ID {}: {}", account_id, e);
            e.to_string()
        })?;

    if rows_affected == 0 {
        log::warn!("Account ID {} not found for update", account_id);
    } else {
        log::info!(
            "Account ID {} updated successfully ({} row(s) affected)",
            account_id,
            rows_affected
        );
    }

    Ok(())
}

#[tauri::command]
pub async fn delete_account(pool: State<'_, DbPool>, account_id: i64) -> Result<(), String> {
    log::info!("Deleting account ID: {}", account_id);
    let conn = pool.get().map_err(|e| e.to_string())?;

    let rows_affected = conn
        .execute("DELETE FROM accounts WHERE account_id = ?1", (account_id,))
        .map_err(|e| {
            log::error!("Failed to delete account ID {}: {}", account_id, e);
            e.to_string()
        })?;

    if rows_affected == 0 {
        log::warn!("Account ID {} not found for deletion", account_id);
    } else {
        log::info!(
            "Account ID {} deleted successfully ({} row(s) affected)",
            account_id,
            rows_affected
        );
    }

    Ok(())
}

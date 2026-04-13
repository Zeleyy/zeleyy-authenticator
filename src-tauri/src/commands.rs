use base32::Alphabet;
use std::time::{SystemTime, UNIX_EPOCH};
use totp_lite::{totp_custom, Sha1};

use crate::vault::database::DbPool;

#[derive(serde::Serialize)]
pub struct Account {
    pub account_id: i64,
    pub issuer: Option<String>,
    pub account_name: String,
    pub secret: String,
    pub digits: i32,
    pub interval: i32,
}

#[derive(serde::Serialize)]
pub struct AccountWithCode {
    pub account_id: i64,
    pub issuer: Option<String>,
    pub account_name: String,
    pub code: String,
    pub remaining_seconds: u64,
}

#[tauri::command]
pub async fn get_accounts(
    pool: tauri::State<'_, DbPool>,
) -> Result<Vec<AccountWithCode>, String> {
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
        
        let secret_bytes = base32::decode(
            Alphabet::Rfc4648 { padding: false },
            &acc.secret.trim().to_uppercase(),
        )
        .ok_or_else(|| format!("Ошибка: секрет {} содержит недопустимые символы", acc.account_name))?;

        let interval = acc.interval as u64;
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|e| e.to_string())?
            .as_secs();

        let code = totp_custom::<Sha1>(interval, acc.digits as u32, &secret_bytes, now);

        result.push(AccountWithCode {
            account_id: acc.account_id,
            issuer: acc.issuer,
            account_name: acc.account_name,
            code,
            remaining_seconds: interval - (now % interval),
        });
    }

    Ok(result)
}

#[tauri::command]
pub async fn add_account(
    pool: tauri::State<'_, DbPool>,
    account_name: String,
    secret: String,
    issuer: Option<String>,
    digits: Option<i32>,
    interval: Option<i32>,
) -> Result<(), String> {
    let conn = pool.get().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO accounts (issuer, account_name, secret, digits, interval) 
         VALUES (?1, ?2, ?3, ?4, ?5)",
        (
            issuer,
            account_name,
            secret.to_uppercase(),
            digits.unwrap_or(6),
            interval.unwrap_or(30),
        ),
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn update_account(
    pool: tauri::State<'_, DbPool>,
    account_id: i32,
    new_name: String,
) -> Result<(), String> {
    let conn = pool.get().map_err(|e| e.to_string())?;
    
    conn.execute(
        "UPDATE accounts
        SET account_name = ?1
        WHERE account_id = ?2",
        (
            new_name,
            account_id,
        )
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn delete_account(
    pool: tauri::State<'_, DbPool>,
    account_id: i64,
) -> Result<(), String> {
    let conn = pool.get().map_err(|e| e.to_string())?;

    conn.execute(
        "DELETE FROM accounts WHERE account_id = ?1",
        (
            account_id,
        )
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

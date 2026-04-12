use base32::Alphabet;
use sqlx::{SqlitePool};
use std::time::{SystemTime, UNIX_EPOCH};
use totp_lite::{totp_custom, Sha1};

#[derive(serde::Serialize, sqlx::FromRow)]
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
    pool: tauri::State<'_, SqlitePool>,
) -> Result<Vec<AccountWithCode>, String> {
    let accounts = sqlx::query_as::<_, Account>(
        "SELECT account_id, issuer, account_name, secret, digits, interval FROM accounts",
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    let mut result = Vec::new();

    for acc in accounts {
        let secret_bytes = base32::decode(
            Alphabet::Rfc4648 { padding: false },
            &acc.secret.trim().to_uppercase(),
        )
        .ok_or_else(|| {
            format!(
                "Ошибка: секрет {} содержит недопустимые символы",
                acc.account_name
            )
        })?;

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
    pool: tauri::State<'_, SqlitePool>,
    account_name: String,
    secret: String,
    issuer: Option<String>,
    digits: Option<i32>,
    interval: Option<i32>,
) -> Result<(), String> {
    sqlx::query(
        "INSERT INTO accounts (issuer, account_name, secret, digits, interval) 
         VALUES (?, ?, ?, ?, ?)",
    )
    .bind(issuer)
    .bind(account_name)
    .bind(secret.to_uppercase())
    .bind(digits.unwrap_or(6))
    .bind(interval.unwrap_or(30))
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn update_account(
    pool: tauri::State<'_, SqlitePool>,
    account_id: i32,
    new_name: String,
) -> Result<(), String> {
    sqlx::query(
        "UPDATE accounts
        SET account_name = ?
        WHERE account_id = ?",
    )
    .bind(new_name)
    .bind(account_id)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn delete_account(
    pool: tauri::State<'_, SqlitePool>,
    account_id: i64,
) -> Result<(), String> {
    sqlx::query("DELETE FROM accounts WHERE account_id = ?")
        .bind(account_id)
        .execute(pool.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

use rusqlite::Connection;

use crate::{AccountWithCode, CreateAccount, UpdateAccount, generate_code_from_raw_secret, get_now_secs};

pub fn get_all_accounts_with_codes(conn: &Connection) -> Result<Vec<AccountWithCode>, String> {
    let accounts = crate::database::accounts::get_all(conn)?;

    let result = accounts.into_iter().map(|acc| {
        let interval = acc.interval as u64;
        let now = get_now_secs();
        let code = generate_code_from_raw_secret(&acc.secret, interval, acc.digits as u32, now);

        AccountWithCode {
            account_id: acc.account_id,
            issuer: acc.issuer,
            account_name: acc.account_name,
            code,
            digits: acc.digits,
            expires_at: now + (interval - (now % interval)),
            interval: interval as i32,
        }
    }).collect();

    Ok(result)
}

pub fn create_account(
    conn: &Connection,
    mut account: CreateAccount,
) -> Result<i64, String> {
    account.secret = crate::totp::utils::clean_secret(&account.secret);
    crate::totp::utils::validate_secret(&account.secret)?;

    let generated_id = crate::database::accounts::insert(conn, account)?;

    Ok(generated_id)
}

pub fn update_account(
    conn: &Connection,
    mut account: UpdateAccount,
) -> Result<(), String> {
    account.new_name = account.new_name.trim().to_string();

    if account.new_name.is_empty() {
        return Err("Account name cannot be empty".to_string());
    }

    crate::database::accounts::update(conn, account)
}

pub fn delete_account(conn: &Connection, account_id: i64) -> Result<(), String> {
    crate::database::accounts::delete(conn, account_id)
}

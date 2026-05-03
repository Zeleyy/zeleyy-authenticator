use rusqlite::{Connection, Result, params};

use crate::{Account, CreateAccount, DEFAULT_DIGITS, DEFAULT_INTERVAL, UpdateAccount};

pub fn get_all(conn: &Connection) -> Result<Vec<Account>, String> {
    let mut stmt = conn
        .prepare("SELECT account_id, issuer, account_name, secret, digits, interval FROM accounts")
        .map_err(|e| e.to_string())?;

    let account_iter = stmt.query_map([], |row| {
        Ok(Account {
            account_id: row.get("account_id")?,
            issuer: row.get("issuer")?,
            account_name: row.get("account_name")?,
            secret: row.get("secret")?,
            digits: row.get("digits")?,
            interval: row.get("interval")?,
        })
    }).map_err(|e| e.to_string())?;

    account_iter
        .collect::<Result<Vec<Account>, _>>()
        .map_err(|e| e.to_string())
}

pub fn insert(
    conn: &Connection,
    account: CreateAccount,
) -> Result<i64, String> {
    conn.execute(
        "INSERT INTO accounts (issuer, account_name, secret, digits, interval) 
        VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            account.issuer,
            account.account_name,
            account.secret,
            account.digits.unwrap_or(DEFAULT_DIGITS),
            account.interval.unwrap_or(DEFAULT_INTERVAL),
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

pub fn update(
    conn: &Connection,
    account: UpdateAccount,
) -> Result<(), String> {
    let rows_affected = conn.execute(
        "UPDATE accounts
        SET account_name = ?1
        WHERE account_id = ?2",
        params![
            account.new_name,
            account.account_id,
        ],
    )
    .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err("Account not found".to_string());
    }

    Ok(())
}

pub fn delete(
    conn: &Connection,
    account_id: i64,
) -> Result<(), String> {
    let rows_affected = conn.execute(
        "DELETE FROM accounts WHERE account_id = ?1",
        params![
            account_id
        ]
    )
    .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err("Account not found".to_string());
    }

    Ok(())
}

use rusqlite::{Connection, Error};

pub fn create_tables(conn: &Connection) -> Result<(), Error> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS accounts (
            account_id INTEGER PRIMARY KEY AUTOINCREMENT,
            issuer TEXT NULL,
            account_name TEXT NOT NULL,
            secret TEXT NOT NULL,
            digits INTEGER DEFAULT 6,
            interval INTEGER DEFAULT 30,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;
    Ok(())
}

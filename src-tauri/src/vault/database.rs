use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous};
use sqlx::SqlitePool;
use std::path::PathBuf;
use std::str::FromStr;

pub struct Database;

impl Database {
    pub async fn init(
        app_path: &PathBuf,
        master_key: &[u8; 32],
    ) -> Result<SqlitePool, sqlx::Error> {
        let db_path = app_path.join("vault.db");
        let db_url = format!("sqlite:{}?mode=rwc", db_path.to_string_lossy());
        let hex_key: String = master_key.iter().map(|b| format!("{:02x}", b)).collect();

        let opts = SqliteConnectOptions::from_str(&db_url)?
            .create_if_missing(true)
            .pragma("key", format!("'{}'", hex_key))
            .journal_mode(SqliteJournalMode::Wal)
            .synchronous(SqliteSynchronous::Normal);

        let pool = SqlitePoolOptions::new()
            .max_connections(2)
            .connect_with(opts)
            .await?;

        sqlx::query(
            "CREATE TABLE IF NOT EXISTS accounts (
                account_id INTEGER PRIMARY KEY AUTOINCREMENT,
                issuer TEXT NULL,
                account_name TEXT NOT NULL,
                secret TEXT NOT NULL,
                digits INTEGER DEFAULT 6,
                interval INTEGER DEFAULT 30,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )",
        )
        .execute(&pool)
        .await?;

        Ok(pool)
    }
}

use sqlx::{Connection, SqliteConnection};
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct Database;

impl Database {
    pub async fn init(
        app_path: &PathBuf,
        master_key: &[u8; 32],
    ) -> Result<Arc<Mutex<SqliteConnection>>, sqlx::Error> {
        let db_path = app_path.join("vault.db");
        let db_url = format!("sqlite:{}?mode=rwc", db_path.to_string_lossy());

        let hex_key: String = master_key.iter().map(|b| format!("{:02x}", b)).collect();

        let mut conn = SqliteConnection::connect(&db_url).await?;

        let pragma_key = format!("PRAGMA key = '{}'", hex_key);
        sqlx::query(&pragma_key).execute(&mut conn).await?;

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
        .execute(&mut conn)
        .await?;

        Ok(Arc::new(Mutex::new(conn)))
    }
}

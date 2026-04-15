use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::OpenFlags;
use std::path::PathBuf;

pub struct Database;

pub type DbPool = Pool<SqliteConnectionManager>;

impl Database {
    pub const CURRENT_DB_NAME: &str = "keystore.db";
    // pub const LEGACY_DB_NAME: &str = "vault.db";

    pub fn init(
        app_path: &PathBuf,
        master_key: &[u8; 32],
    ) -> Result<DbPool, Box<dyn std::error::Error>> {
        let db_path = app_path.join(Database::CURRENT_DB_NAME);
        let hex_key: String = master_key.iter().map(|b| format!("{:02x}", b)).collect();
        
        let manager = SqliteConnectionManager::file(&db_path)
            .with_flags(OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE)
            .with_init(move |conn| {
                conn.pragma_update(None, "key", &format!("x'{}'", hex_key))?;
                
                conn.pragma_update(None, "journal_mode", "WAL")?;
                conn.pragma_update(None, "synchronous", "NORMAL")?;
                
                Ok(())
            });

        let pool = Pool::builder()
            .max_size(2)
            .build(manager)?;

        let conn = pool.get()?;

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

        Ok(pool)
    }
}

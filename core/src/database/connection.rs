use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::OpenFlags;
use std::{error::Error, path::PathBuf};

use crate::{DB_NAME, create_tables, DbPool};

pub fn initialize_db(
    app_path: &PathBuf,
    master_key: &[u8; 32],
) -> Result<DbPool, Box<dyn Error>> {
    let db_path = app_path.join(DB_NAME);
    let hex_key: String = master_key.iter().map(|b| format!("{:02x}", b)).collect();

    let manager = SqliteConnectionManager::file(&db_path)
        .with_flags(OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE)
        .with_init(move |conn| {
            conn.pragma_update(None, "key", &format!("x'{}'", hex_key))?;
            conn.pragma_update(None, "journal_mode", "WAL")?;
            conn.pragma_update(None, "synchronous", "NORMAL")?;
            Ok(())
        });

    let pool = Pool::builder().max_size(2).build(manager)?;
    let conn = pool.get()?;
    
    create_tables(&conn)?;

    Ok(pool)
}
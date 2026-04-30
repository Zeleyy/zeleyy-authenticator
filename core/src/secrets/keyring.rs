use base64::{Engine, prelude::BASE64_STANDARD};
use keyring::Entry;

use crate::{SERVICE_NAME, generate_random_key};

pub fn get_entry(key: &str) -> Result<Entry, String> {
    Entry::new(SERVICE_NAME, key).map_err(|e| format!("Keyring error: {}", e))
}

pub fn get_or_create_master_key() -> Result<[u8; 32], String> {
    let entry = get_entry("master_key")?;

    match entry.get_password() {
        Ok(key_base64) => {
            let decoded = BASE64_STANDARD
                .decode(key_base64.as_bytes())
                .map_err(|e| format!("Failed to decode key: {}", e))?;

            decoded
                .try_into()
                .map_err(|_| "Stored key has invalid length".to_string())
        }
        Err(_) => {
            let raw_key = generate_random_key();
            let encoded_key = BASE64_STANDARD.encode(&raw_key);

            entry.set_password(&encoded_key)
                .map_err(|e| format!("Failed to save key: {}", e))?;

            Ok(raw_key)
        }
    }
}

pub fn set_secure_flag(key: &str, enabled: bool) -> Result<(), String> {
    let entry = get_entry(key)?;
    if enabled {
        entry.set_password("true").map_err(|e| e.to_string())
    } else {
        let _ = entry.delete_credential();
        Ok(())
    }
}

pub fn get_secure_flag(key: &str) -> Result<bool, String> {
    match get_entry(key) {
        Ok(entry) => {
            match entry.get_password() {
                Ok(val) => Ok(val == "true"),
                Err(keyring::Error::NoEntry) => Ok(false),
                Err(e) => Err(format!("Failed to get secure flag: {}", e)),
            }
        },
        Err(e) => Err(format!("Keyring entry error: {}", e)),
    }
}

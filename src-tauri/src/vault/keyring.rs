use data_encoding::BASE64;
use keyring::Entry;
use tauri_plugin_log::log::info;

use crate::vault::utils::generate_random_key;

pub static SERVICE_NAME: &'static str = "ru.zeleyy.zeleyy-authenticator";

pub fn get_or_create_master_key() -> Result<[u8; 32], String> {
    info!("Initializing master key from secure storage");

    let entry = Entry::new(SERVICE_NAME, "master_key")
        .map_err(|e| format!("Failed to initialize storage: {}", e))?;

    match entry.get_password() {
        Ok(key_base64) => {
            let decoded = BASE64
                .decode(key_base64.as_bytes())
                .map_err(|e| format!("Failed to decode key: {}", e))?;

            decoded
                .try_into()
                .map_err(|_| "Stored key has invalid length (not 32 bytes)".to_string())
        }
        Err(_) => {
            info!("No existing master key found, generating new one");
            let raw_key = generate_random_key();
            let encoded_key = BASE64.encode(&raw_key);

            entry
                .set_password(&encoded_key)
                .map_err(|e| format!("Failed to save master key: {}", e))?;

            info!("New master key generated and saved");
            Ok(raw_key)
        }
    }
}

use data_encoding::BASE64;
use keyring::Entry;

use crate::vault::utils::generate_random_key;

static SERVICE_NAME: &'static str = "ru.zeleyy.zeleyy-authenticator";

pub fn get_or_create_master_key() -> Result<[u8; 32], String> {
    let entry = Entry::new(SERVICE_NAME, "master_key")
        .map_err(|e| format!("Ошибка инициализации хранилища: {}", e))?;

    match entry.get_password() {
        Ok(key_base64) => {
            let decoded = BASE64
                .decode(key_base64.as_bytes())
                .map_err(|e| format!("Ошибка декодирования ключа: {}", e))?;

            decoded
                .try_into()
                .map_err(|_| "Ключ в хранилище имеет неверную длину (не 32 байта)".to_string())
        }
        Err(_) => {
            let raw_key = generate_random_key();
            let encoded_key = BASE64.encode(&raw_key);

            entry
                .set_password(&encoded_key)
                .map_err(|e| format!("Не удалось сохранить мастер-ключ: {}", e))?;

            Ok(raw_key)
        }
    }
}

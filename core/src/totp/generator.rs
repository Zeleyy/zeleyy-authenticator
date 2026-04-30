use totp_lite::{Sha1, totp_custom};

use crate::totp::utils::validate_secret;

pub fn generate_code_from_raw_secret(secret: &str, interval: u64, digits: u32, now: u64) -> String {
    match validate_secret(secret) {
        Ok(secret_bytes) => {
            totp_custom::<Sha1>(interval, digits, &secret_bytes, now)
        }
        Err(_) => "Error".to_string(),
    }
}

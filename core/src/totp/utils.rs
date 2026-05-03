use base32::Alphabet;

pub fn clean_secret(secret: &str) -> String {
    secret.replace(" ", "").trim().to_uppercase()
}

pub fn validate_secret(cleaned_secret: &str) -> Result<Vec<u8>, String> {
    if cleaned_secret.is_empty() {
        return Err("Secret cannot be empty".to_string());
    }

    base32::decode(Alphabet::Rfc4648 { padding: false }, cleaned_secret)
        .ok_or_else(|| "Invalid base32 secret".to_string())
}

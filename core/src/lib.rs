pub mod constants;
pub mod models;
pub mod database;
pub mod secrets;
pub mod utils;
pub mod totp;
pub mod services;

pub use constants::*;

pub use models::accounts::{Account, AccountWithCode, CreateAccount, UpdateAccount};

pub use database::{
    DbPool,
    schema::create_tables,
    connection::initialize_db,
};

pub use secrets::keyring::{
    get_or_create_master_key,
    set_secure_flag,
    get_secure_flag,
};

pub use utils::{
    generate_random_key,
    get_now_secs,
};

pub use totp::{
    generator::generate_code_from_raw_secret,
};

pub use services::accounts::{
    get_all_accounts_with_codes,
    create_account as create_account_service,
    update_account as update_account_service,
    delete_account as delete_account_service,
};
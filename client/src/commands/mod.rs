pub mod list;
pub mod next;
pub mod open;

use std::env;

pub fn url() -> String {
  match env::var("SERVER_URL") {
    Ok(v) => v,
    Err(_) => "https://telelink.fcoury.com".to_string(),
  }
}

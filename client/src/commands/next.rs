use crate::types::{LinkResponse, Next};
use reqwest::Error;

pub async fn run(next: &Next) -> Result<(), Error> {
    let mut keepstr = "";
    if next.keep {
        keepstr = "?keep=true";
    }
    let get_url = format!("{}/next{}", super::url(), keepstr);
    let response: LinkResponse = reqwest::get(get_url).await?.json().await?;
    match response.link {
        Some(link) => {
            println!("Opening {}", link.url);
            link.open();
        }
        None => {
            if response.ok {
                println!("No links left to visit.")
            } else {
                if let Some(message) = response.message {
                    println!("Error getting link: {}.", message)
                } else {
                    println!("Unknown error getting link.")
                }
            }
        }
    }

    Ok(())
}

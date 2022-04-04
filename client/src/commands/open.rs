use crate::types::{Link, LinkResponse, Open};
use colored::*;
use reqwest::Error;

pub async fn run(open: &Open) -> Result<(), Error> {
  let id = open.id;
  let url = format!("{}/links/{}", super::url(), id);
  let res = reqwest::get(&url).await?;
  if res.status() != 200 {
    panic!("Got {} from {}", res.status(), &url);
  }
  let response: LinkResponse = res.json().await?;
  match response.link {
    Some(link) => {
      println!("Opening {}", &link.title.yellow());
      println!("   {}", &link.url.underline());
      Link::open(&link);
    }
    None => {
      if !response.ok {
        if let Some(message) = response.message {
          println!("Error getting link: {}.", message);
          return Ok(());
        }
      }

      println!("Unexpected response from server: {:?}.", response);
    }
  }

  Ok(())
}

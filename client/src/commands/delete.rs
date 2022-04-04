use crate::types::{Delete, Link, LinkResponse};
use colored::*;
use reqwest::Error;

pub async fn run(args: &Delete) -> Result<(), Error> {
  let id = args.id;
  let url = format!("{}/links/{}", super::url(), id);

  let client = reqwest::Client::new();
  let res = client.delete(&url).send().await?;
  if res.status() != 200 {
    panic!("Got {} from {}", res.status(), &url);
  }
  let response: LinkResponse = res.json().await?;
  match response.link {
    Some(link) => {
      println!("{} {}", "DELETED".red(), &link.title.yellow());
      println!("   {}", &link.url.underline());
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

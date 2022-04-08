use crate::types::{Link, LinkResponse, Open};
use colored::*;
use reqwest::Error;
use std::collections::HashMap;

async fn mark_read(id: u32) -> Result<(), Error> {
  let url = format!("{}/links/{}/viewed", super::url(), id);
  println!("url: {:?}", url);

  let client = reqwest::Client::new();
  let mut map = HashMap::new();
  map.insert("viewed", true);
  let res = client.put(&url).json(&map).send().await?;
  if res.status() != 200 {
    panic!("Got {} from {}", res.status(), &url);
  }

  let result = res.text().await?;

  Ok(())
}

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
      if !open.keep {
        println!("   Marking link as viewed");
        mark_read(id).await?;
      }
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

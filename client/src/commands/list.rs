use crate::types::{LinksResponse, List};

use chrono::*;
use clap::{Args, Parser, Subcommand};
use colored::*;
use reqwest::Error;
use timeago::Formatter;

pub async fn run(list: &List) -> Result<(), Error> {
  let mut filters = Vec::new();
  if list.all {
    filters.push("status:all")
  }
  if let Some(terms) = &list.terms {
    filters.push(&terms);
  }
  let response: LinksResponse =
    reqwest::get(format!("{}/links?q={}", super::url(), filters.join(",")))
      .await?
      .json()
      .await?;

  if let Some(links) = response.links {
    if links.len() > 0 {
      println!("Found {} links:\n", links.len());
      for (i, link) in links.iter().enumerate() {
        let duration = match &link.created_at {
          Some(v) => {
            let f = Formatter::new();
            let duration = chrono::Utc::now()
              - DateTime::parse_from_rfc3339(&v)
                .unwrap()
                .with_timezone(&Utc);
            f.convert(duration.to_std().unwrap())
          }
          None => "N/A".to_string(),
        };

        if let Some(terms) = &list.terms {
          let pos = &link
            .title
            .to_lowercase()
            .find(&terms.to_lowercase())
            .unwrap();
          let len = terms.len();
          let prefix = &link.title[..pos - 0].yellow();
          let suffix = &link.title[pos + len..].yellow();
          let word = &link.title[pos + 0..pos + len].bold().underline().yellow();
          println!(
            "  #{} - {}{}{} ({})",
            link.id, prefix, word, suffix, duration,
          );
        } else {
          println!("  #{} - {} ({})", link.id, link.title.yellow(), duration,);
        }

        println!("       {}\n", link.url.underline())
      }
      return Ok(());
    }
  }

  if response.ok {
    println!("No links found.")
  } else {
    if let Some(message) = response.message {
      println!("Error getting links: {}.", message)
    } else {
      println!("Unknown error getting links.")
    }
  }

  Ok(())
}

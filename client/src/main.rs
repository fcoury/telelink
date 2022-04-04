#![allow(unused)]

#[macro_use]
extern crate prettytable;

use chrono::*;
use clap::{Args, Parser, Subcommand};
use colored::*;
use prettytable::format;
use prettytable::{Cell, Row, Table};
use reqwest::Error;
use serde::Deserialize;
use std::env;
use timeago::Formatter;
use webbrowser;

#[derive(Parser, Debug)]
#[clap(about, version, author)]
struct Cli {
    #[clap(subcommand)]
    action: Action,
}

#[derive(Args, Debug)]
struct List {
    #[clap(long)]
    all: bool,
}

#[derive(Args, Debug)]
struct Next {
    #[clap(long)]
    keep: bool,
}

#[derive(Subcommand, Debug)]
enum Action {
    List(List),
    Next(Next),
}

#[derive(Deserialize, Debug)]
struct Link {
    url: String,
    title: String,
    text: Option<String>,
    #[serde(rename(deserialize = "createdAt"))]
    created_at: Option<String>,
}

#[derive(Deserialize, Debug)]
struct LinksResponse {
    ok: bool,
    message: Option<String>,
    links: Option<Vec<Link>>,
}

#[derive(Deserialize, Debug)]
struct LinkResponse {
    ok: bool,
    message: Option<String>,
    link: Option<Link>,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let value = Cli::parse();
    let url = match env::var("SERVER_URL") {
        Ok(v) => v,
        Err(_) => "https://telelink.fcoury.com".to_string(),
    };

    match &value.action {
        Action::List(list) => {
            let mut filters = Vec::new();
            if list.all {
                filters.push("status:all")
            }
            let response: LinksResponse =
                reqwest::get(format!("{}/links?q={}", url, filters.join(",")))
                    .await?
                    .json()
                    .await?;

            if let Some(links) = response.links {
                if links.len() > 0 {
                    println!("Found {} links:\n", links.len());
                    let mut table = Table::new();
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
                        println!("{}. {} ({})", i + 1, link.title.yellow(), duration,);
                        println!("  {}\n", link.url.underline())
                    }
                    return Ok(());
                }
            }

            if response.ok {
                println!("No pending links.")
            } else {
                if let Some(message) = response.message {
                    println!("Error getting links: {}.", message)
                } else {
                    println!("Unknown error getting links.")
                }
            }

            Ok(())
        }
        Action::Next(next) => {
            let mut keepstr = "";
            if next.keep {
                keepstr = "?keep=true";
            }
            let get_url = format!("{}/next{}", url, keepstr);
            let response: LinkResponse = reqwest::get(get_url).await?.json().await?;
            match response.link {
                Some(link) => {
                    println!("Opening {}", link.url);
                    webbrowser::open(&link.url);
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
    }
}

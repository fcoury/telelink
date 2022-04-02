#![allow(unused)]

#[macro_use]
extern crate prettytable;

use clap::{Args, Parser, Subcommand};
use prettytable::format;
use prettytable::{Cell, Row, Table};
use reqwest::Error;
use serde::Deserialize;
use webbrowser;

#[derive(Parser, Debug)]
#[clap(about, version, author)]
struct Cli {
    #[clap(subcommand)]
    action: Action,
}

#[derive(Args, Debug)]
struct Next {
    #[clap(long)]
    keep: bool,
}

#[derive(Subcommand, Debug)]
enum Action {
    List,
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

    match &value.action {
        Action::List => {
            let response: LinksResponse = reqwest::get("https://telelinkx.herokuapp.com/links")
                .await?
                .json()
                .await?;

            if let Some(links) = response.links {
                if links.len() > 0 {
                    let mut table = Table::new();
                    table.set_format(*format::consts::FORMAT_NO_BORDER_LINE_SEPARATOR);
                    table.set_titles(row![FY => "Title", "URL"]);
                    for link in links.iter() {
                        table.add_row(row![link.title, link.url]);
                    }
                    table.printstd();
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
            let url = format!("https://telelinkx.herokuapp.com/next{}", keepstr);
            let response: LinkResponse = reqwest::get(url).await?.json().await?;
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

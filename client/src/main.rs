#![allow(unused)]
mod commands;
mod types;

use clap::{Args, Parser, Subcommand};
use commands::list;
use reqwest::Error;
use serde::Deserialize;
use std::env;
use webbrowser;

#[derive(Parser, Debug)]
#[clap(about, version, author)]
struct Cli {
    #[clap(subcommand)]
    action: Action,
}

#[derive(Subcommand, Debug)]
enum Action {
    #[clap(alias = "l", about = "List saved links")]
    List(types::List),
    #[clap(
        alias = "n",
        about = "Opens the next link in chronological creation order"
    )]
    Next(types::Next),
    #[clap(alias = "o", about = "Opens a give link represented by its id")]
    Open(types::Open),
    #[clap(alias = "del", about = "Deletes a link with a given id")]
    Delete(types::Delete),
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let value = Cli::parse();

    match &value.action {
        Action::List(arg) => {
            commands::list::run(arg).await;
            Ok(())
        }
        Action::Next(arg) => {
            commands::next::run(arg).await;
            Ok(())
        }
        Action::Open(arg) => {
            commands::open::run(arg).await;
            Ok(())
        }
        Action::Delete(arg) => {
            commands::delete::run(arg).await;
            Ok(())
        }
    }
}

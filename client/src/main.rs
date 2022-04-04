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
    List(types::List),
    Next(types::Next),
    Open(types::Open),
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
    }
}

use clap::{Args, Parser, Subcommand};
use serde::Deserialize;

#[derive(Args, Debug)]
pub struct List {
    #[clap(long, help = "Lists all links, not only the pending ones")]
    pub all: bool,
    #[clap(help = "Search term for partial match")]
    pub terms: Option<String>,
}

#[derive(Args, Debug)]
pub struct Next {
    #[clap(
        long,
        help = "Opens the next unvisited link while keeping it unvisited"
    )]
    pub keep: bool,
}

#[derive(Args, Debug)]
pub struct Open {
    #[clap(help = "Link id")]
    pub id: u32,
}

#[derive(Args, Debug)]
pub struct Delete {
    #[clap(help = "Link id")]
    pub id: u32,
}

#[derive(Deserialize, Debug)]
pub struct Link {
    pub id: u32,
    pub url: String,
    pub title: String,
    pub text: Option<String>,
    #[serde(rename(deserialize = "createdAt"))]
    pub created_at: Option<String>,
}

impl Link {
    pub fn open(&self) {
        webbrowser::open(&self.url);
    }
}

#[derive(Deserialize, Debug)]
pub struct LinksResponse {
    pub ok: bool,
    pub message: Option<String>,
    pub links: Option<Vec<Link>>,
}

#[derive(Deserialize, Debug)]
pub struct LinkResponse {
    pub ok: bool,
    pub message: Option<String>,
    pub link: Option<Link>,
}

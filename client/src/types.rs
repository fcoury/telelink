use clap::{Args, Parser, Subcommand};
use serde::Deserialize;

#[derive(Args, Debug)]
pub struct List {
    #[clap(long)]
    pub all: bool,
}

#[derive(Args, Debug)]
pub struct Next {
    #[clap(long)]
    pub keep: bool,
}

#[derive(Args, Debug)]
pub struct Open {
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

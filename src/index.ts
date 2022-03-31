import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import fetch from './fetch';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);

const LINK_REGEX = /(https?:\/\/[^\s]+)/g;

bot.on('text', async (ctx) => {
  const { message } = ctx;
  const { text } = message;

  const matches = text.match(LINK_REGEX);
  if (matches) {
    console.log('matches', matches);
    for (let i = 0; i < matches.length; i++) {
      const url = matches[i];
      try {
        const controller = new AbortController();
        const page = await fetch(url);
        const $ = cheerio.load(await page.text());
        const title = $('title').text();
        ctx.reply(`Found - ${title}`);
      } catch (error) {
        console.error('Error processing', url, error);
        ctx.reply(`Error processing link ${url} - ${(error as Error).message}`);
      }
    }
  } else {
    ctx.reply('No URLs found');
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

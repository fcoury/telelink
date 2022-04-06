import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import sql from './db';
import extract from './extract';
import fetch from './fetch';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);

const LINK_REGEX = /(https?:\/\/[^\s]+)/g;

bot.on('text', async (ctx) => {
  const { message } = ctx;
  const { text } = message;

  const matches = text.match(LINK_REGEX);
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      const url = matches[i];
      try {
        console.log('Adding URL', url);
        const controller = new AbortController();
        const page = await fetch(url);
        const { title, description, image } = extract(await page.text());

        const link = await sql`
          INSERT INTO links (title, url, description, image, text, "createdAt")
          VALUES (
            ${title || null},
            ${url || null},
            ${description || null},
            ${image || null},
            ${text || null},
            CURRENT_TIMESTAMP
          );
        `;

        ctx.reply(`Added - ${title}`);
        console.log('Added', title);
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

console.log('Bot connected and listening...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

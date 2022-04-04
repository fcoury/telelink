#!/usr/bin/env node

import chalk from 'chalk';
import chalkTable from 'chalk-table';
import { program } from 'commander';
import Conf from 'conf';
import dotenv from 'dotenv';
import open from 'open';
import fetch from './fetch';
import { LinkApiResponse, LinksApiResponse } from './types';

dotenv.config();

const conf = new Conf();

program
  .command('list')
  .description('List all the links, pending by default.')
  .action(list);

program.command('next').description('Opens the next unread link.').action(next);

async function list() {
  const apiRoot = process.env.API_ROOT || 'https://telelinkx.herokuapp.com';
  const res = await fetch(`${apiRoot}/links`);
  const result: LinksApiResponse = await res.json();

  if (!result.ok) {
    console.log(result.message);
    return;
  }

  if (!result.links.length) {
    console.log('No pending links.');
    return;
  }

  const options = {
    columns: [
      { field: 'title', name: chalk.yellow('Title') },
      { field: 'url', name: chalk.yellow('Link') },
    ],
  };
  console.log(chalkTable(result.links, options));
}

async function next() {
  const res = await fetch(`${process.env.API_ROOT}/next`);
  const result: LinkApiResponse = await res.json();

  if (!result.ok) {
    console.log(result.message);
    return;
  }

  const { link } = result;
  console.log('Opening', link.title, 'at', link.url);
  open(link.url);
}

program.parse();

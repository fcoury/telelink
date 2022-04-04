import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import sql from './db';
import { Link, LinksApiResponse, NextApiResponse } from './types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const getOnePending = async (): Promise<Link | undefined> => {
  const links = await sql`
    SELECT id, title, url, text, "createdAt"
    FROM links
    WHERE "viewedAt" IS NULL
    ORDER BY "createdAt" LIMIT 1;
  `;

  return links[0] as Link | undefined;
};

type Order = 'createdAt' | 'title';
const getAll = async ({
  q=''
  ,
  order = 'createdAt',
}: {
  q: string;
  order?: Order;
}): Promise<Link[]> => {
  const query = q.split(',').reduce((obj, pair) => {
    const [key, value] = pair.split(':');
    obj[key] = value;
    return obj;
  }, {});
  console.log(query);
  
  return await sql`
    SELECT id, title, url, text, "createdAt"
    FROM links
    WHERE "viewedAt" IS NULL
    ORDER BY ${order};
  `;
};

const markViewed = async (id: number) => {
  return await sql`
    UPDATE links SET "viewedAt" = CURRENT_TIMESTAMP WHERE id=${id};
  `;
};

app.get('/links', async (req: Request, res: Response<LinksApiResponse>) => {
  const links = await getAll({ q: req.query.q as string });

  res.json({
    ok: true,
    links,
  });
});

app.get('/next', async (req: Request, res: Response<NextApiResponse>) => {
  const { keep } = req.query;
  const link = await getOnePending();

  if (!link) {
    return res.status(404).json({ ok: false, message: 'No further links' });
  }

  if (!keep) {
    await markViewed(link.id);
  }

  res.json({
    ok: true,
    link,
  });
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

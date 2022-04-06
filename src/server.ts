import dedent from 'dedent';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import sql from './db';
import { Link, LinkApiResponse, LinksApiResponse } from './types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const getOnePending = async (): Promise<Link | undefined> => {
  const links = await sql`
    SELECT id, title, url, description, image, text,"viewedAt",  "createdAt"
    FROM links
    WHERE "viewedAt" IS NULL
    ORDER BY "createdAt" LIMIT 1;
  `;

  return links[0] as Link | undefined;
};

type Order = '"createdAt"' | 'title';

const getAll = async ({
  q = '',
  order = '"createdAt"',
}: {
  q: string;
  order?: string;
}): Promise<Link[]> => {
  const query: any = q.split(',').reduce((obj: any, pair) => {
    const [key, value] = pair.split(':');
    if (!value) {
      obj.search = key;
    } else {
      obj[key] = value;
    }
    return obj;
  }, {});

  const where = [];
  if (!query.status || query.status != 'all') {
    where.push('"viewedAt" IS NULL');
  }
  if (query.search) {
    where.push(`"title" ILIKE '${'%' + query.search + '%'}'`);
  }

  const whereStr = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';
  const selectStr = dedent`
    SELECT id, title, url, description, image, text,"viewedAt",  "createdAt"
    FROM links
    ${whereStr}
    ORDER BY ${order}
  `;

  return await sql.unsafe(selectStr);
};

const getOne = async (id: number): Promise<Link | undefined> => {
  const res =
    await sql`SELECT id, title, url, description, image, text,"viewedAt",  "createdAt" FROM links WHERE id = ${id}`;
  return res[0] as Link | undefined;
};

const markViewed = async (id: number) => {
  return await sql`
    UPDATE links SET "viewedAt" = CURRENT_TIMESTAMP WHERE id=${id};
  `;
};

app.get('/links/:id', async (req: Request, res: Response<LinkApiResponse>) => {
  const { id } = req.params;
  const link = await getOne(parseInt(id, 10));
  if (!link) {
    res.json({ ok: false, message: `Link with id ${id} not found.` });
    return;
  }
  res.json({ ok: true, link });
});

app.delete(
  '/links/:id',
  async (req: Request, res: Response<LinkApiResponse>) => {
    const { id } = req.params;
    const data =
      await sql`DELETE FROM links WHERE id = ${id} RETURNING id, title, url, description, image, text, "viewedAt", "createdAt"`;
    const link = data[0] as Link | undefined;
    if (!link) {
      res.json({ ok: false, message: `Link with id ${id} not found.` });
      return;
    }
    res.json({ ok: true, link });
  },
);

app.put(
  '/links/:id/viewed',
  async (req: Request, res: Response<LinkApiResponse>) => {
    const { id } = req.params;
    console.log('Marking as read', id);

    const data =
      await sql`UPDATE links SET "viewedAt" = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id, title, url, description, image, text, "viewedAt", "createdAt"`;
    const link = data[0] as Link | undefined;
    if (!link) {
      res.json({ ok: false, message: `Link with id ${id} not found.` });
      return;
    }
    res.json({ ok: true, link });
  },
);

app.get('/links', async (req: Request, res: Response<LinksApiResponse>) => {
  try {
    const links = await getAll({
      q: req.query.q as string,
      order: req.query.order as string,
    });

    res.json({
      ok: true,
      links,
    });
  } catch (error) {
    console.error(`Error in query: ${error.query}`, error);
    res.json({
      ok: false,
      message: `Error in query: ${error.query} - ${error.message}`,
    });
  }
});

app.get('/next', async (req: Request, res: Response<LinkApiResponse>) => {
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

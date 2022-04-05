import fetch from 'cross-fetch';
import dotenv from 'dotenv';
import sql from '../src/db';
import extract from '../src/extract';

dotenv.config();

async function main() {
  const links = await sql`
    SELECT id, title, url, text, image, "createdAt"
    FROM links
    WHERE "image" IS NULL
    ORDER BY "createdAt";
  `;

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    console.log('link', link);
    const { id } = link;
    const page = await fetch(link.url);
    const { title, description, image } = extract(await page.text());
    console.log('{ id, title, description, image }', {
      id,
      title,
      description,
      image,
    });

    if (!id) continue;

    const res = await sql`
      UPDATE links
      SET
        title=${title || null},
        description=${description || null},
        image=${image || null}
      WHERE id = ${id || null}
    `;
    console.log('res', res);
  }
}

main()
  .then((_) => sql.end())
  .catch(console.error);

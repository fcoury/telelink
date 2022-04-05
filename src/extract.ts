import * as cheerio from 'cheerio';

export default function extract(html: string) {
  const $ = cheerio.load(html);
  const title =
    $('meta[property="og:title"]').attr('content') || $('title').text();
  const description = $('meta[property="og:description"]').attr('content');
  const image = $('meta[property="og:image"]').attr('content');
  return {
    title,
    description,
    image,
  };
}

import { expect } from 'chai';
import extract from '../src/extract';
import { readFixture } from './utils';

describe('extract', async () => {
  let data;

  describe('with a stackoverflow example', async () => {
    beforeEach(async () => {
      const html = readFixture('stackoverflow.html');
      data = extract(html);
    });

    it('extracts the title', async () => {
      expect(data.title).to.eql(
        '"Uncaught SyntaxError: Cannot use import statement outside a module" when importing ECMAScript 6',
      );
    });

    it('extracts the description', async () => {
      expect(data.description).to.match(
        /^I'm using ArcGIS JSAPI 4.12 and wish to use Spatial Illusions/,
      );
    });

    it('extracts the image', async () => {
      expect(data.image).to.eql(
        'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded',
      );
    });
  });

  describe('with a random blog example', async () => {
    beforeEach(async () => {
      const html = readFixture('blog.html');
      data = extract(html);
    });

    it('extracts the title', async () => {
      expect(data.title).to.eql('My free-software photography workflow');
    });

    it('extracts the description', async () => {
      expect(data.description).to.match(
        /^In this article I present a step-by-step/,
      );
    });

    it('extracts the image', async () => {
      expect(data.image).to.eql('https://blog.fidelramos.net/images/fidel.jpg');
    });
  });

  describe.only('with Hacker News without any card info', async () => {
    beforeEach(async () => {
      const html = readFixture('hackernews.html');
      data = extract(html);
    });

    it('extracts the title', async () => {
      expect(data.title).to.eql('A database for 2022 | Hacker News');
    });
  });
});

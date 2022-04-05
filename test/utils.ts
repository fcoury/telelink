import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

function fixtureFile(name) {
  return path.join(__dirname, 'fixtures', name);
}

function readFixture(name) {
  const file = fixtureFile(name);
  return readFileSync(file, 'utf8');
}

function readJsonFixture(name) {
  return JSON.parse(readFixture(`${name}.json`));
}

function saveFixture(name, stringContents) {
  const file = fixtureFile(name);
  writeFileSync(file, stringContents);
}

function saveJsonFixture(name, data) {
  saveFixture(`${name}.json`, JSON.stringify(data, null, 2));
}

async function readOrRecordFixture(name, fn) {
  if (!process.env.FORCE && existsSync(fixtureFile(`${name}.json`))) {
    return readJsonFixture(name);
  }

  const result = await fn();
  saveJsonFixture(name, result);
  return result;
}

export { fixtureFile, readFixture, readJsonFixture, readOrRecordFixture };

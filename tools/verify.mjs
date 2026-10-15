import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const html = await readFile('index.html', 'utf8');
const url = 'https://kopikita.mohamad-ismail-mohd-izwan.workers.dev/';
for (const file of ['index.html', 'robots.txt', 'sitemap.xml']) {
  const source = await readFile(file, 'utf8');
  assert(source.includes(url), `${file}: production identity missing`);
  assert(!source.includes('kopikita.ismailstudio.my'), `${file}: stale identity`);
}
const counts = {};
for (const match of html.matchAll(/class="menu-item" data-category="([^"]+)"/g)) counts[match[1]] = (counts[match[1]] || 0) + 1;
assert.deepEqual(counts, { local: 6, espresso: 9, iced: 7, bakes: 8 });
assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs');
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing anchor ${match[1]}`);
for (const match of html.matchAll(/(?:src|href)="((?:assets\/|styles|refinements|script)[^"]+)"/g)) await access(match[1]);
assert(html.includes('KopiKita MY is fictional.'));
assert(!html.includes('"@type": "CafeOrCoffeeShop"'));
execFileSync(process.execPath, ['--check', 'script.js']);
console.log('PASS: 30 products, 4 categories, anchors, asset paths, metadata, disclosure, JavaScript syntax');

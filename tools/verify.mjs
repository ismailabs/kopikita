import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { Script } from 'node:vm';
import { baseline, menuFromHtml } from './menu-contract.mjs';
const html = await readFile('index.html', 'utf8');
const url = 'https://kopikita.ismailstudio.my/';
for (const file of ['index.html', 'robots.txt', 'sitemap.xml']) {
  const source = await readFile(file, 'utf8');
  assert(source.includes(url), `${file}: production identity missing`);
  assert(!source.includes('kopikita.mohamad-ismail-mohd-izwan.workers.dev'), `${file}: stale canonical`);
}
const counts = {};
for (const match of html.matchAll(/class="menu-item" data-category="([^"]+)"/g)) counts[match[1]] = (counts[match[1]] || 0) + 1;
assert.deepEqual(counts, { local: 6, espresso: 9, iced: 7, bakes: 8 });
assert.equal(baseline.length, 30);
assert.deepEqual(menuFromHtml(html), baseline, 'Original names, descriptions, categories and prices must be identical');
assert(html.includes('index,follow,max-image-preview:large') && !html.includes('noindex'), 'Approved V4 fictional CreativeWork must be indexable');
for (const link of html.matchAll(/href="(https:[^"]+)"/g)) {
  assert([url, 'https://ismailstudio.my/', 'https://ismailstudio.my/#contact'].includes(link[1]) || /^https:\/\/(commons\.wikimedia\.org\/wiki\/File:|creativecommons\.org\/)/.test(link[1]), `Unapproved destination ${link[1]}`);
}
assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs');
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing anchor ${match[1]}`);
for (const match of html.matchAll(/(?:src|href)="((?:assets\/|styles|refinements|script)[^"]+)"/g)) await access(match[1]);
assert(html.includes('KopiKita MY is fictional.'));
assert(!html.includes('"@type": "CafeOrCoffeeShop"'));
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(schema['@type'], 'CreativeWork');
assert(!/LocalBusiness|Restaurant|openingHours|aggregateRating/.test(JSON.stringify(schema)));
execFileSync(process.execPath, ['--check', 'script.js']);
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Script(match[1]);
console.log('PASS: 30 exact menu records; 30/6/9/7/8; anchors, assets, canonical, indexable fictional CreativeWork, approved studio/credit links, disclosure, JavaScript syntax');

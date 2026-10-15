import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const base = 'https://kopikita.mohamad-ismail-mohd-izwan.workers.dev/';
const expected = JSON.parse(await readFile('dist/release.json', 'utf8'));
const releaseResponse = await fetch(new URL('release.json', base), { cache: 'no-store' });
assert.equal(releaseResponse.status, 200);
const actual = await releaseResponse.json();
assert.deepEqual(actual, expected, 'Public release must match the local committed build');
const results = [];
for (const [path, hash] of Object.entries(expected.files)) {
  const response = await fetch(new URL(path, base), { cache: 'no-store' });
  assert.equal(response.status, 200, path);
  const body = Buffer.from(await response.arrayBuffer());
  assert.equal(createHash('sha256').update(body).digest('hex'), hash, `Public bytes differ: ${path}`);
  results.push({ path, status: response.status, bytes: body.length, hash });
}
for (const path of ['README.md', 'TESTING.md', 'package.json', 'wrangler.jsonc', '.git/config', '.env']) {
  const response = await fetch(new URL(path, base), { cache: 'no-store' });
  assert.equal(response.status, 404, `Private/source path published: ${path}`);
}
await mkdir('artifacts/production', { recursive: true });
await writeFile('artifacts/production/assets.json', JSON.stringify({ base, commit: actual.commit, checkedAt: new Date().toISOString(), results, privatePathsReturn404: true }, null, 2));
console.log(`PASS: production release ${actual.commit}; all ${results.length} public hashes match; source/private paths return 404`);

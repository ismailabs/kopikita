import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const base = process.env.SITE_URL || 'https://kopikita.ismailstudio.my/';
const expected = JSON.parse(await readFile('dist/release.json', 'utf8'));
const results = [];
const transportRetries = [];
const receipt = { base, commit: expected.commit, startedAt: new Date().toISOString(), results, transportRetries, privatePathsReturn404: false };
async function resource(path) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(new URL(path, base), { cache: 'no-store', signal: AbortSignal.timeout(30000) });
      // Include the complete response body in the transport attempt. A truncated
      // body must never be hashed or mistaken for a successful response.
      const body = Buffer.from(await response.arrayBuffer());
      return { response, body };
    } catch (error) {
      const code = error.cause?.code || error.code || error.name;
      const transient = error.name === 'TimeoutError' || /^(ECONNRESET|ETIMEDOUT|ECONNREFUSED|EAI_AGAIN|UND_ERR_SOCKET|UND_ERR_.*TIMEOUT)$/.test(code);
      transportRetries.push({ path, attempt, error: error.message, code, checkedAt: new Date().toISOString() });
      if (!transient || attempt === 3) throw error;
    }
  }
}
try {
  const { response: releaseResponse, body } = await resource('release.json');
  assert.equal(releaseResponse.status, 200);
  assert.match(releaseResponse.headers.get('cache-control') || '', /no-transform/, 'KopiKita responses must prevent edge HTML injection');
  const actual = JSON.parse(body.toString('utf8'));
  receipt.actualCommit = actual.commit;
  assert.deepEqual(actual, expected, 'Public release must match the local committed build');
  for (const [path, hash] of Object.entries(expected.files)) {
    const { response, body } = await resource(path);
    // Status, manifest, header and hash failures are outside transport retries.
    assert.equal(response.status, 200, path);
    assert.equal(createHash('sha256').update(body).digest('hex'), hash, `Public bytes differ: ${path}`);
    results.push({ path, status: response.status, bytes: body.length, hash });
  }
  for (const path of ['README.md', 'TESTING.md', 'package.json', 'wrangler.jsonc', '_headers', '.git/config', '.env', 'KopiKita-Codex-Handoff/08-CODEX-OPERATING-BRIEF.md', 'KopiKita-V3-Codex-Handoff/README-START-HERE.md', 'KopiKita-V3-Codex-Handoff/CODEX-EXECUTION-BRIEF.md', 'KopiKita-V3-Codex-Handoff/MANIFEST-SHA256.txt', '.agents/skills/web-design-guidelines/SKILL.md', 'skills-lock.json', 'data/menu-baseline.csv', 'tools/build.mjs']) {
    const { response } = await resource(path);
    assert.equal(response.status, 404, `Private/source path published: ${path}`);
  }
  receipt.privatePathsReturn404 = true;
  receipt.status = 'PASS';
  console.log(`PASS: release ${actual.commit} at ${base}; all ${results.length} public hashes match; source/private paths return 404; ${transportRetries.length} recorded transport retries`);
} catch (error) {
  receipt.status = 'FAIL';
  receipt.error = error.message;
  throw error;
} finally {
  receipt.checkedAt = new Date().toISOString();
  await mkdir('artifacts/production', { recursive: true });
  await writeFile(`artifacts/production/assets-${new URL(base).hostname}.json`, JSON.stringify(receipt, null, 2));
}

import { cp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
// Publish an explicit allowlist. Never upload the repository root.
const output = resolve('dist');
if (output !== resolve('.') + '\\dist' && output !== resolve('.') + '/dist') throw new Error('Unexpected build directory');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', 'assets', '_headers']) {
  await cp(file, `${output}/${file}`, { recursive: true });
}
async function filesAt(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(entry => entry.isDirectory() ? filesAt(`${directory}/${entry.name}`) : `${directory}/${entry.name}`));
  return paths.flat().sort();
}
const hashes = {};
for (const path of await filesAt(output)) {
  // Cloudflare consumes this control file; it is not a public asset.
  if (relative(output, path) === '_headers') continue;
  // Git checkouts on Windows and Linux can have different line endings.
  // Normalize public text before hashing so production bytes are reproducible.
  if (/\.(html|css|js|svg|xml|txt)$/.test(path)) {
    await writeFile(path, (await readFile(path, 'utf8')).replaceAll('\r\n', '\n'));
  }
  hashes[relative(output, path).replaceAll('\\', '/')] = createHash('sha256').update(await readFile(path)).digest('hex');
}
let commit = null;
try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* source ZIP */ }
await writeFile(`${output}/release.json`, JSON.stringify({ commit, files: hashes }, null, 2) + '\n');
console.log(`Built ${Object.keys(hashes).length} public files; source commit ${commit}`);

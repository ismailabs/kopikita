import { execFileSync } from 'node:child_process';
const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{50,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
  /(?:api[_-]?key|api[_-]?token|client[_-]?secret|password)\s*[:=]\s*["'][A-Za-z0-9_\-+/=]{20,}["']/i
];
const findings = [];
const files = git(['diff', '--cached', '--name-only', '--diff-filter=ACM']).trim().split('\n').filter(Boolean);
for (const path of files) {
  const text = git(['show', `:${path}`]);
  if (patterns.some(pattern => pattern.test(text))) findings.push(`staged: ${path}`);
  if (/(^|\/)(node_modules|dist|artifacts|\.wrangler|\.env[^/]*|\.dev\.vars[^/]*)(\/|$)/.test(path)) findings.push(`forbidden staged path: ${path}`);
  if (/(^|\/)KopiKita(?:-V[34])?-Codex-Handoff(?:\/|\.zip$)/i.test(path)) findings.push(`forbidden handoff path: ${path}`);
}
for (const commit of git(['rev-list', '--all']).trim().split('\n').filter(Boolean)) {
  const content = git(['show', '--format=', commit]);
  if (patterns.some(pattern => pattern.test(content))) findings.push(`history: ${commit}`);
}
if (findings.length) throw new Error('Secret-pattern scan failed: ' + findings.join(', '));
console.log(`PASS: common secret patterns absent in ${files.length} staged files and reachable commit diffs; forbidden paths absent`);

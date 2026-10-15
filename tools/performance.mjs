import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('artifacts/performance', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', args: ['--remote-debugging-port=9224'] });
try {
  const summary = [];
  for (const [name, url] of [['baseline', 'http://127.0.0.1:4174'], ['upgraded', 'http://127.0.0.1:4173']]) {
    const { lhr, report } = await lighthouse(url, { port: 9224, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    await writeFile(`artifacts/performance/${name}.json`, report);
    summary.push({ name, url, lighthouse: lhr.lighthouseVersion, browser: browser.version(), scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, category]) => [key, category.score * 100])), metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map(key => [key, lhr.audits[key].numericValue])) });
  }
  await writeFile('artifacts/performance/summary.json', JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} finally { await browser.close(); }

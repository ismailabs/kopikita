import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { mkdir, writeFile } from 'node:fs/promises';
const output = process.env.EVIDENCE_DIR || 'artifacts/performance-redesign';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', args: ['--remote-debugging-port=9224'] });
try {
  const summary = [];
  for (const formFactor of (process.env.FORM_FACTORS || 'mobile,desktop').split(',')) {
   for (let run = 1; run <= (formFactor === 'mobile' ? Number(process.env.MOBILE_RUNS || 3) : 1); run++) {
    for (const [name, url] of [['baseline', 'http://127.0.0.1:4174'], ['upgraded', process.env.SITE_URL || 'http://127.0.0.1:4173']]) {
      const desktop = formFactor === 'desktop' ? {formFactor:'desktop',screenEmulation:{mobile:false,width:1350,height:940,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1}} : {};
      const { lhr, report, artifacts } = await lighthouse(url, { port: 9224, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, {extends:'lighthouse:default',settings:desktop});
      await writeFile(`${output}/${name}-${formFactor}-${run}.json`, report);
      if (!artifacts?.Trace) throw new Error('Performance trace missing');
      await writeFile(`${output}/${name}-${formFactor}-${run}-trace.json`, JSON.stringify(artifacts.Trace));
      const result = { name, url, formFactor, run, checkedAt: new Date().toISOString(), lighthouse: lhr.lighthouseVersion, browser: browser.version(), scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, category]) => [key, category.score * 100])), metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map(key => [key, lhr.audits[key].numericValue])) };
      summary.push(result);
      console.log(`${name} ${formFactor} ${run}: performance ${result.scores.performance}, LCP ${Math.round(result.metrics['largest-contentful-paint'])}ms`);
    }
   }
  }
  await writeFile(`${output}/summary.json`, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} finally { await browser.close(); }

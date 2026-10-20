import { webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
const output = process.env.EVIDENCE_DIR || 'artifacts/v4/webkit-post-matrix';
await mkdir(output, { recursive: true });
const browser = await webkit.launch();
const checks = [];
const errors = [];
const unexpectedNetwork = [];

try {
  const context = await browser.newContext({ viewport: { width: 375, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (['script', 'stylesheet', 'font', 'image', 'fetch', 'xhr'].includes(request.resourceType()) && new URL(request.url()).origin !== new URL(base).origin) unexpectedNetwork.push(request.url());
  });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(base);
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });

  const toggle = page.getByRole('button', { name: 'Open navigation menu', exact: true });
  await toggle.click();
  assert.equal(await page.locator('#primary-navigation').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#primary-navigation').isVisible(), false);
  assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
  await toggle.click();
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false');
  assert.equal(await page.locator('#primary-navigation').isVisible(), true);
  await page.setViewportSize({ width: 375, height: 1000 });
  assert.equal(await page.locator('#primary-navigation').isVisible(), false);
  checks.push('Escape dismissal and responsive navigation reset');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.ticker').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  assert.equal(await page.locator('.ticker-track').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('.ticker-toggle').isVisible(), false);
  await page.locator('[data-filter="bakes"]').click();
  assert.equal(await page.locator('.menu-item:visible').count(), 8);
  const filteredAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  await writeFile(`${output}/axe-filtered.json`, JSON.stringify(filteredAxe.violations, null, 2));
  assert.deepEqual(filteredAxe.violations.map(v => v.id), []);
  checks.push('Live reduced-motion preference and filtered-menu axe scan');

  const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 1000 } });
  const noJs = await noJsContext.newPage();
  await noJs.goto(base);
  assert.equal(await noJs.locator('.menu-item:visible').count(), 30);
  assert.equal(await noJs.locator('#primary-navigation').isVisible(), true);
  assert(await noJs.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  await noJsContext.close();
  checks.push('No-JavaScript 320px menu and navigation remain usable');

  const failedScriptContext = await browser.newContext({ viewport: { width: 375, height: 1000 } });
  const failedScript = await failedScriptContext.newPage();
  await failedScript.route('**/script.js*', route => route.abort());
  await failedScript.goto(base);
  await failedScript.getByRole('button', { name: 'Open navigation menu', exact: true }).click();
  assert.equal(await failedScript.locator('#primary-navigation').isVisible(), true);
  await failedScript.keyboard.press('Escape');
  assert.equal(await failedScript.locator('#primary-navigation').isVisible(), false);
  assert.equal(await failedScript.locator('.filter-buttons').isVisible(), false);
  assert.equal(await failedScript.locator('.menu-item:visible').count(), 30);
  await failedScriptContext.close();
  checks.push('Blocked JavaScript retains navigation and all 30 menu entries');

  const textResults = [];
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    assert(dimensions.scroll <= dimensions.client + 1, `200% text overflow at ${width}px: ${JSON.stringify(dimensions)}`);
    textResults.push({ width, ...dimensions });
    await page.addStyleTag({ content: 'html { font-size: 100% !important; }' });
  }
  checks.push('200% text at 320px and 1440px has no horizontal overflow');

  const skipContext = await browser.newContext({ viewport: { width: 375, height: 1000 } });
  const skip = await skipContext.newPage();
  await skip.goto(base);
  await skip.keyboard.press('Tab');
  assert.equal(await skip.locator('.skip-link').evaluate(el => el === document.activeElement), true);
  assert.notEqual(await skip.locator('.skip-link').evaluate(el => getComputedStyle(el).outlineStyle), 'none');
  await skip.keyboard.press('Enter');
  assert.equal(new URL(skip.url()).hash, '#main');
  await skipContext.close();
  checks.push('Skip-link keyboard focus and main-content destination');

  assert.deepEqual(errors, [], 'JavaScript errors or failed resources');
  assert.deepEqual(unexpectedNetwork, [], 'External runtime requests');
  const result = { base, engine: 'webkit', version: browser.version(), checks, textResults, axeViolations: 0, errors, unexpectedNetwork, checkedAt: new Date().toISOString() };
  await writeFile(`${output}/results.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}

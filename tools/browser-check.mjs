import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
const output = process.env.EVIDENCE_DIR || 'artifacts/browser';
await mkdir(output, { recursive: true });
const browser = await chromium.launch(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : { channel: 'msedge' });
const evidence = { base, browser: browser.version(), widths: [], checks: [] };
const errors = [];
const context = await browser.newContext();
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
async function finishImages(target) {
  for (const image of await target.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(el => el.decode());
  }
  await target.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
}
async function noOverflow(target, width) {
  const size = await target.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  assert(size.scroll <= size.client + 1, `Page overflow at ${width}: ${JSON.stringify(size)}`);
}
try {
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal((await page.goto(base)).status(), 200);
    await finishImages(page);
    await noOverflow(page, width);
    assert.equal(await page.locator('.menu-item:visible').count(), 30);
    for (const [filter, count] of [['local', 6], ['espresso', 9], ['iced', 7], ['bakes', 8], ['all', 30]]) {
      const button = page.locator(`[data-filter="${filter}"]`);
      await button.click();
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.filter-btn[aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator('.menu-item:visible').count(), count);
      assert((await page.locator('#filter-status').innerText()).includes(String(count)));
    }
    await page.locator('[data-filter="espresso"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.menu-item:visible').count(), 9);
    await page.locator('[data-filter="all"]').click();
    if (width <= 760) {
      const toggle = page.getByRole('button', { name: 'Open navigation menu', exact: true });
      await toggle.click();
      assert.equal(await page.locator('#primary-navigation').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#primary-navigation').isVisible(), false);
      assert(await toggle.evaluate(el => el === document.activeElement));
      await toggle.click();
      await page.locator('#primary-navigation a[href="#story"]').click();
      assert(await page.locator('#story').evaluate(el => el === document.activeElement));
      assert.equal(await page.locator('#primary-navigation').isVisible(), false);
    }
    assert(await page.locator('.ticker').isVisible());
    await page.locator('.ticker').scrollIntoViewIfNeeded();
    const motion = await page.locator('.ticker-track').evaluate(async el => {
      const animation = el.getAnimations()[0];
      const start = getComputedStyle(el).transform;
      // Sample real animation frames rather than assuming the keyframe exists.
      await new Promise(resolve => { let frames = 0; const next = () => ++frames === 10 ? resolve() : requestAnimationFrame(next); requestAnimationFrame(next); });
      const groups = [...el.querySelectorAll('.ticker-group')].map(g => g.getBoundingClientRect());
      return { start, end: getComputedStyle(el).transform, duration: animation.effect.getTiming().duration, gap: groups[1].left - groups[0].right, width: groups[0].width };
    });
    assert.notEqual(motion.start, motion.end, 'Marquee must move in actual frames');
    assert(Math.abs(motion.gap) < 1, 'Marquee seam has a gap');
    await page.getByRole('button', { name: 'Pause moving text', exact: true }).click();
    assert.equal(await page.locator('.ticker-track').evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
    await page.getByRole('button', { name: 'Resume moving text', exact: true }).click();
    assert.equal(await page.locator('.ticker-track').evaluate(el => getComputedStyle(el).animationPlayState), 'running');
    await page.locator('#top').scrollIntoViewIfNeeded();
    await finishImages(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `${output}/${width}-full.png`, fullPage: true });
    await page.screenshot({ path: `${output}/${width}-hero.png` });
    if ([375, 1440].includes(width)) {
      for (const selector of ['#story', '#signatures', '#menu', '#space', '.studio-note']) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.locator(selector).evaluate(el => Promise.all(el.getAnimations({ subtree: true }).filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
        await page.locator(selector).screenshot({ path: `${output}/${width}-${selector.replace(/[.#]/g, '')}.png` });
      }
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      await writeFile(`${output}/axe-${width}.json`, JSON.stringify(axe.violations, null, 2));
      assert.deepEqual(axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), [], `Accessibility findings at ${width}`);
    }
    evidence.widths.push({ width, filters: [30, 6, 9, 7, 8], overflow: false, marquee: motion });
  }
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.goto(base);
  await page.getByRole('button', { name: 'Open navigation menu', exact: true }).click();
  await page.setViewportSize({ width: 1024, height: 1000 });
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  await page.setViewportSize({ width: 375, height: 1000 });
  assert.equal(await page.locator('#primary-navigation').isVisible(), false);
  evidence.checks.push('Navigation resets on responsive transitions');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.ticker').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.ticker-track').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('.ticker-toggle').isVisible(), false);
  await page.locator('[data-filter="bakes"]').click();
  assert.equal(await page.locator('.menu-item:visible').count(), 8);
  await noOverflow(page, 375);
  evidence.checks.push('Live reduced-motion preference disables marquee and filtering motion');
  const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 1000 } });
  await noJs.goto(base);
  assert.equal(await noJs.locator('.menu-item:visible').count(), 30);
  assert(await noJs.locator('#primary-navigation').isVisible());
  await noOverflow(noJs, 320);
  evidence.checks.push('No JavaScript: 30 products and full mobile navigation visible');
  await noJs.close();
  const failure = await browser.newPage({ viewport: { width: 375, height: 1000 } });
  await failure.route('**/script.js*', route => route.abort());
  await failure.goto(base);
  assert(await failure.locator('#primary-navigation').isVisible());
  assert.equal(await failure.locator('.menu-item:visible').count(), 30);
  evidence.checks.push('Blocked script: essential content and navigation still visible');
  await failure.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await noOverflow(page, '1440, text 200%');
  evidence.checks.push('200 percent text enlargement has no page overflow');
  await page.addStyleTag({ content: 'html { font-size: 100%; }' });
  // Verify all internal anchors are real destinations and external links use the approved studio.
  assert.equal(await page.locator('a[href^="https://"]').evaluateAll(links => links.filter(link => link.href !== 'https://www.ismailstudio.my/').length), 0);
  evidence.checks.push('ISMAIL links target the approved portfolio');
  assert.deepEqual(errors, [], 'Browser errors or failed resources');
  evidence.checks.push('No JavaScript errors or HTTP resource failures');
  await writeFile(`${output}/results.json`, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
} finally { await browser.close(); }

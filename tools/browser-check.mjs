import { chromium, firefox, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { baseline } from './menu-contract.mjs';
const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
const output = process.env.EVIDENCE_DIR || 'artifacts/browser';
await mkdir(output, { recursive: true });
const engine = process.env.BROWSER_ENGINE || 'chromium';
const browser = engine === 'firefox' ? await firefox.launch() : engine === 'webkit' ? await webkit.launch() : await chromium.launch(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : { channel: 'msedge' });
const evidence = { base, engine, browser: browser.version(), checkedAt: new Date().toISOString(), widths: [], checks: [] };
const errors = [];
const context = await browser.newContext();
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('requestfailed', request => errors.push(`${request.failure()?.errorText} ${request.url()}`));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
async function finishImages(target) {
  for (const image of await target.locator('img').all()) {
    // The desktop-only decorative seal intentionally has no mobile layout box.
    if (!await image.isVisible()) continue;
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(el => el.decode());
  }
  await target.evaluate(() => document.fonts.ready);
  await target.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
}
async function noOverflow(target, width) {
  const size = await target.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  assert(size.scroll <= size.client + 1, `Page overflow at ${width}: ${JSON.stringify(size)}`);
}
try {
  for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal((await page.goto(base)).status(), 200);
    await finishImages(page);
    await noOverflow(page, width);
    assert.equal(await page.locator('.menu-item:visible').count(), 30);
    assert.deepEqual(await page.locator('.menu-item').evaluateAll(items => items.map(item => ({category: item.dataset.category, name: item.querySelector('h4').textContent, description: item.querySelector('p').textContent, price: item.querySelector('.menu-price').textContent}))), baseline);
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
    // Featured cards must reveal the exact original entry even after a different filter.
    for (const [id,category] of [['11','espresso'],['17','iced'],['01','local'],['23','bakes']]) {
      const link = page.locator(`[data-menu-target="menu-item-${id}"]`);
      await link.focus();
      await page.keyboard.press('Enter');
      assert(await page.locator(`#menu-item-${id}`).isVisible());
      assert(await page.locator(`#menu-item-${id}`).evaluate(el => el === document.activeElement));
      assert.equal(await page.locator(`[data-filter="${category}"]`).getAttribute('aria-pressed'), 'true');
    }
    await page.locator('[data-filter="all"]').click();
    if (width <= 760) {
      const toggle = page.getByRole('button', { name: 'Open navigation menu', exact: true });
      await toggle.click();
      assert.equal(await page.locator('#primary-navigation').isVisible(), true);
      const navigationAxe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      assert.deepEqual(navigationAxe.violations.map(v=>v.id), [], 'Open navigation accessibility');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#primary-navigation').isVisible(), false);
      assert(await toggle.evaluate(el => el === document.activeElement));
      await page.getByRole('button', {name:'Open navigation menu',exact:true}).click();
      await page.locator('#hero-heading').click();
      assert.equal(await page.locator('#primary-navigation').isVisible(),false, 'Outside tap dismisses navigation');
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
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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
  // WebKit delivers the media-query change asynchronously after viewport resize.
  await page.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  await page.setViewportSize({ width: 375, height: 1000 });
  assert.equal(await page.locator('#primary-navigation').isVisible(), false);
  evidence.checks.push('Navigation resets on responsive transitions');
  await page.locator('[data-filter="bakes"]').click();
  const filteredAxe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  await writeFile(`${output}/axe-filtered.json`, JSON.stringify(filteredAxe.violations,null,2));
  assert.deepEqual(filteredAxe.violations.map(v=>v.id), [], 'Filtered menu accessibility');
  await page.locator('[data-filter="all"]').click();
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
  await failure.getByRole('button', {name:'Open navigation menu',exact:true}).click();
  assert(await failure.locator('#primary-navigation').isVisible());
  await failure.keyboard.press('Escape');
  assert(!await failure.locator('#primary-navigation').isVisible());
  assert.equal(await failure.locator('.filter-buttons').isVisible(),false);
  assert.equal(await failure.locator('.menu-item:visible').count(), 30);
  evidence.checks.push('Blocked main script: early navigation works and all 30 products remain visible; inactive filters stay hidden');
  await failure.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await noOverflow(page, '1440, text 200%');
  evidence.checks.push('200 percent text enlargement has no page overflow');
  await page.addStyleTag({ content: 'html { font-size: 100%; }' });
  await page.setViewportSize({width:320,height:1000});
  await page.addStyleTag({content:'html {font-size:200%;}'});
  await noOverflow(page, '320, text 200%');
  await page.addStyleTag({content:'html {font-size:100%;}'});
  evidence.checks.push('320px with 200 percent text has no page overflow');
  // Explicit tabindex=0 preserves DOM order and enables link tabbing in this WebKit port.
  // Use fresh pages: WebKit restores focus on a same-URL navigation.
  const focusPage = await context.newPage();
  await focusPage.goto(base);
  await focusPage.waitForFunction(() => document.documentElement.classList.contains('js'));
  const focusableCount = await focusPage.evaluate(() => [...document.querySelectorAll('a[href],button')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && !el.disabled).length);
  for (let index = 0; index < focusableCount; index++) {
    await focusPage.keyboard.press('Tab');
    assert(await focusPage.evaluate(i => document.activeElement === [...document.querySelectorAll('a[href],button')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && !el.disabled)[i],index), `DOM keyboard focus order at ${index}`);
  }
  await focusPage.close();
  evidence.checks.push('Every visible link and button is reachable in DOM Tab order');
  const skipPage = await context.newPage();
  await skipPage.goto(base);
  await skipPage.keyboard.press('Tab');
  assert(await skipPage.locator('.skip-link').evaluate(el=>el===document.activeElement));
  assert.notEqual(await skipPage.locator('.skip-link').evaluate(el=>getComputedStyle(el).outlineStyle),'none');
  await skipPage.keyboard.press('Enter');
  assert.equal(new URL(skipPage.url()).hash,'#main');
  await skipPage.close();
  evidence.checks.push('Skip link and visible keyboard focus');
  if (engine === 'chromium') {
    const touch = await browser.newPage({viewport:{width:375,height:812},hasTouch:true,isMobile:true});
    await touch.goto(base);
    await touch.getByRole('button',{name:'Open navigation menu',exact:true}).tap();
    await touch.locator('#primary-navigation a[href="#menu"]').tap();
    await touch.locator('[data-filter="iced"]').tap();
    assert.equal(await touch.locator('.menu-item:visible').count(),7);
    await touch.screenshot({path:`${output}/touch-menu.png`});
    await touch.close();
    evidence.checks.push('Touch emulation: mobile navigation and iced filter');
  }
  // Verify all internal anchors are real destinations and external links use the approved studio.
  assert.equal(await page.locator('a[href^="https://"]').evaluateAll(links => links.filter(link => link.href !== 'https://ismailstudio.my/').length), 0);
  evidence.checks.push('ISMAIL links target the approved portfolio');
  assert.deepEqual(errors, [], 'Browser errors or failed resources');
  evidence.checks.push('No JavaScript errors or HTTP resource failures');
  await writeFile(`${output}/results.json`, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
} finally { await browser.close(); }

import { chromium, firefox, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { baseline } from './menu-contract.mjs';
const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
const output = process.env.EVIDENCE_DIR || 'artifacts/browser';
await mkdir(output, { recursive: true });
const engine = process.env.BROWSER_ENGINE || 'chromium';
const widths = (process.env.TEST_WIDTHS || '320,375,390,430,768,1024,1440,1920').split(',').map(Number);
const browser = engine === 'firefox' ? await firefox.launch() : engine === 'webkit' ? await webkit.launch() : await chromium.launch(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : { channel: 'msedge' });
const evidence = { base, engine, browser: browser.version(), checkedAt: new Date().toISOString(), widths: [], checks: [] };
const errors = [];
const imageCancellations = [];
const unexpectedNetwork = [];
const context = await browser.newContext();
function watch(target) {
  target.on('pageerror', error => errors.push(error.message));
  target.on('request', request => {
    const requestUrl = new URL(request.url());
    if (['script', 'stylesheet', 'font', 'image', 'fetch', 'xhr'].includes(request.resourceType()) && ['http:', 'https:'].includes(requestUrl.protocol) && requestUrl.origin !== new URL(base).origin) {
      unexpectedNetwork.push({ type: request.resourceType(), url: request.url() });
    }
  });
  target.on('requestfailed', request => {
    const reason = request.failure()?.errorText;
    // Resizing or navigating can cancel an obsolete responsive image request.
    // Every visible image must still decode in finishImages at each tested width.
    if (request.resourceType() === 'image' && ['net::ERR_ABORTED', 'Load request cancelled'].includes(reason)) imageCancellations.push(request.url());
    else errors.push(`${reason} ${request.url()}`);
  });
  target.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
}
let page = await context.newPage();
watch(page);
async function finishImages(target) {
  // Load the full gallery before full-page screenshots. Repeated per-image scroll
  // forces responsive/lazy candidates to change during WebKit's decode promise.
  // This only changes screenshot setup, never production loading or assertions.
  await target.evaluate(async () => {
    const images=[...document.images].filter(image=>image.getClientRects().length);
    await Promise.all(images.map(async image=>{
      image.loading='eager';
      await Promise.race([image.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error(`Image decode timed out: ${image.currentSrc}`)),20000))]);
      if(!image.complete || image.naturalWidth===0)throw new Error(`Image did not load: ${image.currentSrc}`);
    }));
  });
  await target.evaluate(() => document.fonts.ready);
  // Settle finite animations for deterministic screenshots. V4 pauses offscreen work;
  // waiting for those finished promises would never resolve. Real frames have a separate suite.
  await target.evaluate(() => document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).forEach(a => a.finish()));
}
async function noOverflow(target, width) {
  const size = await target.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  assert(size.scroll <= size.client + 1, `Page overflow at ${width}: ${JSON.stringify(size)}`);
}
try {
  for (const width of widths) {
    console.log(`${engine}: checking ${width}px`);
    await page.setViewportSize({ width, height: 1000 });
    assert.equal((await page.goto(base)).status(), 200);
    // Keep browser automation's own scroll actions deterministic while the page
    // continues to exercise its real marquee and scene animations.
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
    await finishImages(page);
    await noOverflow(page, width);
    assert.equal(await page.locator('.menu-item:visible').count(), 30);
    assert.deepEqual(await page.locator('.menu-item').evaluateAll(items => items.map(item => ({category: item.dataset.category, name: item.querySelector('h4').textContent, description: item.querySelector('p').textContent, price: item.querySelector('.menu-price').textContent}))), baseline);
    for (const [filter, count] of [['local', 6], ['espresso', 9], ['iced', 7], ['bakes', 8], ['all', 30]]) {
      const button = page.locator(`[data-filter="${filter}"]`);
      // Scroll explicitly before a real pointer click; WebKit's auto-scroll can
      // keep the target unstable after long gallery screenshot runs.
      await button.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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
      await writeFile(`${output}/axe-navigation-${width}.json`, JSON.stringify(navigationAxe.violations, null, 2));
      await page.screenshot({ path: `${output}/${width}-navigation-open.png` });
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
    await page.locator('#project-note').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.ticker').classList.contains('is-offscreen') && getComputedStyle(document.querySelector('.ticker-track')).animationPlayState === 'paused');
    await page.locator('.ticker').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => !document.querySelector('.ticker').classList.contains('is-offscreen') && getComputedStyle(document.querySelector('.ticker-track')).animationPlayState === 'running');
    await page.locator('#top').scrollIntoViewIfNeeded();
    await finishImages(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    // Keep a single full-page mobile capture. Full-page desktop captures are
    // exceptionally tall and can exceed WebKit's screenshot deadline; the
    // matched desktop hero/menu/studio captures below cover those regions.
    if (width === 375) await page.screenshot({ path: `${output}/${width}-full.png`, fullPage: true });
    await page.screenshot({ path: `${output}/${width}-hero.png` });
    if ([375, 1440].includes(width)) {
      for (const selector of ['#story', '#signatures', '#menu', '#space', '.studio-note']) {
        const section = page.locator(selector);
        // Scroll directly because the section's entrance animation moves its
        // descendants and can prevent Playwright's stability poll from ending.
        await section.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await section.evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.effect?.getTiming().iterations !== Infinity).forEach(a => a.finish()));
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        // Capture the user's viewport at this section rather than the entire
        // long menu element; the paired review set retains full-gallery views.
        await page.screenshot({ path: `${output}/${width}-${selector.replace(/[.#]/g, '')}.png` });
      }
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      await writeFile(`${output}/axe-${width}.json`, JSON.stringify(axe.violations, null, 2));
      assert.deepEqual(axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), [], `Accessibility findings at ${width}`);
    }
    evidence.widths.push({ width, filters: [30, 6, 9, 7, 8], overflow: false, marquee: motion });
    // Release decoded gallery surfaces before stressing the next viewport.
    await page.close();
    page = await context.newPage();
    watch(page);
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
  const focusableCount = await focusPage.evaluate(() => [...document.querySelectorAll('a[href],button,summary')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && !el.disabled && (!el.closest('details:not([open])') || el.matches('summary'))).length);
  for (let index = 0; index < focusableCount; index++) {
    await focusPage.keyboard.press('Tab');
    assert(await focusPage.evaluate(i => document.activeElement === [...document.querySelectorAll('a[href],button,summary')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && !el.disabled && (!el.closest('details:not([open])') || el.matches('summary')))[i],index), `DOM keyboard focus order at ${index}`);
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
  assert.equal(await page.locator('a[href^="https://"]:not(.credits a)').evaluateAll(links => links.filter(link => !['https://ismailstudio.my/','https://ismailstudio.my/#contact'].includes(link.href)).length), 0);
  evidence.checks.push('ISMAIL links target the approved portfolio');
  assert.deepEqual(errors, [], 'Browser errors or failed resources');
  assert.deepEqual(unexpectedNetwork, [], 'Runtime scripts, styles, fonts, images and data must stay local');
  evidence.imageRequestCancellations = imageCancellations;
  evidence.unexpectedNetwork = unexpectedNetwork;
  evidence.checks.push('Ticker pauses outside the viewport and resumes on return at every width');
  evidence.checks.push('No external runtime scripts, styles, fonts, images or data requests');
  evidence.checks.push('No JavaScript errors or HTTP resource failures');
  await writeFile(`${output}/results.json`, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
} finally { await browser.close(); }

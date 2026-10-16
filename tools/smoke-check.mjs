import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { baseline } from './menu-contract.mjs';
const base = process.env.SITE_URL || 'http://127.0.0.1:4175';
const output = process.env.EVIDENCE_DIR || 'artifacts/staging';
await mkdir(output,{recursive:true});
const browser = await chromium.launch({channel:'msedge'});
const results=[];
try {
 const context = await browser.newContext();
 const page = await context.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 for(const width of [375,1440]) {
  await page.setViewportSize({width,height:1000});
  assert.equal((await page.goto(base)).status(),200);
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://kopikita.ismailstudio.my/');
  assert.deepEqual(await page.locator('.menu-item').evaluateAll(items=>items.map(item=>({category:item.dataset.category,name:item.querySelector('h4').textContent,description:item.querySelector('p').textContent,price:item.querySelector('.menu-price').textContent}))),baseline);
  await page.locator('[data-filter=iced]').click(); assert.equal(await page.locator('.menu-item:visible').count(),7);
  await page.locator('[data-menu-target=menu-item-23]').click(); assert(await page.locator('#menu-item-23').isVisible());
  await page.locator('[data-filter=all]').click();
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  assert.deepEqual(axe.violations.map(v=>v.id),[]);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.screenshot({path:`${output}/${width}-hero.png`});
  results.push({width,menuMatches:true,highlight:true,filter:true,axe:0});
 }
 assert.deepEqual(errors,[]);
 await writeFile(`${output}/results.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),browser:browser.version(),results,errors},null,2));
 console.log('PASS: built/public smoke at 375/1440, exact menu, filters, highlighted target, canonical, zero axe issues and JS errors');
}finally{await browser.close();}

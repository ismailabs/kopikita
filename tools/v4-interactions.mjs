import {chromium,webkit} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
const base=process.env.SITE_URL || 'http://127.0.0.1:4173/';
const output=process.env.EVIDENCE_DIR || 'artifacts/v4/interactions';
const results=[];await mkdir(output,{recursive:true});
for(const [name,engine,options]of[['edge',chromium,{channel:'msedge'}],['webkit',webkit,{}]]){
 const browser=await engine.launch(options);
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto(base);
  const focusable=()=>page.locator('a[href],button,summary').evaluateAll(es=>es.filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.disabled&&(!e.closest('details:not([open])')||e.matches('summary'))).map(e=>({tag:e.tagName,text:e.textContent.slice(0,35)})));
  const list=await focusable();
  for(let i=0;i<list.length;i++){
   await page.keyboard.press('Tab');
   assert.deepEqual(await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent.slice(0,35)})),list[i],`${name}: DOM focus ${i}`);
  }
  await page.locator('summary').focus();await page.keyboard.press('Enter');
  assert.notEqual(await page.locator('#credits').getAttribute('open'),null);
  await page.locator('summary').press('Enter');
  await page.locator('.photo-credit[href="#credit-01"]').click();
  assert.notEqual(await page.locator('#credits').getAttribute('open'),null,'Attribution fragment must reveal its source credit');
  await page.locator('.motion-toggle').click();
  assert.equal(await page.locator('.motion-toggle').getAttribute('aria-pressed'),'true');
  assert(await page.locator('html').evaluate(e=>e.classList.contains('motion-paused')));
  assert.equal(await page.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
  await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
  await page.locator('.motion-toggle').click();
  assert.equal(await page.locator('.motion-toggle').getAttribute('aria-pressed'),'false');
  await page.goto(new URL('?category=bakes#menu-item-11',base).href);
  assert(await page.locator('#menu-item-11').isVisible());
  assert.equal(await page.locator('[data-filter=espresso]').getAttribute('aria-pressed'),'true');
  await page.goto(new URL('#category-iced',base).href);
  assert(await page.locator('#category-iced').isVisible());
  for(const width of [320,1440]){
   await page.setViewportSize({width,height:1000});
   await page.addStyleTag({content:'html{font-size:200%}'});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1));
   await page.screenshot({path:`${output}/${name}-${width}-text200.png`});
   await page.addStyleTag({content:'html{font-size:100%}'});
  }
  await page.evaluate(()=>Promise.all([...document.images].map(image=>{image.loading='eager';return image.decode();})));
  await page.context().setOffline(true);
  await page.locator('[data-filter=bakes]').click();assert.equal(await page.locator('.menu-item:visible').count(),8);
  await page.context().setOffline(false);
  const checks={base,checkedAt:new Date().toISOString(),engine:name,version:browser.version(),controls:list.length,creditsKeyboard:true,creditsFragment:true,globalPause:true,lifecycleEvents:true,conflictingDeepLink:true,text200:true,loadedOfflineControls:true};results.push(checks);
  console.log(JSON.stringify(checks));
 }finally{await browser.close();}
}
await writeFile(`${output}/results.json`,JSON.stringify(results,null,2));

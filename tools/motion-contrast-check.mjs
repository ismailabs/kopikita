import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
const output = process.env.EVIDENCE_DIR || 'artifacts/motion-contrast';
await mkdir(output,{recursive:true});
const results=[];
for(const [name,engine,options] of [['edge',chromium,{channel:'msedge'}],['webkit',webkit,{}]]) {
 const browser=await engine.launch(options);
 try {
  const context=await browser.newContext();
  const page=await context.newPage();
  for(const width of [375,1440]) {
   await page.setViewportSize({width,height:1000});
   await page.goto(base);
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('[data-filter=all]').scrollIntoViewIfNeeded();
   const frozen = await page.evaluate(()=>{
    // Exercise a selected-to-unselected button, then freeze any real transitions.
    document.querySelector('[data-filter=bakes]').click();
    document.querySelector('[data-filter=bakes]').getBoundingClientRect();
    document.querySelector('[data-filter=all]').click();
    document.querySelectorAll('.signature-card').forEach(el=>{
      el.classList.remove('has-entered'); el.getBoundingClientRect(); el.classList.add('has-entered');
    });
    // Freeze actual entrance/filter animations at their first frame, not a CSS approximation.
    const animations=document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity);
    animations.forEach(a=>{a.pause();a.currentTime=0;});
    const buttonAnimations = [...document.querySelectorAll('.filter-btn')].flatMap(el=>el.getAnimations());
    buttonAnimations.forEach(a=>{a.pause();a.currentTime=a.effect.getTiming().duration/2;});
    return animations.length;
   });
   assert(frozen>0,'Real product animations must be present for this regression');
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   await writeFile(`${output}/${name}-${width}.json`,JSON.stringify(axe.violations,null,2));
   assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${name} ${width} first-frame contrast`);
   results.push({engine:name,version:browser.version(),width,frozen,firstFrameAxe:0});
  }
 }finally{await browser.close();}
}
await writeFile(`${output}/results.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),results},null,2));
console.log('PASS: actual paused entrance/filter first frames retain zero axe findings at 375/1440 in Edge and WebKit');

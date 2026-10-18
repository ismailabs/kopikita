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
   for(const sample of [
    {name:'entrance-first-control-mid',entrance:0,control:.5},
    {name:'first',entrance:0,control:0},
    {name:'mid',entrance:.5,control:.5},
    {name:'last',entrance:1,control:1}
   ]) {
   await page.setViewportSize({width,height:1000});
   await page.goto(base);
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('[data-filter=all]').scrollIntoViewIfNeeded();
   const frozen = await page.evaluate(sample=>{
    // Exercise a selected-to-unselected button, then freeze any real transitions.
    document.querySelector('[data-filter=bakes]').click();
    document.querySelector('[data-filter=bakes]').getBoundingClientRect();
    document.querySelector('[data-filter=all]').click();
    document.querySelectorAll('.signature-card').forEach(el=>{
      el.classList.remove('has-entered'); el.getBoundingClientRect(); el.classList.add('has-entered');
    });
    // Freeze actual entrance/filter animations at their first frame, not a CSS approximation.
    const animations=document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity);
    animations.forEach(a=>{a.pause();a.currentTime=Number(a.effect.getTiming().duration)*sample.entrance;});
    const buttonAnimations = [...document.querySelectorAll('.filter-btn')].flatMap(el=>el.getAnimations());
    buttonAnimations.forEach(a=>{a.pause();a.currentTime=Number(a.effect.getTiming().duration)*sample.control;});
    return animations.length;
   },sample);
   assert(frozen>0,'Real product animations must be present for this regression');
   const fadedText = await page.locator('.menu-item h4, .menu-item p, .menu-price, .filter-btn, #filter-status, .signature-copy h3, .signature-copy p, .signature-price').evaluateAll(elements=>elements.flatMap(element=>{
    if(!element.getClientRects().length)return [];
    const faded=[];
    for(let ancestor=element;ancestor;ancestor=ancestor.parentElement){
     const opacity=Number(getComputedStyle(ancestor).opacity);
     if(opacity<1)faded.push({text:element.textContent.trim(),ancestor:ancestor.className||ancestor.tagName,opacity});
    }
    return faded;
   }));
   assert.deepEqual(fadedText,[],`${name} ${width} ${sample.name}: live product/filter text must stay fully opaque`);
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   await writeFile(`${output}/${name}-${width}-${sample.name}.json`,JSON.stringify(axe.violations,null,2));
   assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${name} ${width} ${sample.name} contrast`);
   results.push({engine:name,version:browser.version(),width,sample:sample.name,frozen,axe:0,liveTextFullyOpaque:true});
   }
  }
 }finally{await browser.close();}
}
await writeFile(`${output}/results.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),results},null,2));
console.log('PASS: actual paused entrance/filter first, middle and last frames retain opaque text and zero axe findings at 375/1440 in Edge and WebKit');

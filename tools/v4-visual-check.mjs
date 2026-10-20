import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const output=process.env.EVIDENCE_DIR||'artifacts/v4/visual-final';
const base=process.env.SITE_URL||'http://127.0.0.1:4173';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge'});const results=[];
try{
 for(const width of [1440,390]){
  const viewport={width,height:width===1440?900:844};
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  for(const [version,url] of [['v3','https://kopikita.ismailstudio.my/'],['v4',base]]){
   await page.goto(url);await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode();})));
   for(const [name,selector]of[['hero','.hero'],['menu','#menu'],['studio','.studio-note']]){
    await page.locator(selector).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await page.screenshot({path:`${output}/${version}-${width}-${name}.png`});
   }
  }
  await page.close();
  for(const scene of ['pour','menu','studio']){
   const p=await browser.newPage({viewport});await p.goto(base);await p.evaluate(()=>document.fonts.ready);
   const selector=`[data-scene="${scene}"]`;await p.locator(selector).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   if(scene==='menu')await p.locator('[data-filter="espresso"]').click();
   await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const count=await p.locator(selector).evaluate(el=>{const animations=el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity);window.captureAnimations=animations;animations.forEach(a=>a.pause());return animations.length;});
   assert(count>0,`${width} ${scene}: real native scene animations must exist`);
   const states=[];
   for(const progress of [0,.25,.5,.75,1]){
    const transforms=await p.evaluate(progress=>{for(const a of window.captureAnimations)a.currentTime=Number(a.effect.getTiming().duration)*progress;return window.captureAnimations.map(a=>getComputedStyle(a.effect.target).transform);},progress);
    const opaque=await p.locator(`${selector} h1,${selector} h2,${selector} h3,${selector} h4,${selector} p`).evaluateAll(elements=>elements.every(el=>{for(let p=el;p;p=p.parentElement)if(Number(getComputedStyle(p).opacity)<1)return false;return true;}));
    assert(opaque,`${scene} ${progress}: informative text must remain opaque`);
    await p.screenshot({path:`${output}/${width}-${scene}-${progress*100}.png`});states.push({progress,transforms,opaque});
   }
   assert.notDeepEqual(states[0].transforms,states.at(-1).transforms,`${scene}: scene must visibly change its transforms`);
   results.push({width,scene,animations:count,states});await p.close();
  }
 }
 await writeFile(`${output}/results.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),browser:browser.version(),results},null,2));
 console.log('PASS: matched V3/V4 1440×900 and 390×844 opening/menu/studio; 30 actual signature-scene frame captures with opaque content.');
}finally{await browser.close();}

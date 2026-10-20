import {readFile,writeFile,cp,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='artifacts/v4/visual-final';
const evidence={};
for(const [device,width]of[['desktop',1440],['mobile',390]])for(const version of['v3','v4'])for(const scene of['hero','menu','studio'])evidence[`${version}_${device}_${scene}`]=`${root}/${version}-${width}-${scene}.png`;
evidence.menu_30_contact_sheet='artifacts/v4/photo-contact-sheet.jpg';
for(const [name,scene]of[['hero','pour'],['menu','menu'],['finale','studio']])evidence[`scene_${name}_frames`]=[1440,390].flatMap(width=>[0,25,50,75,100].map(n=>`${root}/${width}-${scene}-${n}.png`));
evidence.visual_review_report='reports/VISUAL-REVIEW.md';
evidence.actual_browser_tests='artifacts/v4/interactions/results.json';
evidence.final_webkit_targeted_matrix='artifacts/v4/final-webkit-desktop-final/results.json';
evidence.final_webkit_post_matrix='artifacts/v4/final-webkit-desktop-final/post-matrix/results.json';
evidence.final_webkit_mobile_capture='artifacts/v4/final-webkit-release/375-full.png';
evidence.final_webkit_desktop_capture='artifacts/v4/final-webkit-release/1440-hero.png';
evidence.final_webkit_1920_capture='artifacts/v4/final-webkit-desktop-final/1920-hero.png';
evidence.final_motion_contrast='artifacts/v4/motion-built-final/results.json';
evidence.performance_comparison='artifacts/v4/perf-optimized/summary.json';
evidence.packaging_dry_run='artifacts/v4/wrangler-dry-run.json';
evidence.real_photo_credits='reports/photo-contact-sheet.html';
evidence.production_verification=null;
evidence.production_baseline_verification='artifacts/production/assets-kopikita.ismailstudio.my.json';
evidence.manual_visual_gate='blocked';
evidence.product_photo_gate='fail';
evidence.release_gate={status:'blocked',missingProducts:['02 Kopi O Kosong','04 Kopi C','19 Gula Melaka Latte','20 Orange Espresso Tonic','22 Coconut Cold Brew','26 Pandan Kaya Roll','30 Mango Fruit Tart']};
evidence.reviewedHtmlSha256=createHash('sha256').update(await readFile('index.html')).digest('hex');
evidence.visualTransformation={status:'blocked',reason:'23/30 genuine photos. Seven exact variants unresolved.',files:Object.values(evidence).filter(v=>typeof v==='string'&&v.startsWith('artifacts/'))};
evidence.technical={status:'pass',reason:'Local source, built preview, browser, accessibility, interaction, performance and Wrangler dry-run checks completed. Release remains blocked by product-photo, overall visual and V4 production-verification gates.'};
await writeFile('reports/evidence.json',JSON.stringify(evidence,null,2)+'\n');
// The supplied checker deliberately permits only evidence inside its handoff root.
// Mirror this small evidence set there so its failure reflects real gate gaps.
const target='KopiKita-V4-Codex-Handoff/REPORTS/execution';await mkdir(target,{recursive:true});
const handoff={...evidence};
for(const [key,value]of Object.entries(evidence)){
 if(typeof value==='string'&&(value.startsWith('artifacts/')||value.startsWith('reports/'))){
  const name=key+'-'+value.split('/').at(-1);await cp(value,`${target}/${name}`);handoff[key]=`REPORTS/execution/${name}`;
 }else if(Array.isArray(value)){
  handoff[key]=[];for(const path of value){const name=path.split('/').at(-1);await cp(path,`${target}/${name}`);handoff[key].push(`REPORTS/execution/${name}`);}
 }
}
await writeFile('KopiKita-V4-Codex-Handoff/REPORTS/evidence.json',JSON.stringify(handoff,null,2)+'\n');
console.log('Recorded real evidence. Photo, overall visual and V4 production gates remain unpassed.');

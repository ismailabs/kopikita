import { readFile, writeFile } from 'node:fs/promises';
import { baseline } from './menu-contract.mjs';
const manifest = JSON.parse(await readFile('data/product-photos.json','utf8'));
const names = {local:'Kopitiam classics',espresso:'The espresso bar',iced:'Over ice',bakes:'From the oven'};
const notes = {local:'Familiar pours. A Malaysian point of view.',espresso:'Small cups. A whole spectrum of character.',iced:'A cooler kind of coffee ritual.',bakes:'The other half of a coffee break.'};
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
let menu = '';
for (const category of Object.keys(names)) {
 menu += `<section class="menu-group" data-menu-group="${category}" id="category-${category}" aria-labelledby="heading-${category}"><div class="category-heading"><h3 id="heading-${category}">${names[category]}</h3><p>${notes[category]}</p></div><div class="menu-gallery">\n`;
 baseline.forEach((item,index) => {
  if (item.category !== category) return;
  const id=String(index+1).padStart(2,'0'); const photo=manifest.find(p=>p.id===id);
  const media = photo?.status==='verified'
   ? `<img src="${photo.path}" srcset="${photo.smallPath} ${photo.smallWidth}w, ${photo.path} ${photo.width}w" sizes="(min-width: 900px) 44vw, (min-width: 600px) 45vw, 90vw" width="${photo.width}" height="${photo.height}" alt="${escape(photo.alt)}" loading="lazy" decoding="async">`
   : `<img class="pending-illustration" src="assets/icons/item-${id}.svg" width="180" height="180" alt="Illustration of ${escape(item.name)}; genuine product photograph pending" loading="lazy"><span class="photo-pending">Photograph to come</span>`;
  menu += `<article class="menu-item" data-category="${category}" id="menu-item-${id}" tabindex="-1"><a class="product-image" href="#menu-item-${id}" aria-label="${escape(item.name)}, ${item.price}">${media}<span class="product-arrow" aria-hidden="true">↗</span></a><div class="product-copy"><div class="product-title"><h4>${item.name}</h4><span class="menu-price">${item.price}</span></div><p>${item.description}</p>${photo?.status==='verified'?`<a class="photo-credit" href="#credit-${id}">Photo: ${escape(photo.creator)}</a>`:''}</div></article>\n`;
 });
 menu+='</div></section>\n';
}
let html=await readFile('index.html','utf8');
html=html.replace(/<!-- MENU START -->[\s\S]*?<!-- MENU END -->/,`<!-- MENU START -->\n${menu}<!-- MENU END -->`);
const credits=manifest.filter(p=>p.status==='verified').map(p=>`<li id="credit-${p.id}"><strong>${escape(baseline[Number(p.id)-1].name)}</strong> — <a href="${escape(p.sourcePage)}">${escape(p.title)}</a> by ${escape(p.creator)}. <a href="${p.licenseUrl}">${escape(p.license)}</a>. Resized, cropped and converted to WebP; adapted photo remains under its stated license. No endorsement implied.</li>`).join('\n');
html=html.replace(/<!-- CREDITS START -->[\s\S]*?<!-- CREDITS END -->/,`<!-- CREDITS START -->\n${credits}<!-- CREDITS END -->`);
// Explicit zero tab stops preserve full link tabbing in the installed WebKit port,
// matching the V3 keyboard safeguard. They preserve normal DOM order everywhere.
html=html.replace(/<a\b(?![^>]*\btabindex=)/g,'<a tabindex="0"');
html=html.replace(/<summary\b(?![^>]*\btabindex=)/g,'<summary tabindex="0"');
await writeFile('index.html',html);
console.log(`Rendered ${baseline.length} exact menu records; ${manifest.filter(p=>p.status==='verified').length}/30 verified photos.`);

import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {baseline} from './menu-contract.mjs';
const photos=JSON.parse(await readFile('data/product-photos.json','utf8'));
assert.equal(photos.length,30,'Photo manifest must cover exactly 30 records');
assert.equal(new Set(photos.map(photo=>photo.id)).size,30,'Photo IDs must be unique');
const html=await readFile('index.html','utf8');
const errors=[];const hashes=new Set();
for(let n=0;n<30;n++){
 const id=String(n+1).padStart(2,'0');const photo=photos.find(p=>p.id===id);
 if(!photo||photo.status!=='verified'){errors.push(`${id} ${baseline[n].name}: genuine licensed matching photograph not verified`);continue;}
 for(const field of ['sourcePage','creator','license','licenseUrl','downloadDate','matchNotes','alt','downloadedSha256']) if(!photo[field])errors.push(`${id}: missing ${field}`);
 for(const path of [photo.path,photo.smallPath]){
  if(!/^assets\/images\/menu-v4\/item-\d{2}(?:-400)?\.webp$/.test(path)){errors.push(`${id}: unsafe image path`);continue;}
  try{await access(path);}catch{errors.push(`${id}: missing ${path}`);}
 }
 if(!html.includes(`src="${photo.path}"`))errors.push(`${id}: photo not integrated`);
 if(hashes.has(photo.downloadedSha256))errors.push(`${id}: duplicated photograph`);
 hashes.add(photo.downloadedSha256);
}
if(errors.length){console.error('RELEASE BLOCKED\n'+errors.join('\n'));process.exit(1);}
const evidence=JSON.parse(await readFile('reports/evidence.json','utf8'));
assert.equal(evidence.visualTransformation.status,'pass','Visual Transformation Gate must pass after photo completion');
for(const path of evidence.visualTransformation.files)await access(path);
const current=createHash('sha256').update(await readFile('index.html')).digest('hex');
assert.equal(evidence.reviewedHtmlSha256,current,'Visual acceptance must match current source');
assert.equal(evidence.technical.status,'pass');
console.log('PASS: 30 verified integrated unique local photographs, current visual acceptance and technical release evidence.');

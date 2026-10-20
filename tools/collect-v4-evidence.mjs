import {readFile,writeFile,cp,mkdir} from 'node:fs/promises';
// Package the reviewed receipt without inventing or resetting acceptance results.
// The source receipt is maintained after inspecting actual test and release output.
const evidence=JSON.parse(await readFile('reports/evidence.json','utf8'));
// The supplied checker deliberately permits only evidence inside its handoff root.
// Mirror the recorded evidence so the supplied checker can inspect real files.
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
console.log('Mirrored reviewed evidence into the local handoff; acceptance statuses were preserved.');

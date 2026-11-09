#!/usr/bin/env node
/* Build registry/reading_queue.csv: 5-paper batches, R1 -> R2 -> R3 order,
 * skipping already QUALITY_CHECKED papers. Batch 1 is the calibration batch. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
function p(l){const o=[];let c='',q=false;for(let i=0;i<l.length;i++){const x=l[i];if(q){if(x==='"'&&l[i+1]==='"'){c+='"';i++;}else if(x==='"')q=false;else c+=x;}else if(x==='"')q=true;else if(x===','){o.push(c);c='';}else c+=x;}o.push(c);return o;}
const rows = fs.readFileSync(path.join(ROOT,'registry','paper_status.csv'),'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(p)
  .map(r => ({id:r[0], status:r[6], note:r[7]}));
const rank = id => { const [g,n]=id.split('-'); return ({R1:0,R2:1,R3:2}[g])*1000 + +n; };
const read = rows.filter(r => r.status === 'QUALITY_CHECKED').sort((a,b)=>rank(a.id)-rank(b.id));
const todo = rows.filter(r => r.status !== 'QUALITY_CHECKED').sort((a,b)=>rank(a.id)-rank(b.id));
const out = ['batch_no,id,status,note_path,notes'];
let batch = 1;
for (const r of read) out.push(`${batch},${r.id},${r.status},${r.note},"calibration batch (completed)"`);
for (let i=0;i<todo.length;i+=5) {
  batch++;
  for (const r of todo.slice(i,i+5)) out.push(`${batch},${r.id},${r.status},${r.note},"planned"`);
}
fs.writeFileSync(path.join(ROOT,'registry','reading_queue.csv'), out.join('\n')+'\n','utf8');
const counts={}; out.slice(1).forEach(l=>{const b=l.split(',')[0];counts[b]=(counts[b]||0)+1;});
console.log('queue written; batches:',Object.keys(counts).length,'| remaining:',todo.length,'| completed:',read.length);
console.log('next batch:', out.slice(1).filter(l=>l.startsWith('2,')).map(l=>l.split(',')[1]).join(' '));

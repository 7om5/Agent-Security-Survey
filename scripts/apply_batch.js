#!/usr/bin/env node
/* Apply a batch result to manifest + status CSVs.
 * JSON: [{id,venue,year,status,deep_read_pages,visually_checked_pages,evidence_count,read_scope,blocking_issue}]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const batch = JSON.parse(fs.readFileSync(path.join(ROOT, process.argv[2]), 'utf8'));
function p(l){const o=[];let c='',q=false;for(let i=0;i<l.length;i++){const x=l[i];if(q){if(x==='"'&&l[i+1]==='"'){c+='"';i++;}else if(x==='"')q=false;else c+=x;}else if(x==='"')q=true;else if(x===','){o.push(c);c='';}else c+=x;}o.push(c);return o;}
function q(v){v=String(v??'');return (v.includes(',')||v.includes('"'))?`"${v.replace(/"/g,'""')}"`:v;}
function updateCsv(file, updater) {
  const lines = fs.readFileSync(path.join(ROOT,file),'utf8').split(/\r?\n/).filter(Boolean);
  const header = p(lines[0]); const idx = Object.fromEntries(header.map((h,i)=>[h,i]));
  const out = [header.join(',')];
  let n=0;
  for (const line of lines.slice(1)) {
    const c = p(line); const b = batch.find(x=>x.id===c[idx.id]);
    if (b) { updater(c, idx, b); n++; }
    out.push(c.map(q).join(','));
  }
  fs.writeFileSync(path.join(ROOT,file), out.join('\n')+'\n','utf8');
  return n;
}
const n1 = updateCsv('registry/paper_manifest.csv', (c,i,b)=>{
  if (b.venue !== undefined) c[i.venue] = b.venue ?? '';
  if (b.year !== undefined) c[i.year] = b.year ?? '';
});
const n2 = updateCsv('registry/paper_status.csv', (c,i,b)=>{
  c[i.status] = b.status;
  c[i.extracted_pages] = c[i.total_pages];
  c[i.deep_read_pages] = String(b.deep_read_pages);
  c[i.visually_checked_pages] = String(b.visually_checked_pages || 0);
  c[i.evidence_count] = String(b.evidence_count);
  c[i.reviewed_at] = b.reviewed_at || '2026-11-03';
  c[i.blocking_issue] = b.blocking_issue || '';
  c[i.read_scope] = b.read_scope || '';
  if (i.browsed_pages !== undefined) {
    c[i.browsed_pages] = String(Math.max(0, (+c[i.total_pages]) - (+b.deep_read_pages)));
  }
  if (i.uncovered_pages !== undefined) c[i.uncovered_pages] = '0';
});
console.log(`updated manifest rows ${n1}, status rows ${n2}`);

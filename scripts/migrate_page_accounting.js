#!/usr/bin/env node
/* Add mutually exclusive page-accounting columns.
 * For started papers: total = deep_read + browsed + uncovered.
 * For NOT_STARTED papers: total is counted as not_started (deep=browsed=uncovered=0).
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const csvPath = path.join(ROOT, 'registry', 'paper_status.csv');
function p(l){const o=[];let c='',q=false;for(let i=0;i<l.length;i++){const x=l[i];if(q){if(x==='"'&&l[i+1]==='"'){c+='"';i++;}else if(x==='"')q=false;else c+=x;}else if(x==='"')q=true;else if(x===','){o.push(c);c='';}else c+=x;}o.push(c);return o;}
function q(v){v=String(v??'');return (v.includes(',')||v.includes('"'))?`"${v.replace(/"/g,'""')}"`:v;}
const lines = fs.readFileSync(csvPath,'utf8').split(/\r?\n/).filter(Boolean);
const rows = lines.map(p);
let header = rows[0];
if (header.includes('browsed_pages')) { console.log('already migrated'); process.exit(0); }
const idx = Object.fromEntries(header.map((h,i)=>[h,i]));
const insertAt = idx.deep_read_pages + 1;
header = [...header.slice(0, insertAt), 'browsed_pages', 'uncovered_pages', ...header.slice(insertAt)];
const out = [header.join(',')];
for (const r of rows.slice(1)) {
  const total = +r[idx.total_pages], deep = +r[idx.deep_read_pages], status = r[idx.status];
  let browsed = 0, uncovered = 0;
  if (status === 'QUALITY_CHECKED') { browsed = total - deep; if (browsed < 0) throw new Error('negative browsed ' + r[0]); }
  // NOT_STARTED: deep/browsed/uncovered all 0; total counted in not_started aggregate.
  const nr = [...r.slice(0, insertAt), String(browsed), String(uncovered), ...r.slice(insertAt)];
  out.push(nr.map(q).join(','));
}
fs.writeFileSync(csvPath, out.join('\n')+'\n','utf8');
console.log('migrated', rows.length-1, 'rows');

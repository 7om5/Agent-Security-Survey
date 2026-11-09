#!/usr/bin/env node
/* Add deep_read_pages + read_scope columns; never infer deep reading from total_pages. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const csvPath = path.join(ROOT, 'registry', 'paper_status.csv');
function p(l){const o=[];let c='',q=false;for(let i=0;i<l.length;i++){const x=l[i];if(q){if(x==='"'&&l[i+1]==='"'){c+='"';i++;}else if(x==='"')q=false;else c+=x;}else if(x==='"')q=true;else if(x===','){o.push(c);c='';}else c+=x;}o.push(c);return o;}
const lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/).filter(Boolean);
const rows = lines.map(p);
const old = rows[0];
if (old.includes('deep_read_pages')) { console.log('already migrated'); process.exit(0); }
const header = [...old.slice(0, 5), 'deep_read_pages', ...old.slice(5), 'read_scope'];
const out = [header.join(',')];
for (const r of rows.slice(1)) {
  const id = r[0], status = r[6], total = r[3];
  let deep = 0, scope = '';
  if (status === 'QUALITY_CHECKED') {
    if (id === 'R1-01') { deep = 16; scope = 'pp.2-15 body + p.21 Appendix A; pp.16-20 references browsed only'; }
    if (id === 'R2-07') { deep = 17; scope = 'pp.1-9 body + pp.14-21 Appendices A-E; pp.10-13 references browsed only'; }
    if (id === 'R3-01') { deep = 17; scope = 'pp.2-15 body + pp.19-21 appendix/Table 14; pp.16-18 references browsed only'; }
    if (id === 'R3-10') { deep = 22; scope = 'pp.1-9 body + pp.13-25 Appendices A-U; pp.10-12 references browsed only'; }
    if (id === 'R3-80') { deep = 54; scope = 'pp.1-29 body + pp.35-59 Appendices B-H and Protocol 2; pp.30-34 references browsed only'; }
  }
  const row = [...r.slice(0, 5), String(deep), ...r.slice(5), scope];
  out.push(row.map(v => (v.includes(',') || v.includes('"')) ? `"${v.replace(/"/g, '""')}"` : v).join(','));
}
fs.writeFileSync(csvPath, out.join('\n') + '\n', 'utf8');
console.log('migrated', rows.length - 1, 'rows; new header:', header.join(','));

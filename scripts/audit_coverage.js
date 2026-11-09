#!/usr/bin/env node
/* Audit paper_status.csv with mutually exclusive page accounting.
 * total = deep_read + browsed + uncovered + not_started (paper wholly unread).
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
function p(l){const o=[];let c='',q=false;for(let i=0;i<l.length;i++){const x=l[i];if(q){if(x==='"'&&l[i+1]==='"'){c+='"';i++;}else if(x==='"')q=false;else c+=x;}else if(x==='"')q=true;else if(x===','){o.push(c);c='';}else c+=x;}o.push(c);return o;}
const csv = fs.readFileSync(path.join(ROOT,'registry','paper_status.csv'),'utf8');
const rows = csv.split(/\r?\n/).slice(1).filter(Boolean).map(p);
const H = csv.split(/\r?\n/)[0].split(',').reduce((a,h,i)=>(a[h]=i,a),{});
let errors = [], byStatus = {}, deep=0, browsed=0, uncovered=0, notStarted=0, total=0;
for (const r of rows) {
  const id=r[H.id], status=r[H.status], tp=+r[H.total_pages], dp=+r[H.deep_read_pages];
  const bp=+r[H.browsed_pages], up=+r[H.uncovered_pages], ep=+r[H.evidence_count];
  total += tp; byStatus[status]=(byStatus[status]||0)+1;
  if (status !== 'NOT_STARTED') {
    deep += dp; browsed += bp; uncovered += up;
    if (dp + bp + up !== tp) errors.push(`${id}: deep ${dp} + browsed ${bp} + uncovered ${up} != total ${tp}`);
    const note = path.join(ROOT, r[H.note_path]);
    if (!fs.existsSync(note)) errors.push(`${id}: missing note ${r[H.note_path]}`);
    else if (fs.statSync(note).size < 2000) errors.push(`${id}: note suspiciously small`);
    if (dp <= 0) errors.push(`${id}: ${status} but deep_read_pages=0`);
    if (ep <= 0) errors.push(`${id}: ${status} but evidence_count=0`);
  } else {
    notStarted += tp;
    if (dp !== 0 || bp !== 0 || up !== 0) errors.push(`${id}: NOT_STARTED but deep/browsed/uncovered nonzero`);
  }
}
console.log('rows:', rows.length, '| status:', JSON.stringify(byStatus));
console.log(`deep=${deep} browsed=${browsed} uncovered=${uncovered} not_started=${notStarted} sum=${deep+browsed+uncovered+notStarted} total=${total}`);
console.log(`deep-read coverage: ${deep}/${total} (${(100*deep/total).toFixed(2)}%)`);
console.log(errors.length ? 'AUDIT ERRORS:\n' + errors.join('\n') : 'AUDIT OK');

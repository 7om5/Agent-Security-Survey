const fs = require('fs');
const ps = fs.readFileSync('registry/papers.jsonl', 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const moves = { 'R2-09': 'I1', 'R2-10': 'D2', 'R3-27': 'D2', 'R3-57': 'I1', 'R3-59': 'C4', 'R3-75': 'B4', 'R3-85': 'D4' };
const rows = ps.map(p => [
  p.id,
  p.title,
  p.year ?? '',
  p.venue || '',
  p.reviewed_category,
  moves[p.id] || p.reviewed_category,
  '', '', '', '', ''
]);
const esc = s => '"' + String(s).replace(/"/g, '""') + '"';
const header = 'id,title,year,venue,old_primary,new_primary,secondary_categories,cross_tags,confidence,evidence_note,boundary_note';
fs.writeFileSync('work/phase2/baseline_mapping.csv', [header, ...rows.map(r => r.map(esc).join(','))].join('\n'));
console.log('rows', rows.length);

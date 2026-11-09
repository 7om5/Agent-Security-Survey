const fs = require('fs');

const papers = fs.readFileSync('registry/papers.jsonl', 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const paperById = Object.fromEntries(papers.map(p => [p.id, p]));

const leaves = ['A1','A2','A3','B1','B2','B3','B4','C1','C2','C3','C4','D1','D2','D3','D4','E1','E2','E3','F1','F2','F3','G1','G2','G3','G4','H1','H2','H3','I1','I2','I3'];
const tags = new Set(['identity','delegation','capability','least-privilege','access-control','consent','attestation','provenance','audit','verifiable-execution','isolation','sandbox','policy','privacy','pii','confidentiality','integrity','availability','accountability','memory','multi-agent','mcp','skills','tool-selection','web','mobile','gui','cua','prompt-injection','jailbreak','backdoor','benchmark','sok-position','human-in-the-loop']);

const audits = [];
for (let b = 1; b <= 6; b++) {
  const p = `work/phase2/audit_batch${b}.jsonl`;
  const rows = fs.readFileSync(p, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  audits.push(...rows);
}
const auditById = Object.fromEntries(audits.map(a => [a.id, a]));

const errors = [];
if (audits.length !== 124) errors.push(`audit rows ${audits.length} != 124`);
if (new Set(audits.map(a => a.id)).size !== audits.length) errors.push('duplicate audit IDs');
for (const p of papers) {
  const a = auditById[p.id];
  if (!a) { errors.push(`missing audit ${p.id}`); continue; }
  if (!leaves.includes(a.proposed_primary)) errors.push(`${p.id} bad primary ${a.proposed_primary}`);
  if (a.proposed_primary === 'B4' && !['B4a','B4b'].includes(a.subtype)) errors.push(`${p.id} B4 missing subtype`);
  for (const s of a.proposed_secondary || []) if (!leaves.includes(s)) errors.push(`${p.id} bad secondary ${s}`);
  if ((a.proposed_secondary || []).length > 3) errors.push(`${p.id} >3 secondary`);
  if ((a.cross_tags || []).length < 3 || (a.cross_tags || []).length > 6) errors.push(`${p.id} tags ${a.cross_tags.length}`);
  for (const t of a.cross_tags || []) if (!tags.has(t)) errors.push(`${p.id} bad tag ${t}`);
  if (!['high','medium','low'].includes(a.confidence)) errors.push(`${p.id} bad confidence`);
}

const esc = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
const header = ['id','title','year','venue','v1_0_primary','phase1_primary','v1_1_primary','subtype','secondary_categories','cross_tags','confidence','evidence_note','boundary_note','changed'];
const outRows = papers.map(p => {
  const a = auditById[p.id] || {};
  const changed = a.proposed_primary !== p.reviewed_category;
  return [
    p.id, p.title, p.year ?? '', p.venue || '', p.original_category, p.reviewed_category,
    a.proposed_primary || '', a.subtype || '', (a.proposed_secondary || []).join(';'),
    (a.cross_tags || []).join(';'), a.confidence || '', a.evidence || '', a.boundary_note || '',
    changed ? 'yes' : 'no'
  ];
});
fs.writeFileSync('registry/paper_topics_v1_1.csv', [header, ...outRows].map(r => r.map(esc).join(',')).join('\n'));
fs.writeFileSync('registry/paper_topics_v1_1.json', JSON.stringify(papers.map(p => {
  const a = auditById[p.id] || {};
  return {
    id: p.id, title: p.title, year: p.year ?? null, venue: p.venue || '',
    v1_0_primary: p.original_category, phase1_primary: p.reviewed_category,
    v1_1_primary: a.proposed_primary || '', subtype: a.subtype || '',
    secondary_categories: a.proposed_secondary || [], cross_tags: a.cross_tags || [],
    confidence: a.confidence || '', evidence_note: a.evidence || '', boundary_note: a.boundary_note || '',
    changed: a.proposed_primary !== p.reviewed_category
  };
}), null, 1));

const counts = {};
for (const r of outRows) counts[r[6]] = (counts[r[6]] || 0) + 1;
console.log('rows', outRows.length);
console.log('counts', Object.keys(counts).sort().map(k => `${k}:${counts[k]}`).join(' '));
const changes = outRows.filter(r => r[13] === 'yes');
console.log('changed', changes.length);
for (const r of changes) console.log(`CHANGE ${r[0]} ${r[5]} -> ${r[6]}`);
if (errors.length) { console.log('ERRORS'); for (const e of errors) console.log(e); process.exitCode = 1; }
else console.log('VALIDATION OK');

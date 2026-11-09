const fs = require('fs');

const rows = [];
for (let b = 1; b <= 6; b++) {
  const p = `work/phase3/evidence_batch${b}.jsonl`;
  rows.push(...fs.readFileSync(p, 'utf8').trim().split(/\r?\n/).map(JSON.parse));
}
const byId = Object.fromEntries(rows.map(r => [r.id, r]));
const topics = JSON.parse(fs.readFileSync('registry/paper_topics_v1_1.json', 'utf8'));
const meta = JSON.parse(fs.readFileSync('research/phase3/paper_metadata.json', 'utf8'));
const papers = fs.readFileSync('registry/papers.jsonl', 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const paperById = Object.fromEntries(papers.map(p => [p.id, p]));
const metaById = Object.fromEntries(meta.map(m => [m.id, m]));

const errors = [];
if (rows.length !== 124) errors.push(`rows ${rows.length} != 124`);
if (new Set(rows.map(r => r.id)).size !== rows.length) errors.push('duplicate IDs');
for (const t of topics) {
  const r = byId[t.id];
  if (!r) { errors.push(`missing ${t.id}`); continue; }
  for (const k of ['T_paper', 'A_paper', 'T_potential', 'A_potential']) {
    if (!Number.isInteger(r[k]) || r[k] < 0 || r[k] > 5) errors.push(`${t.id} bad ${k}=${r[k]}`);
  }
  if (!['none','existing_primitive','existing_protocol','new_construction'].includes(r.uses_crypto)) errors.push(`${t.id} bad uses_crypto`);
  if (!['none','definitions_only','definitions_and_proof','informal'].includes(r.formal_security)) errors.push(`${t.id} bad formal_security`);
  if (!['high','medium','low'].includes(r.evidence_confidence)) errors.push(`${t.id} bad confidence`);
  if (r.T_paper >= 3 && r.evidence_confidence === 'low') errors.push(`${t.id} T>=3 with low confidence`);
}

const header = ['id','title','year','venue','publication_type','publication_status','metadata_confidence','v1_1_primary','secondary_categories','cross_tags','research_type','uses_crypto','new_construction','formal_security','assumptions_limitations','crypto_interface','T_paper','A_paper','T_potential','A_potential','evidence_ref','evidence_confidence','note'];
const esc = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
const out = topics.map(t => {
  const r = byId[t.id] || {};
  const m = metaById[t.id] || {};
  const p = paperById[t.id] || {};
  return {
    id: t.id, title: p.title, year: m.publication_year, venue: m.venue,
    publication_type: m.publication_type, publication_status: m.publication_status,
    metadata_confidence: m.metadata_confidence, v1_1_primary: t.v1_1_primary,
    secondary_categories: (t.secondary_categories || []).join(';'),
    cross_tags: (t.cross_tags || []).join(';'),
    research_type: r.research_type || '', uses_crypto: r.uses_crypto || '',
    new_construction: r.new_construction ? 'yes' : 'no', formal_security: r.formal_security || '',
    assumptions_limitations: r.assumptions_limitations || '', crypto_interface: r.crypto_interface || '',
    T_paper: r.T_paper, A_paper: r.A_paper, T_potential: r.T_potential, A_potential: r.A_potential,
    evidence_ref: r.evidence_ref || '', evidence_confidence: r.evidence_confidence || '', note: r.note || ''
  };
});
fs.writeFileSync('research/phase3/paper_crypto_evidence.csv', [header, ...out.map(r => header.map(k => r[k]).map(esc).join(','))].join('\n'));
fs.writeFileSync('research/phase3/paper_crypto_evidence.json', JSON.stringify(out, null, 1));

const dist = k => { const m = {}; for (const r of out) m[r[k]] = (m[r[k]] || 0) + 1; return m; };
console.log('rows', out.length);
console.log('T distribution', dist('T_paper'));
console.log('A distribution', dist('A_paper'));
console.log('T>=3', out.filter(r => r.T_paper >= 3).map(r => `${r.id}:${r.T_paper}`).join(' '));
console.log('A>=3', out.filter(r => r.A_paper >= 3).map(r => `${r.id}:${r.A_paper}`).join(' '));
if (errors.length) { console.log('ERRORS'); for (const e of errors) console.log(e); process.exitCode = 1; }
else console.log('VALIDATION OK');

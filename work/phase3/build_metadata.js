const fs = require('fs');
const ps = fs.readFileSync('registry/papers.jsonl', 'utf8').trim().split(/\r?\n/).map(JSON.parse);

const rows = ps.map(p => {
  const id = p.id;
  let type = 'main_conference';
  let status = 'published';
  let conf = p.year && p.year <= 2025 ? 'high' : 'medium';
  let venue = p.venue || '';
  let source = 'notes/<id>.md header; PDF p.1';
  if (!p.venue) {
    type = id === 'R3-80' ? 'unknown' : 'preprint';
    status = 'unconfirmed';
    conf = id === 'R3-80' ? 'low' : 'high';
    venue = id === 'R3-80' ? 'unknown' : 'arXiv preprint';
    source = id === 'R3-80' ? 'PDF p.1 no venue/arXiv ID; notes header' : 'PDF p.1 arXiv ID; notes header';
  } else if (/submitted/i.test(p.venue)) {
    type = 'main_conference';
    status = 'submitted';
    conf = 'high';
    source = 'PDF p.1 footer "Submitted to NeurIPS 2026"';
  } else if (/under review/i.test(p.venue)) {
    type = 'workshop';
    status = 'submitted';
    conf = 'high';
    source = 'PDF p.1 footer "Under review by FAGEN workshop at ICML"';
  } else if (/workshop/i.test(p.venue)) {
    type = 'workshop';
    status = 'published';
    conf = 'high';
    source = 'PDF p.1 workshop footer/Proceedings';
  } else if (id === 'R3-79') {
    type = 'main_conference';
    status = 'accepted_not_published';
    conf = 'high';
    source = 'PDF p.1 "full version of a paper accepted at ACM CCS 2026"';
  } else if (id === 'R3-53') {
    type = 'main_conference';
    status = 'accepted_not_published';
    conf = 'high';
    source = 'PDF p.1 NeurIPS 2026 footer; conference future';
  }
  return {
    id, title: p.title, publication_year: p.year ?? '', venue,
    publication_type: type, publication_status: status,
    metadata_confidence: conf, metadata_source: source
  };
});

const esc = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
const header = ['id','title','publication_year','venue','publication_type','publication_status','metadata_confidence','metadata_source'];
fs.writeFileSync('research/phase3/paper_metadata.csv', [header, ...rows.map(r => header.map(k => r[k]).map(esc).join(','))].join('\n'));
fs.writeFileSync('research/phase3/paper_metadata.json', JSON.stringify(rows, null, 1));

const count = (k) => { const m = {}; for (const r of rows) m[r[k]] = (m[r[k]] || 0) + 1; return m; };
console.log('rows', rows.length);
console.log('type', count('publication_type'));
console.log('status', count('publication_status'));
console.log('confidence', count('metadata_confidence'));
console.log('year', count('publication_year'));

const fs = require('fs');

function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQ = false;
      } else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const tax = JSON.parse(fs.readFileSync('taxonomy/taxonomy_v1_1.json', 'utf8'));
const map = JSON.parse(fs.readFileSync('registry/paper_topics_v1_1.json', 'utf8'));
const csv = parseCsv(fs.readFileSync('registry/paper_topics_v1_1.csv', 'utf8'));
const status = parseCsv(fs.readFileSync('registry/paper_status.csv', 'utf8'));
const papers = fs.readFileSync('registry/papers.jsonl', 'utf8').trim().split(/\r?\n/).map(JSON.parse);

const leaves = Object.keys(tax.leaves);
const tags = new Set(tax.cross_tags);
const errors = [];
const ids = map.map(r => r.id);
if (map.length !== 124) errors.push(`mapping rows ${map.length} != 124`);
if (new Set(ids).size !== 124) errors.push('duplicate mapping IDs');
const statusIds = new Set(status.slice(1).map(r => r[0]));
for (const id of ids) if (!statusIds.has(id)) errors.push(`missing status ${id}`);
for (const id of ids) if (!['R3-51','R3-78','XX-01','XX-02','XX-03','XX-04'].includes(id)) continue; else errors.push(`excluded ID present ${id}`);

const counts = {};
for (const r of map) {
  if (!leaves.includes(r.v1_1_primary)) errors.push(`${r.id} bad primary ${r.v1_1_primary}`);
  if (r.v1_1_primary === 'B4' && !['B4a','B4b'].includes(r.subtype)) errors.push(`${r.id} B4 bad subtype ${r.subtype}`);
  if (r.v1_1_primary !== 'B4' && r.subtype) errors.push(`${r.id} non-B4 subtype ${r.subtype}`);
  for (const s of r.secondary_categories || []) if (!leaves.includes(s)) errors.push(`${r.id} bad secondary ${s}`);
  if ((r.secondary_categories || []).length > 3) errors.push(`${r.id} >3 secondary`);
  if ((r.cross_tags || []).length < 3 || (r.cross_tags || []).length > 6) errors.push(`${r.id} tags ${(r.cross_tags || []).length}`);
  for (const t of r.cross_tags || []) if (!tags.has(t)) errors.push(`${r.id} bad tag ${t}`);
  counts[r.v1_1_primary] = (counts[r.v1_1_primary] || 0) + 1;
}
const sum = Object.values(counts).reduce((a, b) => a + b, 0);
if (sum !== 124) errors.push(`primary sum ${sum} != 124`);
for (const l of leaves) if (!counts[l]) errors.push(`empty leaf ${l}`);
const paperIds = new Set(papers.map(p => p.id));
for (const id of ids) if (!paperIds.has(id)) errors.push(`missing paper ${id}`);
if (csv.length - 1 !== 124) errors.push(`csv rows ${csv.length - 1} != 124`);
const csvIds = csv.slice(1).map(r => r[0]);
if (new Set(csvIds).size !== 124) errors.push('csv duplicate IDs');
for (const id of ids) if (!csvIds.includes(id)) errors.push(`csv missing ${id}`);

console.log('papers', map.length, 'primary sum', sum, 'leaves', leaves.length, 'tags', tags.size);
console.log('counts', Object.keys(counts).sort().map(k => `${k}:${counts[k]}`).join(' '));
const conf = {};
for (const r of map) conf[r.confidence] = (conf[r.confidence] || 0) + 1;
console.log('confidence', conf);
if (errors.length) { console.log('ERRORS'); for (const e of errors) console.log(e); process.exitCode = 1; }
else console.log('AUDIT OK');

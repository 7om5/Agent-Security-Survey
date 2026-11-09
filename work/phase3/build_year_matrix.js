const fs = require('fs');
const ev = JSON.parse(fs.readFileSync('research/phase3/paper_crypto_evidence.json', 'utf8'));
const meta = JSON.parse(fs.readFileSync('research/phase3/paper_metadata.json', 'utf8'));
const tax = JSON.parse(fs.readFileSync('taxonomy/taxonomy_v1_1.json', 'utf8'));
const byId = Object.fromEntries(meta.map(m => [m.id, m]));
const leaves = Object.keys(tax.leaves);
const parents = [...new Set(leaves.map(l => l[0]))].sort();

function row(level, code, name, items) {
  const pub = items.filter(x => {
    const m = byId[x.id];
    return m.publication_type === 'main_conference' && m.publication_status === 'published';
  });
  const ids = y => pub.filter(x => String(byId[x.id].publication_year) === y).map(x => x.id).sort();
  return {
    level, code, name,
    n_total: items.length,
    n_pub_main: pub.length,
    y2024_n: ids('2024').length, y2024_ids: ids('2024').join(' '),
    y2025_n: ids('2025').length, y2025_ids: ids('2025').join(' '),
    y2026_n: ids('2026').length, y2026_ids: ids('2026').join(' '),
    non_main_ids: items.filter(x => !pub.some(p => p.id === x.id)).map(x => x.id).sort().join(' ')
  };
}

const rows = [];
for (const p of parents) {
  rows.push(row('primary', p, tax.primary[p], ev.filter(x => x.v1_1_primary[0] === p)));
}
for (const l of leaves) {
  rows.push(row('leaf', l, tax.leaves[l], ev.filter(x => x.v1_1_primary === l)));
}

const header = ['level','code','name','n_total','n_pub_main','y2024_n','y2024_ids','y2025_n','y2025_ids','y2026_n','y2026_ids','non_main_ids'];
const esc = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
fs.writeFileSync('research/phase3/direction_year_matrix.csv', [header, ...rows.map(r => header.map(k => r[k]).map(esc).join(','))].join('\n'));
console.log(`wrote ${rows.length} rows`);
for (const r of rows.filter(x => x.level === 'leaf')) {
  console.log(`${r.code}: 2024=[${r.y2024_ids}] 2025=[${r.y2025_ids}] 2026=[${r.y2026_ids}] nonmain=[${r.non_main_ids}]`);
}

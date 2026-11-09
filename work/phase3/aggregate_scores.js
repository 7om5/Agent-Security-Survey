const fs = require('fs');

const papers = JSON.parse(fs.readFileSync('research/phase3/paper_crypto_evidence.json', 'utf8'));
const tax = JSON.parse(fs.readFileSync('taxonomy/taxonomy_v1_1.json', 'utf8'));
const leaves = Object.keys(tax.leaves);
const parents = [...new Set(leaves.map(l => l[0]))].sort();

const w = { high: 1.0, medium: 0.7, low: 0.4 };
function wmedian(items, key) {
  const arr = items.map(x => ({ s: x[key], w: w[x.evidence_confidence] || 0.4 })).filter(x => Number.isFinite(x.s));
  if (!arr.length) return 0;
  const total = arr.reduce((a, b) => a + b.w, 0);
  arr.sort((a, b) => a.s - b.s);
  let c = 0;
  for (const x of arr) { c += x.w; if (c >= total / 2) return x.s; }
  return arr[arr.length - 1].s;
}
function maxOf(items, key) { return items.length ? Math.max(...items.map(x => x[key])) : 0; }
function countBy(items, fn) { const m = {}; for (const x of items) { const k = fn(x); m[k] = (m[k] || 0) + 1; } return m; }

function hScores(items) {
  const pubMain = items.filter(x => x.publication_type === 'main_conference' && x.publication_status === 'published');
  const n = pubMain.length;
  const vol = n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n <= 4 ? 3 : n <= 7 ? 4 : 5;
  const y = countBy(pubMain, x => String(x.year));
  const y24 = y['2024'] || 0, y25 = y['2025'] || 0, y26 = y['2026'] || 0;
  let mom = 0;
  if (n === 0) mom = 0;
  else if (n <= 2) {
    mom = y26 >= 1 ? 3 : y25 >= 1 ? 2 : 1;
  } else if (y26 >= 3 && (y25 + y24) >= 1) mom = 5;
  else if (y26 >= 2 && (y25 + y24) >= 1) mom = 4;
  else if (y24 && y25 && y26) mom = 3;
  else if (y26 && !y25 && !y24) mom = 3;
  else if (y25 && !y26) mom = 2;
  else if (y24 && !y25 && !y26) mom = 1;
  else mom = 2;
  const venues = new Set(items.map(x => x.venue)).size;
  const types = new Set(items.map(x => x.research_type).filter(Boolean)).size;
  let breadth = 1;
  if (items.length === 0) breadth = 0;
  else if (items.length === 1) breadth = 1;
  else if (venues === 1 && types <= 2) breadth = 2;
  else if (venues >= 2 || types >= 2) breadth = 3;
  else breadth = 2;
  if (venues >= 3 && types >= 3) breadth = 4;
  if (venues >= 4 && types >= 4) breadth = 5;
  const H = Math.round((0.30 * vol + 0.45 * mom + 0.25 * breadth) * 10) / 10;
  return { H, H_volume: vol, H_momentum: mom, H_breadth: breadth, n_pub_main: n, y24, y25, y26, venues, types };
}

function summarize(items, code, name, level) {
  const h = hScores(items);
  const T = wmedian(items, 'T_paper');
  const A = wmedian(items, 'A_paper');
  return {
    level, code, name, n_total: items.length, n_pub_main: h.n_pub_main,
    y2024: h.y24, y2025: h.y25, y2026: h.y26,
    H_volume: h.H_volume, H_momentum: h.H_momentum, H_breadth: h.H_breadth, H: h.H,
    T_dir: T, T_ceiling: maxOf(items, 'T_paper'),
    A_dir: A, A_ceiling: maxOf(items, 'A_paper'),
    T_potential_max: maxOf(items, 'T_potential'), A_potential_max: maxOf(items, 'A_potential'),
    n_crypto_use: items.filter(x => x.uses_crypto && x.uses_crypto !== 'none').length,
    n_new_construction: items.filter(x => x.new_construction === 'yes').length,
    n_formal_proof: items.filter(x => x.formal_security === 'definitions_and_proof').length,
    T_scores: items.map(x => `${x.id}:${x.T_paper}`).join(' '),
    A_scores: items.map(x => `${x.id}:${x.A_paper}`).join(' '),
    low_n: items.length <= 2 ? 'yes' : 'no',
    papers: items.map(x => x.id).join(' ')
  };
}

const leafRows = leaves.map(l => {
  const items = papers.filter(p => p.v1_1_primary === l);
  return summarize(items, l, tax.leaves[l].name, 'leaf');
});
const parentRows = parents.map(p => {
  const items = papers.filter(x => x.v1_1_primary[0] === p);
  return summarize(items, p, tax.primary[p], 'primary');
});
const all = [...parentRows, ...leafRows];
const header = ['level','code','name','n_total','n_pub_main','y2024','y2025','y2026','H_volume','H_momentum','H_breadth','H','T_dir','T_ceiling','A_dir','A_ceiling','T_potential_max','A_potential_max','n_crypto_use','n_new_construction','n_formal_proof','low_n','papers','T_scores','A_scores'];
const esc = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
fs.writeFileSync('research/phase3/direction_scores.csv', [header, ...all.map(r => header.map(k => r[k]).map(esc).join(','))].join('\n'));
fs.writeFileSync('research/phase3/direction_scores.json', JSON.stringify(all, null, 1));

for (const r of parentRows) console.log(`P ${r.code} n=${r.n_total} pub=${r.n_pub_main} H=${r.H} T=${r.T_dir}/${r.T_ceiling} A=${r.A_dir}/${r.A_ceiling}`);
for (const r of leafRows) console.log(`L ${r.code} n=${r.n_total} pub=${r.n_pub_main} H=${r.H} T=${r.T_dir}/${r.T_ceiling} A=${r.A_dir}/${r.A_ceiling} ${r.low_n === 'yes' ? 'LOW_N' : ''}`);

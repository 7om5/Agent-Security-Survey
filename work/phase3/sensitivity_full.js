// Full medium-classification sensitivity for Phase 3 (all 30 medium papers).
// Option A: single-paper perturbations, an all-to-first-alternative boundary scenario,
// and a 10,000-draw random simulation. This is not an exhaustive 2^30 enumeration.
const fs = require('fs');

const ev0 = JSON.parse(fs.readFileSync('research/phase3/paper_crypto_evidence.json', 'utf8'));
const meta = JSON.parse(fs.readFileSync('research/phase3/paper_metadata.json', 'utf8'));
const tax = JSON.parse(fs.readFileSync('taxonomy/taxonomy_v1_1.json', 'utf8'));
const topics = JSON.parse(fs.readFileSync('registry/paper_topics_v1_1.json', 'utf8'));
const baselineRows = JSON.parse(fs.readFileSync('research/phase3/direction_scores_full.json', 'utf8'));
const byId = Object.fromEntries(meta.map(m => [m.id, m]));
const leaves = Object.keys(tax.leaves);
const parents = [...new Set(leaves.map(l => l[0]))].sort();

// Alternatives are evidence-based: first entry is the alternative named in each paper's
// registry boundary_note ("可迁/可归/可争论"), followed by other documented secondary categories.
const ALT = {
  'R3-01': ['F1'],
  'R1-07': ['E2', 'C3'],
  'R2-08': ['B4'],
  'R2-13': ['B4', 'H1'],
  'R2-24': ['C2', 'F2'],
  'R2-25': ['H1'],
  'R3-13': ['B4', 'B2'],
  'R3-14': ['D4', 'F1', 'E2'],
  'R3-15': ['E1', 'H1'],
  'R3-21': ['D3', 'D4', 'A2'],
  'R3-27': ['I1', 'A2'],
  'R3-28': ['G3', 'A2'],
  'R3-30': ['H1', 'E2'],
  'R3-33': ['D2', 'C1'],
  'R3-34': ['A2', 'G2', 'C1'],
  'R3-36': ['G3', 'G2', 'B2'],
  'R3-39': ['D1', 'D3', 'H3'],
  'R3-46': ['A2', 'H1', 'D2'],
  'R3-53': ['H3', 'I1', 'D3'],
  'R3-54': ['A2', 'D4', 'D3'],
  'R3-55': ['G2', 'D4', 'H1'],
  'R3-56': ['H1', 'A3'],
  'R3-58': ['H1', 'G4', 'A2'],
  'R3-62': ['G3', 'H1', 'F3'],
  'R3-63': ['I1'],
  'R3-67': ['G2', 'D2'],
  'R3-74': ['I1', 'D2'],
  'R3-76': ['D3', 'F1'],
  'R3-81': ['C4', 'I1', 'A2'],
  'R3-82': ['D4', 'B3']
};
// "medium" here is taxonomy classification confidence (registry), not evidence confidence.
const mediumIds = topics.filter(t => t.confidence === 'medium').map(t => t.id);
const medium = ev0.filter(x => mediumIds.includes(x.id));
if (medium.length !== 30) throw new Error(`medium count ${medium.length}`);
for (const p of medium) if (!ALT[p.id]) throw new Error(`missing alternative for ${p.id}`);

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
  const pubMain = items.filter(x => {
    const m = byId[x.id];
    return m.publication_type === 'main_conference' && m.publication_status === 'published';
  });
  const n = pubMain.length;
  const vol = n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n <= 4 ? 3 : n <= 7 ? 4 : 5;
  const y = countBy(pubMain, x => String(byId[x.id].publication_year));
  const y24 = y['2024'] || 0, y25 = y['2025'] || 0, y26 = y['2026'] || 0;
  let mom = 0;
  if (n === 0) mom = 0;
  else if (n <= 2) mom = y26 >= 1 ? 3 : y25 >= 1 ? 2 : 1;
  else if (y26 >= 3 && (y25 + y24) >= 1) mom = 5;
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
  return { H, H_volume: vol, H_momentum: mom, H_breadth: breadth, n_pub_main: n, y24, y25, y26 };
}
function summarize(items, code) {
  const h = hScores(items);
  return { code, n: items.length, n_pub_main: h.n_pub_main, H: h.H, V: h.H_volume, M: h.H_momentum, B: h.H_breadth,
    T_dir: wmedian(items, 'T_paper'), T_ceiling: maxOf(items, 'T_paper'),
    A_dir: wmedian(items, 'A_paper'), A_ceiling: maxOf(items, 'A_paper') };
}
function compute(ev) {
  const leaf = {}, parent = {};
  for (const l of leaves) leaf[l] = summarize(ev.filter(x => x.v1_1_primary === l), l);
  for (const p of parents) parent[p] = summarize(ev.filter(x => x.v1_1_primary[0] === p), p);
  return { leaf, parent };
}
function rankMap(rows, key) {
  const sorted = Object.values(rows).slice().sort((a, b) => (b[key] - a[key]) || a.code.localeCompare(b.code));
  const out = {}; sorted.forEach((r, i) => out[r.code] = i + 1);
  return out;
}

// 1. Baseline sanity check against the published direction scores.
const base = compute(ev0);
const diffs = [];
for (const l of leaves) {
  const row = baselineRows.find(r => r.level === 'leaf' && r.code === l);
  if (row.H !== base.leaf[l].H || row.T_dir !== base.leaf[l].T_dir || row.A_dir !== base.leaf[l].A_dir ||
      row.T_ceiling !== base.leaf[l].T_ceiling || row.A_ceiling !== base.leaf[l].A_ceiling) {
    diffs.push(`${l}: csv=${row.H}/${row.T_dir}/${row.A_dir} recomputed=${base.leaf[l].H}/${base.leaf[l].T_dir}/${base.leaf[l].A_dir}`);
  }
}
if (diffs.length) throw new Error('baseline mismatch:\n' + diffs.join('\n'));
const baseRank = rankMap(base.leaf, 'H');

// 2. Single-paper perturbation: one medium paper at a time, each alternative.
const single = [];
for (const p of medium) {
  for (const alt of ALT[p.id]) {
    const ev = ev0.map(x => x.id === p.id ? { ...x, v1_1_primary: alt } : x);
    const s = compute(ev);
    const rank = rankMap(s.leaf, 'H');
    const changed = leaves.filter(l => s.leaf[l].H !== base.leaf[l].H)
      .map(l => ({ code: l, delta: Math.round((s.leaf[l].H - base.leaf[l].H) * 10) / 10, from: base.leaf[l].H, to: s.leaf[l].H }));
    const rankChanged = leaves.filter(l => rank[l] !== baseRank[l])
      .map(l => ({ code: l, from: baseRank[l], to: rank[l] }));
    const keyCrypto = ['B1', 'B4', 'G3', 'G1', 'E3', 'B2', 'B3'].map(l => ({
      code: l, T: s.leaf[l].T_dir, A: s.leaf[l].A_dir, Tc: s.leaf[l].T_ceiling, Ac: s.leaf[l].A_ceiling
    }));
    single.push({ paper: p.id, from: p.v1_1_primary, to: alt, changedH: changed, rankChanged, keyCrypto,
      maxAbsDeltaH: changed.length ? Math.max(...changed.map(c => Math.abs(c.delta))) : 0 });
  }
}

// 3. Boundary scenario: all 30 medium papers to their first alternative.
const boundaryEv = ev0.map(x => ALT[x.id] ? { ...x, v1_1_primary: ALT[x.id][0] } : x);
const boundary = compute(boundaryEv);
const boundaryRank = rankMap(boundary.leaf, 'H');

// 4. Random simulation: 50% stay, otherwise uniform over documented alternatives.
let seed = 20261106;
function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
const DRAWS = 10000;
const samples = {};
for (const l of leaves) samples[l] = { H: [], T: [], A: [], rank: [], Ttop: 0 };
for (let d = 0; d < DRAWS; d++) {
  const ev = ev0.map(x => {
    const alts = ALT[x.id];
    if (!alts) return x;
    if (rnd() < 0.5) return x;
    return { ...x, v1_1_primary: alts[Math.floor(rnd() * alts.length)] };
  });
  const s = compute(ev);
  const rank = rankMap(s.leaf, 'H');
  for (const l of leaves) {
    samples[l].H.push(s.leaf[l].H);
    samples[l].T.push(s.leaf[l].T_dir);
    samples[l].A.push(s.leaf[l].A_dir);
    samples[l].rank.push(rank[l]);
    if (s.leaf[l].H >= 4.5) samples[l].Ttop++;
  }
}
function q(arr, p) { const a = arr.slice().sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(p * a.length))]; }
function mode(arr) { const m = {}; for (const x of arr) m[x] = (m[x] || 0) + 1; return Number(Object.entries(m).sort((a, b) => b[1] - a[1])[0][0]); }
const random = {};
for (const l of leaves) {
  const H = samples[l].H, R = samples[l].rank;
  random[l] = {
    H_min: Math.min(...H), H_p05: q(H, 0.05), H_median: q(H, 0.5), H_p95: q(H, 0.95), H_max: Math.max(...H),
    rank_min: Math.min(...R), rank_median: q(R, 0.5), rank_max: Math.max(...R), rank_mode: mode(R),
    p_top_tier: Math.round(1000 * samples[l].Ttop / DRAWS) / 1000,
    p_rank1: Math.round(1000 * R.filter(x => x === 1).length / DRAWS) / 1000,
    T_values: [...new Set(samples[l].T)].sort(), A_values: [...new Set(samples[l].A)].sort()
  };
}

const out = {
  method: 'all 30 medium papers; single-paper perturbations + all-to-first boundary + 10000 random draws (50% stay, else uniform over documented alternatives)',
  coverage: { medium_papers: medium.length, alternatives_total: Object.values(ALT).reduce((a, b) => a + b.length, 0), single_scenarios: single.length, random_draws: DRAWS, exhaustive: false },
  alternatives: ALT,
  baseline: { leaf: base.leaf, parent: base.parent, rank: baseRank },
  single,
  boundary: { leaf: boundary.leaf, parent: boundary.parent, rank: boundaryRank },
  random
};
fs.writeFileSync('research/phase3/sensitivity_full.json', JSON.stringify(out, null, 1));

// CSV stability table
const head = ['code','name','n','H_base','rank_base','H_min','H_p05','H_median','H_p95','H_max','rank_mode','p_top_tier','p_rank1','T_values','A_values'];
const rows = leaves.map(l => {
  const r = random[l]; const b = base.leaf[l];
  return [l, tax.leaves[l], b.n, b.H, baseRank[l], r.H_min, r.H_p05, r.H_median, r.H_p95, r.H_max, r.rank_mode, r.p_top_tier, r.p_rank1, r.T_values.join('|'), r.A_values.join('|')];
});
const esc = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
fs.writeFileSync('research/phase3/sensitivity_rank_stability.csv', [head, ...rows.map(r => r.map(esc).join(','))].join('\n'));

// Console summary
console.log('coverage', out.coverage);
console.log('baseline top10', Object.entries(baseRank).sort((a, b) => a[1] - b[1]).slice(0, 10).map(x => `${x[0]}:${x[1]}`).join(' '));
const maxShift = single.slice().sort((a, b) => Math.max(...b.rankChanged.map(x => Math.abs(x.to - x.from)), 0) - Math.max(...a.rankChanged.map(x => Math.abs(x.to - x.from)), 0))[0];
console.log('single scenarios with no H change:', single.filter(s => s.changedH.length === 0).length, '/', single.length);
console.log('max single rank shift:', Math.max(...single.flatMap(s => s.rankChanged.map(x => Math.abs(x.to - x.from)))));
console.log('papers causing the largest shift:', maxShift.paper, maxShift.from, '->', maxShift.to);
const key = ['B1', 'B4', 'G3', 'G1', 'E3', 'B2', 'B3'];
for (const l of key) {
  const tv = new Set(single.flatMap(s => s.keyCrypto.filter(k => k.code === l).map(k => `${k.T}/${k.A}/${k.Tc}/${k.Ac}`)));
  console.log(`key ${l} T/A/TC/AC values across single scenarios:`, [...tv].join(' '));
}
console.log('boundary top10', Object.entries(boundaryRank).sort((a, b) => a[1] - b[1]).slice(0, 10).map(x => `${x[0]}:${x[1]}`).join(' '));
console.log('random top-tier probabilities:', leaves.map(l => `${l}:${random[l].p_top_tier}`).filter(s => !s.endsWith(':0')).join(' '));

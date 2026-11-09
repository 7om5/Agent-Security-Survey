const fs = require('fs');

function parseCsv(text) {
  const rows = []; let row = [], cell = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else inQ = false; }
      else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
function table(csvPath) {
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const head = rows[0];
  return rows.slice(1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
function round1(x) { return Math.round(x * 10) / 10; }
function num(x) { return Number(x); }

const tax = JSON.parse(fs.readFileSync('taxonomy/taxonomy_v1_1.json', 'utf8'));
const evJson = JSON.parse(fs.readFileSync('research/phase3/paper_crypto_evidence.json', 'utf8'));
const metaJson = JSON.parse(fs.readFileSync('research/phase3/paper_metadata.json', 'utf8'));
const dirJson = JSON.parse(fs.readFileSync('research/phase3/direction_scores_full.json', 'utf8'));
const dirCsv = table('research/phase3/direction_scores_full.csv');
const evCsv = table('research/phase3/paper_crypto_evidence.csv');
const metaCsv = table('research/phase3/paper_metadata.csv');
const yearCsv = table('research/phase3/direction_year_matrix.csv');
const leaves = Object.keys(tax.leaves);
const parents = [...new Set(leaves.map(l => l[0]))].sort();
const errors = [];
const warn = [];
const EXCLUDED = ['R3-51', 'R3-78', 'XX-01', 'XX-02', 'XX-03', 'XX-04'];

// --- 124-paper integrity ---
if (evJson.length !== 124) errors.push(`evidence rows ${evJson.length}`);
if (metaJson.length !== 124) errors.push(`metadata rows ${metaJson.length}`);
if (evCsv.length !== 124) errors.push(`evidence csv rows ${evCsv.length}`);
if (metaCsv.length !== 124) errors.push(`metadata csv rows ${metaCsv.length}`);
const evIds = evJson.map(r => r.id);
const metaIds = metaJson.map(r => r.id);
if (new Set(evIds).size !== 124) errors.push('evidence duplicate IDs');
if (new Set(metaIds).size !== 124) errors.push('metadata duplicate IDs');
for (const id of evIds) if (!metaIds.includes(id)) errors.push(`metadata missing ${id}`);
for (const id of EXCLUDED) if (evIds.includes(id) || metaIds.includes(id)) errors.push(`excluded paper present ${id}`);
const idSet = new Set(evIds);

// --- taxonomy counts ---
const leafCount = Object.fromEntries(leaves.map(l => [l, evJson.filter(x => x.v1_1_primary === l).length]));
if (evJson.some(x => !leaves.includes(x.v1_1_primary))) errors.push('evidence has unknown primary');
const sumLeaf = Object.values(leafCount).reduce((a, b) => a + b, 0);
if (sumLeaf !== 124) errors.push(`leaf sum ${sumLeaf}`);

// --- metadata status totals ---
const mainPub = metaJson.filter(m => m.publication_type === 'main_conference' && m.publication_status === 'published');
if (mainPub.length !== 110) errors.push(`main published ${mainPub.length} != 110`);
const byYear = y => mainPub.filter(m => String(m.publication_year) === y).length;
if (byYear('2024') !== 10 || byYear('2025') !== 27 || byYear('2026') !== 73) errors.push(`year counts ${byYear('2024')}/${byYear('2025')}/${byYear('2026')}`);
if (metaJson.filter(m => m.publication_status === 'published').length !== 112) errors.push('published total != 112');
if (metaJson.filter(m => m.publication_type === 'preprint').length !== 7) errors.push('preprint count != 7');
if (metaJson.filter(m => m.publication_type === 'unknown').length !== 1) errors.push('unknown count != 1');
if (metaJson.filter(m => m.publication_status === 'submitted').length !== 2) errors.push('submitted count != 2');
if (metaJson.filter(m => m.publication_status === 'accepted_not_published').length !== 2) errors.push('accepted count != 2');

// --- direction rows ---
const dirById = Object.fromEntries(dirJson.map(r => [r.level + ':' + r.code, r]));
const csvById = Object.fromEntries(dirCsv.map(r => [r.level + ':' + r.code, r]));
const leafRows = dirJson.filter(r => r.level === 'leaf');
const primRows = dirJson.filter(r => r.level === 'primary');
if (leafRows.length !== 31) errors.push(`leaf rows ${leafRows.length}`);
if (primRows.length !== 9) errors.push(`primary rows ${primRows.length}`);
for (const l of leaves) if (!dirById['leaf:' + l]) errors.push(`missing leaf row ${l}`);
for (const p of parents) if (!dirById['primary:' + p]) errors.push(`missing primary row ${p}`);

// --- H formula, recomputation, T/A recomputation, F subscores ---
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
function hScores(items) {
  const pub = items.filter(x => {
    const m = metaJson.find(y => y.id === x.id);
    return m.publication_type === 'main_conference' && m.publication_status === 'published';
  });
  const n = pub.length;
  const vol = n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n <= 4 ? 3 : n <= 7 ? 4 : 5;
  const c = y => pub.filter(x => String(metaJson.find(m => m.id === x.id).publication_year) === y).length;
  const y24 = c('2024'), y25 = c('2025'), y26 = c('2026');
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
  return { volume: vol, momentum: mom, breadth, H: round1(0.30 * vol + 0.45 * mom + 0.25 * breadth), n, y24, y25, y26 };
}

function checkRow(row, expectedItems, label) {
  const h = hScores(expectedItems);
  if (num(row.H_volume) !== h.volume || num(row.H_momentum) !== h.momentum || num(row.H_breadth) !== h.breadth) {
    errors.push(`${label} H subcomponents csv=${row.H_volume}/${row.H_momentum}/${row.H_breadth} recomputed=${h.volume}/${h.momentum}/${h.breadth}`);
  }
  if (Math.abs(num(row.H) - h.H) > 1e-9) errors.push(`${label} H csv=${row.H} recomputed=${h.H}`);
  if (num(row.H) !== round1(0.30 * num(row.H_volume) + 0.45 * num(row.H_momentum) + 0.25 * num(row.H_breadth))) {
    errors.push(`${label} H formula mismatch`);
  }
  if (num(row.n_total) !== expectedItems.length) errors.push(`${label} n_total csv=${row.n_total} expected=${expectedItems.length}`);
  if (num(row.n_pub_main) !== h.n) errors.push(`${label} n_pub_main csv=${row.n_pub_main} expected=${h.n}`);
  if (num(row.y2024) !== h.y24 || num(row.y2025) !== h.y25 || num(row.y2026) !== h.y26) {
    errors.push(`${label} year counts csv=${row.y2024}/${row.y2025}/${row.y2026} expected=${h.y24}/${h.y25}/${h.y26}`);
  }
  const T = wmedian(expectedItems, 'T_paper'), Tc = maxOf(expectedItems, 'T_paper');
  const A = wmedian(expectedItems, 'A_paper'), Ac = maxOf(expectedItems, 'A_paper');
  if (num(row.T_dir) !== T || num(row.T_ceiling) !== Tc || num(row.A_dir) !== A || num(row.A_ceiling) !== Ac) {
    errors.push(`${label} T/A csv=${row.T_dir}/${row.T_ceiling}/${row.A_dir}/${row.A_ceiling} recomputed=${T}/${Tc}/${A}/${Ac}`);
  }
  for (const k of ['H_volume', 'H_momentum', 'H_breadth', 'H', 'T_dir', 'T_ceiling', 'A_dir', 'A_ceiling']) {
    if (!(num(row[k]) >= 0 && num(row[k]) <= 5)) errors.push(`${label} bad ${k}=${row[k]}`);
  }
  if (row.level === 'leaf') {
    const subs = ['F_crypto_leverage', 'F_low_ai_compute', 'F_open_experiment', 'F_definability'].map(k => num(row[k]));
    if (!(num(row.F_master) >= 0 && num(row.F_master) <= 5)) errors.push(`${label} bad F`);
    if (subs.some(x => !Number.isInteger(x))) errors.push(`${label} F subscore not integer`);
    if (subs[0] < 0 || subs[0] > 2) errors.push(`${label} crypto leverage out of 0-2`);
    if (subs.slice(1).some(x => x < 0 || x > 1)) errors.push(`${label} F subscore out of 0-1`);
    if (subs.reduce((a, b) => a + b, 0) !== num(row.F_master)) errors.push(`${label} F subscores ${subs.join('+')} != ${row.F_master}`);
  } else {
    if (row.F_master !== '' && row.F_master !== null) errors.push(`${label} primary F must be null/empty, got ${row.F_master}`);
  }
}

for (const l of leaves) {
  const row = dirById['leaf:' + l];
  checkRow(row, evJson.filter(x => x.v1_1_primary === l), 'leaf:' + l);
}
for (const p of parents) {
  const row = dirById['primary:' + p];
  checkRow(row, evJson.filter(x => x.v1_1_primary[0] === p), 'primary:' + p);
  const union = leaves.filter(l => l[0] === p).flatMap(l => evJson.filter(x => x.v1_1_primary === l).map(x => x.id)).sort();
  const own = evJson.filter(x => x.v1_1_primary[0] === p).map(x => x.id).sort();
  if (union.join(' ') !== own.join(' ')) errors.push(`primary:${p} paper set != union of leaves`);
  const leafN = leaves.filter(l => l[0] === p).reduce((a, l) => a + evJson.filter(x => x.v1_1_primary === l).length, 0);
  if (leafN !== num(row.n_total)) errors.push(`primary:${p} n_total != sum leaf n`);
}

// --- CSV/JSON consistency for direction table ---
for (const r of dirJson) {
  const c = csvById[r.level + ':' + r.code];
  if (!c) { errors.push(`csv missing ${r.level}:${r.code}`); continue; }
  for (const k of ['n_total', 'n_pub_main', 'y2024', 'y2025', 'y2026', 'H_volume', 'H_momentum', 'H_breadth', 'H', 'T_dir', 'T_ceiling', 'A_dir', 'A_ceiling']) {
    if (String(r[k]) !== String(c[k])) errors.push(`csv/json mismatch ${r.code}.${k}`);
  }
  if (r.level === 'leaf') {
    for (const k of ['F_master', 'F_crypto_leverage', 'F_low_ai_compute', 'F_open_experiment', 'F_definability']) {
      if (String(r[k]) !== String(c[k])) errors.push(`csv/json mismatch ${r.code}.${k}`);
    }
  }
}

// --- year matrix consistency ---
if (yearCsv.length !== 40) errors.push(`year matrix rows ${yearCsv.length}`);
for (const row of yearCsv) {
  const items = row.level === 'leaf'
    ? evJson.filter(x => x.v1_1_primary === row.code)
    : evJson.filter(x => x.v1_1_primary[0] === row.code);
  const h = hScores(items);
  if (num(row.n_total) !== items.length || num(row.n_pub_main) !== h.n) errors.push(`year matrix counts ${row.level}:${row.code}`);
  if (num(row.y2024_n) !== h.y24 || num(row.y2025_n) !== h.y25 || num(row.y2026_n) !== h.y26) errors.push(`year matrix years ${row.level}:${row.code}`);
  const ids = y => items.filter(x => {
    const m = metaJson.find(m => m.id === x.id);
    return m.publication_type === 'main_conference' && m.publication_status === 'published' && String(m.publication_year) === y;
  }).map(x => x.id).sort();
  for (const y of ['2024', '2025', '2026']) {
    if (row[`y${y}_ids`] !== ids(y).join(' ')) errors.push(`year matrix IDs ${row.level}:${row.code} ${y}`);
  }
}

// --- evidence refs: page + section ---
for (const r of evJson) {
  if (!/pp?\.\s*\d/.test(r.evidence_ref || '')) errors.push(`${r.id} evidence_ref has no PDF page`);
  if (!/§/.test(r.evidence_ref || '')) errors.push(`${r.id} evidence_ref has no note section`);
  if (r.evidence_confidence === 'medium' && r.T_paper >= 3) errors.push(`${r.id} T>=3 with medium evidence`);
}

// --- specific errata regression checks ---
const r101 = evJson.find(x => x.id === 'R1-01');
if (!r101 || r101.A_paper !== 1) errors.push('R1-01 A_paper should be 1 after errata');
for (const id of ['R3-01', 'R3-22', 'R3-24']) {
  const r = evJson.find(x => x.id === id);
  if (!/PDF p/.test(r.evidence_ref)) errors.push(`${id} evidence_ref lacks PDF page detail`);
}
const a1 = dirById['leaf:A1'];
if (num(a1.A_ceiling) !== 1) errors.push(`A1 A_ceiling should be 1, got ${a1.A_ceiling}`);

// --- sensitivity coverage ---
const sens = JSON.parse(fs.readFileSync('research/phase3/sensitivity_full.json', 'utf8'));
if (sens.coverage.medium_papers !== 30) errors.push('sensitivity medium coverage != 30');
if (sens.coverage.random_draws !== 10000) errors.push('sensitivity random draws != 10000');
if (sens.coverage.exhaustive !== false) errors.push('sensitivity should not claim exhaustive');
for (const id of Object.keys(sens.alternatives)) if (!idSet.has(id)) errors.push(`sensitivity unknown paper ${id}`);

// --- output ---
const conf = {}; for (const r of evJson) conf[r.evidence_confidence] = (conf[r.evidence_confidence] || 0) + 1;
const Tdist = {}; for (const r of evJson) Tdist[r.T_paper] = (Tdist[r.T_paper] || 0) + 1;
const Adist = {}; for (const r of evJson) Adist[r.A_paper] = (Adist[r.A_paper] || 0) + 1;
console.log('evidence rows', evJson.length, 'metadata rows', metaJson.length, 'leaf rows', leafRows.length, 'primary rows', primRows.length);
console.log('evidence confidence', conf);
console.log('T distribution', Tdist, 'A distribution', Adist);
console.log('main published', mainPub.length, `(${byYear('2024')}/${byYear('2025')}/${byYear('2026')})`);
console.log('H formula rows checked', dirJson.length, 'F sum rows checked', leafRows.length);
if (warn.length) { console.log('WARNINGS'); for (const x of warn) console.log(x); }
if (errors.length) { console.log('ERRORS'); for (const e of errors) console.log(e); process.exitCode = 1; }
else console.log('AUDIT OK');

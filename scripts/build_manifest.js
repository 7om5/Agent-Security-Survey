#!/usr/bin/env node
/* Build ID <-> PDF mapping from the handoff appendix A.
 * Read-only over papers/. Writes registry/paper_manifest.csv + paper_status.csv.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const HANDOFF = path.join(ROOT, 'CLAUDE_CODE_RESEARCH_HANDOFF.md');
const PAPERS = path.join(ROOT, 'papers');
const REG = path.join(ROOT, 'registry');
fs.mkdirSync(REG, { recursive: true });

const norm = s => s.normalize('NFKC').toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');

// --- parse appendix A ---
const md = fs.readFileSync(HANDOFF, 'utf8');
const rows = [];
for (const line of md.split(/\r?\n/)) {
  const m = line.match(/^\|\s*(R[123]-\d{2})\s*\|\s*(.+?)\s*\|\s*([A-I]\d)\s*\|\s*$/);
  if (m) rows.push({ id: m[1], title: m[2], cat: m[3] });
}
const counts = rows.reduce((a, r) => (a[r.id.split('-')[0]] = (a[r.id.split('-')[0]] || 0) + 1, a), {});
console.log('Appendix rows:', rows.length, JSON.stringify(counts));
if (rows.length !== 124) { console.error('FATAL: expected 124 rows'); process.exit(1); }

// --- scan pdfs ---
const files = fs.readdirSync(PAPERS).filter(f => f.toLowerCase().endsWith('.pdf'));
console.log('PDF files:', files.length);

// --- excluded titles must be absent by content, but flag any filename similarity ---
const excluded = [
  'Safe Actions Can Form Unsafe Traces',
  'Governing AI Agent with Capability and Delegation Chain',
  'InjecAgent', 'NetSafe', 'Causal Influence Prompting', 'Cloak, Honey, Trap'
];

// --- match ---
function dice(a, b) {
  const A = new Set(a.split(' ')), B = new Set(b.split(' '));
  let inter = 0; for (const t of A) if (B.has(t)) inter++;
  return (2 * inter) / (A.size + B.size);
}
const normFiles = files.map(f => ({ f, n: norm(f.replace(/\.pdf$/i, '')) }));
const used = new Set();
const mapped = [];
const problems = [];

for (const r of rows) {
  const n = norm(r.title);
  let hit = normFiles.find(x => !used.has(x.f) && x.n === n);
  let score = hit ? 1 : 0;
  if (!hit) {
    let best = null, bestS = 0;
    for (const x of normFiles) {
      if (used.has(x.f)) continue;
      const s = dice(n, x.n);
      if (s > bestS) { bestS = s; best = x; }
    }
    if (best && bestS >= 0.62) { hit = best; score = bestS; }
    else problems.push({ id: r.id, title: r.title, best: best ? best.f : null, score: bestS });
  }
  if (hit) { used.add(hit.f); mapped.push({ ...r, file: hit.f, mscore: score }); }
}

const unmappedFiles = files.filter(f => !used.has(f));
console.log('Mapped:', mapped.length, '| unmapped IDs:', problems.length, '| unused PDFs:', unmappedFiles.length);
if (problems.length) console.log('UNMAPPED IDS:\n' + problems.map(p => `  ${p.id} | ${p.title} | best=${p.best} (${p.score.toFixed(2)})`).join('\n'));
if (unmappedFiles.length) console.log('UNUSED FILES:\n' + unmappedFiles.map(f => '  ' + f).join('\n'));

// --- hashes and page counts ---
function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function pages(file) {
  try {
    const out = execFileSync('pdfinfo', [file], { encoding: 'utf8' });
    const m = out.match(/^Pages:\s+(\d+)/m);
    return m ? parseInt(m[1], 10) : '';
  } catch (e) { return ''; }
}

const manifest = ['id,title,original_category,pdf_path,pdf_sha256,total_pages,venue,year,match_score'];
const status = ['id,pdf_path,pdf_sha256,total_pages,extracted_pages,visually_checked_pages,status,note_path,evidence_count,reviewed_at,blocking_issue'];
for (const m of mapped.sort((a, b) => a.id.localeCompare(b.id))) {
  const rel = 'papers/' + m.file;
  const abs = path.join(PAPERS, m.file);
  const h = sha256(abs), p = pages(abs);
  manifest.push([m.id, `"${m.title.replace(/"/g, '""')}"`, m.cat, `"${rel}"`, h, p, '', '', m.mscore.toFixed(2)].join(','));
  status.push([m.id, `"${rel}"`, h, p, '', '', 'NOT_STARTED', `notes/${m.id}.md`, 0, '', ''].join(','));
}
fs.writeFileSync(path.join(REG, 'paper_manifest.csv'), manifest.join('\n') + '\n', 'utf8');
fs.writeFileSync(path.join(REG, 'paper_status.csv'), status.join('\n') + '\n', 'utf8');

// --- ambiguity log ---
const amb = [];
for (const p of problems) amb.push(`- ${p.id} 未能匹配：${p.title}（最接近：${p.best}，相似度 ${p.score.toFixed(2)}）`);
for (const f of unmappedFiles) amb.push(`- PDF 未关联到任何 ID：${f}`);
const exclHits = files.filter(f => excluded.some(e => norm(f).includes(norm(e))));
for (const f of exclHits) amb.push(`- 排除项存在：${f}（按规范不读取、不计数）`);
fs.writeFileSync(path.join(REG, 'mapping_issues.md'),
  `# 映射异常日志（自动生成 ${new Date().toISOString()}）\n\n` + (amb.length ? amb.join('\n') : '无异常。124 个 ID 与 124 个 PDF 一一对应。') + '\n', 'utf8');

fs.writeFileSync(path.join(REG, 'manifest_summary.json'), JSON.stringify({
  generated_at: new Date().toISOString(),
  appendix_rows: rows.length, pdf_files: files.length, mapped: mapped.length,
  unmapped_ids: problems, unused_files: unmappedFiles,
  excluded_present: exclHits,
  page_counts: Object.fromEntries(mapped.map(m => [m.id, pages(path.join(PAPERS, m.file))]))
}, null, 2), 'utf8');
console.log('Wrote registry/paper_manifest.csv, paper_status.csv, mapping_issues.md, manifest_summary.json');

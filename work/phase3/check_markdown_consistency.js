// Lightweight Markdown consistency checks for the Phase 3 errata.
// These assert that the human-readable reports contain the corrected values;
// the authoritative numeric checks are in scripts/audit_phase3.js.
const fs = require('fs');
const checks = [];
function has(file, needle, label) {
  const t = fs.readFileSync(file, 'utf8');
  checks.push({ ok: t.includes(needle), file, label, needle });
}

has('research/phase3/research_activity.md',
  '| A2 通用 Benchmark/测量/红队 | 8 | 2 | 3 | 3 | **4.5** | 5/5/3 |',
  'A2 row shows 5/5/3');
has('research/phase3/research_activity.md',
  '2025 年 5 篇（R1-10、R2-12、R2-16、R3-04、R3-77）；2026 年 2 篇（R1-14、R3-19）',
  'D3 year-ID mapping corrected');
has('research/phase3/research_activity.md',
  '2026 年 8 篇（R1-13、R3-16、R3-27、R3-38、R3-39、R3-70、R3-71、R3-84）',
  'D2 2026 list corrected');
has('research/phase3/phase3_report.md',
  '| `A_paper` | 0:91；1:29；2:1；3:2；4:1；5:0 |',
  'A distribution updated');
has('research/phase3/phase3_report.md',
  'A1/A3/B2/B3/C1/C4/D2/D3/D4/E1/E2/E3/G1/G2/G4/H1 1',
  'A_ceiling list completed');
has('research/phase3/applied_crypto_ranking.md',
  '| A1 安全定义/SoK/系统观 | 3 | 1 | 1 | 3 |',
  'A1 A_ceiling = 1');
has('research/phase3/applied_crypto_ranking.md',
  'R1-01 由 A=2 更正为 A=1',
  'R1-01 errata documented');
has('research/phase3/master_feasibility_ranking.md',
  '| B1 | 5 | 2 | 1 | 1 | 1 |',
  'B1 F subscores');
has('research/phase3/master_feasibility_ranking.md',
  '| B4 | 4 | 2 | 0 | 1 | 1 |',
  'B4 F subscores with low-AI=0');
has('research/phase3/sensitivity_analysis.md',
  '**30 / 30** 篇 medium 论文全部纳入',
  'full 30-paper sensitivity coverage');
has('research/phase3/sensitivity_analysis.md',
  '10,000 次随机模拟',
  'random simulation count');
has('research/phase3/phase3_errata_report.md',
  'A2 的 V/M/B 由 `4/5/3` 改为 **`5/5/3`**',
  'errata records A2 fix');
has('research/phase3/phase3_errata_report.md',
  'R1-01 由 **A=2 → A=1**',
  'errata records R1-01 fix');

let bad = 0;
for (const c of checks) {
  if (c.ok) console.log('OK ', c.label);
  else { bad++; console.log('FAIL', c.label, '|', c.file, '| missing:', c.needle); }
}
if (bad) { console.log(`${bad} Markdown check(s) failed`); process.exitCode = 1; }
else console.log('MARKDOWN CONSISTENCY OK');

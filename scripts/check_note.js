#!/usr/bin/env node
/* Lightweight QA for a research note: template completeness + evidence table size. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ids = process.argv.slice(2);
if (!ids.length) { console.log('usage: node scripts/check_note.js R1-02 ...'); process.exit(1); }
let fail = 0;
for (const id of ids) {
  const f = path.join(ROOT, 'notes', `${id}.md`);
  if (!fs.existsSync(f)) { console.log(`${id}: MISSING ${f}`); fail++; continue; }
  const t = fs.readFileSync(f, 'utf8');
  const issues = [];
  for (let i = 1; i <= 14; i++) if (!new RegExp(`^## ${i}\\.`, 'm').test(t)) issues.push(`missing section ${i}`);
  if (!/深读覆盖/.test(t)) issues.push('missing deep-read coverage line');
  if (!/\| *事实\/判断 *\|/.test(t)) issues.push('missing evidence table header');
  const evidenceRows = (t.match(/^\|(?! *事实\/判断| *---).*\|$/gm) || []).length;
  if (evidenceRows < 8) issues.push(`evidence rows ${evidenceRows} < 8`);
  if (/^\s*(TODO|TBD)\s*:|待补充/m.test(t)) issues.push('placeholder text found');
  if (t.length < 3000) issues.push(`too short (${t.length} bytes)`);
  console.log(`${id}: ${issues.length ? 'FAIL ' + issues.join('; ') : 'OK'} | ${t.length} bytes | evidence rows ~${evidenceRows}`);
  if (issues.length) fail++;
}
process.exit(fail ? 1 : 0);

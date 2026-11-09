#!/usr/bin/env node
/* Update paper_status.csv for a batch.
 * Usage: node scripts/update_status.js registry/batch01_status.json
 * JSON: [{id,status,evidence_count,visually_checked_pages,blocking_issue}]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const csvPath = path.join(ROOT, 'registry', 'paper_status.csv');
const batch = JSON.parse(fs.readFileSync(path.join(ROOT, process.argv[2]), 'utf8'));

function parseCsvLine(line) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur); return out;
}
const lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/);
const header = parseCsvLine(lines[0]);
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const byId = Object.fromEntries(batch.map(b => [b.id, b]));
const out = [lines[0]];
for (const line of lines.slice(1)) {
  if (!line.trim()) continue;
  const c = parseCsvLine(line);
  const b = byId[c[idx.id]];
  if (b) {
    c[idx.status] = b.status;
    c[idx.evidence_count] = String(b.evidence_count);
    c[idx.extracted_pages] = c[idx.total_pages];
    c[idx.visually_checked_pages] = String(b.visually_checked_pages || 0);
    c[idx.reviewed_at] = b.reviewed_at || '2026-11-03';
    c[idx.blocking_issue] = b.blocking_issue || '';
  }
  // re-quote fields containing commas
  out.push(c.map((v, i) => (v.includes(',') || v.includes('"')) ? `"${v.replace(/"/g, '""')}"` : v).join(','));
}
fs.writeFileSync(csvPath, out.join('\n') + '\n', 'utf8');
console.log(`Updated ${batch.length} rows in paper_status.csv`);

#!/usr/bin/env node
/* Extract full text per paper with == PAGE n == markers.
 * Usage: node scripts/extract_text.js R1-01 R2-07 ...   (default: all NOT_STARTED)
 * Output: work/text/<id>.txt  (PDFs untouched)
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const WORK = path.join(ROOT, 'work', 'text');
fs.mkdirSync(WORK, { recursive: true });

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
const manifest = fs.readFileSync(path.join(ROOT, 'registry', 'paper_manifest.csv'), 'utf8')
  .split(/\r?\n/).slice(1).filter(Boolean);
const byId = {};
for (const line of manifest) {
  const c = parseCsvLine(line);
  if (c.length >= 6) byId[c[0]] = { id: c[0], title: c[1], pdf: path.join(ROOT, c[3]), pages: +c[5] };
}

let ids = process.argv.slice(2);
if (!ids.length) ids = Object.keys(byId);

for (const id of ids) {
  const p = byId[id];
  if (!p) { console.log(id, 'NOT IN MANIFEST'); continue; }
  const out = path.join(WORK, `${id}.txt`);
  try {
    // Extract page-by-page so embedded form-feed characters in a PDF page cannot
    // shift the page numbering (seen in R1-11: 18 physical pages, 36 \f splits).
    const marked = [];
    for (let n = 1; n <= p.pages; n++) {
      const t = execFileSync('pdftotext', ['-f', String(n), '-l', String(n), '-layout', '-enc', 'UTF-8', p.pdf, '-'],
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
      marked.push(`\n\n===== PAGE ${n} / ${p.pages} =====\n\n${t.trim()}`);
    }
    const text = marked.join('\n');
    fs.writeFileSync(out, `# ${id} | ${p.title}\n# PDF: ${path.relative(ROOT, p.pdf)}\n# extracted: ${new Date().toISOString()}\n${text}\n`, 'utf8');
    const chars = text.replace(/\s+/g, ' ').length;
    console.log(`${id}: ${p.pages}p, ${chars} chars -> ${path.relative(ROOT, out)}`);
  } catch (e) {
    console.log(`${id}: EXTRACT FAILED ${e.message}`);
  }
}

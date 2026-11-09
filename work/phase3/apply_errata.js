// Phase 3 errata: apply the three paper-level corrections to the source evidence batches.
// R1-01 A_paper 2 -> 1 (SoK only catalogues crypto mechanisms; rubric clarification)
// R3-01 / R3-22 / R3-24: replace vague "§10–§11" with note section + PDF physical pages + checked scope.
const fs = require('fs');

function load(p) {
  return fs.readFileSync(p, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
}
function save(p, rows) {
  fs.writeFileSync(p, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
}

const b1 = load('work/phase3/evidence_batch1.jsonl');
const b2 = load('work/phase3/evidence_batch2.jsonl');

const r101 = b1.find(r => r.id === 'R1-01');
if (!r101) throw new Error('R1-01 not found');
r101.A_paper = 1;
r101.evidence_ref = '笔记 §10（PDF pp.13–15，§5.4–5.5：OAuth 2.0/OIDC、TEE、ETDI 签名工具定义仅作分类对象）；§11（pp.13–15，§5.4–5.5）；全文 pp.2–15 + p.21 Appendix A 核查：无构造/实现/评估/证明';
r101.note = 'SoK 仅目录化 OAuth/OIDC/TEE/工具签名，无构造、实现或评估；按 Rubric §4 最小澄清，A=1（仅论及、未使用），T=1。';

const refs = {
  'R3-01': '笔记 §10（PDF pp.2–15，§1–§7；pp.19–21 Appendix A,C–P）：全文无签名/MAC/加密/ZK/定理；§11（p.5 §3 威胁模型；pp.6–8 §4 Eq.(1)–(7)；pp.9–14 §5–§6 Tables 1–7）',
  'R3-22': '笔记 §10（PDF pp.1–9，§1–§5；pp.11–27 Appendix A–N）：全文无加密/签名/MAC/承诺/ZK/MPC/FHE/TEE/定理；Eq.3–4 p.4 为优化目标非安全定义；§11（p.6 Table 1；p.7 Table 2；p.8 Table 3）',
  'R3-24': '笔记 §10（PDF pp.1–10，§1–§6；pp.14–20 Appendix A–F）：全文无密码原语/形式化定义/定理；§11（p.5 Eq.10–12 余弦阈值；pp.5–6 Eq.14–15 激活修正；p.6 Table 1；p.7 Table 2）'
};
for (const [id, ref] of Object.entries(refs)) {
  const r = b2.find(x => x.id === id);
  if (!r) throw new Error(`${id} not found`);
  r.evidence_ref = ref;
}

save('work/phase3/evidence_batch1.jsonl', b1);
save('work/phase3/evidence_batch2.jsonl', b2);
console.log('updated R1-01 A_paper=', r101.A_paper);
console.log('updated evidence_ref rows:', Object.keys(refs).join(', '));

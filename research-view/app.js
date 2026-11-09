"use strict";

const db = window.RESEARCH_DATA;
const $ = selector => document.querySelector(selector);
const escapeText = value => String(value ?? "").replace(/[&<>"']/g, char =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
const urlPath = path => path.split("/").map(encodeURIComponent).join("/");
const scores = Object.fromEntries(db.scores.map(row => [row.code,row]));
const codeName = code => scores[code]?.name || code;
const papersById = new Map(db.papers.map(paper => [paper.id,paper]));
const docButton = (path,label,style="outline") =>
  `<button class="${style}" data-doc="${escapeText(path)}">${escapeText(label)} ↗</button>`;
const option = (value,label) => `<option value="${escapeText(value)}">${escapeText(label)}</option>`;
const pdfLink = paper => `<a class="id" target="_blank" rel="noopener" title="打开 PDF · ${escapeText(paper.title)}" href="${urlPath(paper.pdf)}">${paper.id}</a>`;
const docGroups = {
  taxdocs:[
    ["logs/phase2_report.md","阶段二报告"],["logs/phase2_consistency_check.md","分类一致性核对"],
    ["taxonomy/taxonomy_change_log.md","修订记录"],["research/phase3/taxonomy_count_correction.md","计数口径"],
    ["logs/phase1_acceptance_2026-11-03.md","精读验收"],["research/crypto_intersection_observations.md","密码学交叉观察"]
  ],
  rankdocs:[
    ["research/phase3/research_activity.md","活跃度报告"],["research/phase3/theoretical_crypto_ranking.md","理论密码学排名"],
    ["research/phase3/applied_crypto_ranking.md","应用密码学排名"],["research/phase3/master_feasibility_ranking.md","硕士可行性排名"],
    ["research/phase3/scoring_rubric.md","评分规则"],["research/phase3/metadata_audit.md","书目核验"],
    ["research/phase3/sensitivity_analysis.md","敏感性分析"],["research/phase3/phase3_errata_report.md","阶段三勘误"]
  ],
  canddocs:[
    ["research/phase4/phase4_research_plan.md","阶段四规划"],["research/phase4/candidate_problem_pool.md","候选问题池"],
    ["research/phase4/prior_art_review.md","已有工作比较"],["research/phase4/external_prior_art/README.md","外部证据等级"],
    ["research/phase4/candidate_evaluation.md","八维评价"],["research/phase4/top_candidates.md","方案比较"],
    ["research/phase4/final_recommendation.md","最终推荐"],["research/phase4/research_roadmap.md","完整路线图"]
  ]
};
for (const [id,docs] of Object.entries(docGroups)) {
  $("#"+id).innerHTML = docs.map(([path,label])=>docButton(path,label)).join("");
}
const dataFiles = {
  taxdocs:[["registry/paper_topics_v1_1.csv","逐篇分类表"]],
  rankdocs:[["research/phase3/direction_scores_full.csv","完整方向分表"],["research/phase3/paper_crypto_evidence.csv","逐篇密码学证据"]],
  canddocs:[["research/phase4/candidate_index.csv","候选评分表"],["research/phase4/external_prior_art/sources.json","52 条外部来源索引"]]
};
for (const [id,files] of Object.entries(dataFiles)) {
  const links=files.map(([path,label])=>`<a class="outline" href="${urlPath(path)}" target="_blank" rel="noopener">${label} ↗</a>`);
  $("#"+id).insertAdjacentHTML("beforeend",links.join(""));
}

// Each node represents one primary direction. Its area follows the paper count.
function drawMap() {
  const cx=212, cy=122;
  const nodes = db.scores.filter(row=>row.level==="primary").map((row,index)=>{
    const angle = (-90 + index*40)*Math.PI/180;
    return {...row, x:cx+125*Math.cos(angle), y:cy+85*Math.sin(angle)};
  });
  const lines = nodes.map(n=>`<path d="M${cx},${cy} L${n.x},${n.y}" stroke="#669887" stroke-dasharray="3 5"/>`).join("");
  const marks = nodes.map(n=>{
    const r=Math.sqrt(n.n_total)*2.05;
    const right=n.x>=cx-1;
    const dx=right?r+6:-r-6;
    return `<g><title>${escapeText(n.name)} · ${n.n_total} 篇</title><circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${n.code==="B"?"#e7f6a8":"#b9dbaa"}"/>
      <text x="${n.x+dx}" y="${n.y+4}" text-anchor="${right?"start":"end"}" fill="#e1eedc" font-family="Consolas,monospace" font-size="11">${n.code} · ${n.n_total}</text></g>`;
  }).join("");
  $("#map").innerHTML = `<defs><pattern id="mesh" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill="#a3ccae" opacity=".32"/></pattern></defs><rect x="0" width="430" height="245" fill="url(#mesh)"/>
    <g fill="none" stroke="#82ab91" opacity=".45"><ellipse cx="${cx}" cy="${cy}" rx="160" ry="105" stroke-dasharray="2 5"/><ellipse cx="${cx}" cy="${cy}" rx="125" ry="85"/><ellipse cx="${cx}" cy="${cy}" rx="87" ry="57"/></g>${lines}
    <circle cx="${cx}" cy="${cy}" r="33" fill="#234c3a" stroke="#c6e797"/><text x="${cx}" y="${cy+4}" text-anchor="middle" fill="#e1f1b3" font-size="22" font-family="Consolas,monospace">124</text>${marks}`;
}
drawMap();

function showSection() {
  const sections=["papers","taxonomy","rankings","candidates"];
  const key=sections.includes(location.hash.slice(1))?location.hash.slice(1):"papers";
  sections.forEach(id=>$("#"+id).hidden=id!==key);
  for (const link of document.querySelectorAll("#nav a")) {
    if(link.hash==="#"+key) link.setAttribute("aria-current","page");
    else link.removeAttribute("aria-current");
  }
}
window.addEventListener("hashchange",showSection);
showSection();

const pubType={main_conference:"主会",workshop:"Workshop",preprint:"预印本",unknown:"类型待核"};
const pubStatus={published:"已发表",accepted_not_published:"已接收待发表",submitted:"在投",unconfirmed:"发表状态待核"};
const family=$("#family"), leaf=$("#leaf"), year=$("#year"), query=$("#query");
family.innerHTML=option("","全部主类")+Object.entries(db.taxonomy.primary).map(([key,label])=>option(key,key+" · "+label)).join("");
year.innerHTML=option("","全部年份")+[...new Set(db.papers.map(p=>String(p.year || "待核")))].sort().map(y=>option(y,y)).join("");
let page=1;
function updateLeaves() {
  leaf.innerHTML=option("","全部二级方向")+Object.entries(db.taxonomy.leaves)
    .filter(([,v])=>!family.value || v.parent===family.value)
    .map(([k,v])=>option(k,k+" · "+v.name)).join("");
}
updateLeaves();
function openPapers(code) {
  family.value=code[0]; updateLeaves(); leaf.value=code.length>1?code:"";
  year.value=""; query.value=""; page=1; renderPapers(); location.hash="papers";
}
function makePaperRow(p) {
  const s=scores[p.leaf];
  const related=db.candidates.filter(c=>c.S_main && c.direction.split("/").includes(p.leaf));
  const choices=related.length ? related.map(c=>`${c.id} ${c.name.split(":")[0]} · ${c.S_main}`).join("；") : "无直接匹配的已评分候选";
  return `<tr><td>${pdfLink(p)}</td><td><div class="papername">${escapeText(p.title)}</div>
    <div class="meta">${escapeText(p.venue||"会议待核")} · ${escapeText(p.year||"年份待核")} · ${pubType[p.type]} / ${pubStatus[p.status]} · ${p.pages} 页</div>
    <details><summary>作者与书目</summary><div class="meta">${escapeText(p.byline||"见精读笔记首页。")}</div></details></td>
    <td><span class="pill">${p.leaf}</span>${escapeText(s.name)}${p.subtype?" · "+escapeText(p.subtype):""}
    <details><summary>交叉分类与标签</summary><div class="tags">交叉方向：${p.secondary.map(k=>escapeText(k+" "+codeName(k))).join("；")||"无"}<br>标签：${escapeText(p.tags.join(" · ")||"无")}<br>分类置信度：${p.confidence==="high"?"高":"中"}<br>${escapeText(p.evidence)}</div></details></td>
    <td><span class="score">${[s.H,s.T_dir,s.A_dir,s.F_master].join(" / ")}</span><details><summary>相关选题分</summary><div class="meta">来源含 ${p.leaf} 的候选（主权重）：${escapeText(choices)}</div></details></td>
    <td>${docButton("notes/"+p.id+".md","笔记","inline")}</td></tr>`;
}
function renderPapers() {
  const needle=query.value.trim().toLowerCase();
  const rows=db.papers.filter(p=>(!family.value||p.leaf[0]===family.value)&&(!leaf.value||p.leaf===leaf.value)
    &&(!year.value||String(p.year||"待核")===year.value)
    &&(!needle||[p.id,p.title,p.venue,p.byline,p.leaf,p.subtype,codeName(p.leaf),...p.secondary,...p.tags].join(" ").toLowerCase().includes(needle)));
  const limit=Number($("#limit").value);
  const totalPages=Math.max(1,Math.ceil(rows.length/limit));
  page=Math.min(totalPages,Math.max(1,page));
  const offset=(page-1)*limit;
  $("#library tbody").innerHTML=rows.slice(offset,offset+limit).map(makePaperRow).join("") || '<tr><td colspan="5" class="empty">未找到符合条件的论文，可更换关键词或重置筛选。</td></tr>';
  $("#found").textContent=`显示 ${rows.length?offset+1:0}–${Math.min(rows.length,offset+limit)} / ${rows.length} 篇`;
  $("#pages").textContent=page+" / "+totalPages;
  $("#prev").disabled=page<=1; $("#next").disabled=page>=totalPages;
}
family.onchange=()=>{updateLeaves();page=1;renderPapers()};
for(const control of [leaf,year,$("#limit")]) control.onchange=()=>{page=1;renderPapers()};
query.oninput=()=>{page=1;renderPapers()};
$("#reset").onclick=()=>{family.value="";updateLeaves();query.value="";year.value="";page=1;renderPapers()};
$("#prev").onclick=()=>{page--;renderPapers()};
$("#next").onclick=()=>{page++;renderPapers()};
renderPapers();

$("#tree").innerHTML=Object.entries(db.taxonomy.primary).map(([code,name])=>{
  const children=Object.entries(db.taxonomy.leaves).filter(([,v])=>v.parent===code);
  return `<section class="branch"><h3><span class="code">${code}</span>${escapeText(name)}<span class="count">${scores[code].n_total} 篇</span></h3>${children.map(([k,v])=>
    `<button class="child" data-filter="${k}"><b>${k}</b>${escapeText(v.name)}<small>${scores[k].n_total} ↗</small></button>`).join("")}${code==="B"?'<small>B4a 策略审计／运行时强制 · B4b 密码学可验证执行</small>':""}</section>`;
}).join("");

const metrics={
  H:["H · 研究活跃度","以正式主会发表为主口径，综合数量、近期增长与研究类型广度。该指标只反映样本内活跃度。"],
  T:["T · 理论密码学","衡量已有理论密码学贡献。典型分取置信度加权中位数，最高分取方向内单篇最大值。"],
  A:["A · 应用密码学","衡量论文实际使用、实现或评估的密码学机制。典型分与最高分分别反映方向广度和单篇高度。"],
  F:["F · 硕士可行性","综合密码学背景、算力、开放实验与问题可定义性，只评二级方向。高可行性仍需独立验证创新空间。"]
};
let metric="H";
function renderRankings() {
  $("#ranktabs").innerHTML=Object.entries(metrics).map(([key,[label]])=>
    `<button data-metric="${key}" aria-pressed="${key===metric}">${label}</button>`).join("");
  const level=$("#ranklevel");
  level.disabled=metric==="F";
  if(level.disabled) level.value="leaf";
  $("#statlabel").hidden=!(metric==="T"||metric==="A");
  const field=metric==="H"?"H":metric==="F"?"F_master":metric+"_"+$("#stat").value;
  $("#rankdesc").textContent=metrics[metric][1]+" 同分并列。";
  const rows=db.scores.filter(r=>r.level===level.value).sort((a,b)=>b[field]-a[field]||a.code.localeCompare(b.code));
  let rank=0;
  $("#ranktable tbody").innerHTML=rows.map((r,i)=>{
    if(!i || r[field]!==rows[i-1][field]) rank=i+1;
    return `<tr><td class="rankno">${String(rank).padStart(2,"0")}</td><td><button data-filter="${r.code}" class="inline">${r.code} · ${escapeText(r.name)} ↗</button></td>
      <td class="mono">${Number(r[field]).toFixed(1)}<span class="scorebar"><i style="width:${r[field]*20}%"></i></span></td><td>${r.n_total}</td><td>${r.n_pub_main}</td></tr>`;
  }).join("");
}
$("#stat").onchange=renderRankings;$("#ranklevel").onchange=renderRankings;renderRankings();

const featuredText=[
  "恶意子 Agent 截断委托链、混用接收方或重放已撤销凭证时，工具能否识别越权？先用 ProVerif／Tamarin 建模，再复现反例。",
  "如何证明多步工具调用全部受到授权，并满足累计约束，同时隐藏敏感参数？先测单次调用，证明耗时低于 60 秒且小于 10 MB 才继续。"
];
const titles=["委托链的形式化验证","多步轨迹的授权证明","隐私保护的委托路径","委托链截断检测","隐藏列表的离线撤销","跨工具组合授权","历史相关的记忆授权","Skills 供应链认证","MCP 注册表透明日志","消息来源与认证","Agent 身份认证","用途绑定凭证"];
$("#featured").innerHTML=db.candidates.slice(0,2).map((c,i)=>`<section class="feature"><strong>${c.recommendation} · ${c.id}</strong><h3>${titles[i]}</h3><div class="mono">${escapeText(c.name.split(":")[0])} · ${c.S_main} / 5</div><p>${featuredText[i]}</p>${docButton("research/phase4/"+c.proposal_file,"打开研究方案")}</section>`).join("");
$("#choices tbody").innerHTML=db.candidates.map((c,i)=>{
  const title=c.id+" · "+titles[i];
  const name=c.proposal_file.endsWith(".md")?docButton("research/phase4/"+c.proposal_file,title,"inline"):escapeText(title);
  return `<tr><td>${name}<div class="meta">${escapeText(c.name.split(":")[0])}</div></td><td>${c.direction}</td>${[c.S_main,c.S_theory,c.S_applied,c.S_innovation,c.D8_risk].map(v=>`<td class="mono">${escapeText(v||"—")}</td>`).join("")}<td>${escapeText(c.recommendation)}</td></tr>`;
}).join("");

// Read embedded Markdown renderings offline. Retain structural HTML only.
const documentTags=new Set("H1 H2 H3 H4 H5 H6 P A TABLE THEAD TBODY TR TH TD UL OL LI STRONG EM DEL CODE PRE BLOCKQUOTE HR BR".split(" "));
function renderDocument(path) {
  const dialog=$("#reader"), article=$("#article");
  const fragment=document.createElement("template");
  fragment.innerHTML=db.docs[path];
  const base=new URL(urlPath(path),document.baseURI);
  for(const el of fragment.content.querySelectorAll("*")) {
    if(!documentTags.has(el.tagName)){ el.replaceWith(...el.childNodes);continue }
    const href=el.getAttribute("href");
    for(const attr of [...el.attributes]) el.removeAttribute(attr.name);
    if(el.tagName==="A" && href){
      try{
        const target=new URL(href,base);
        if(!["file:","http:","https:"].includes(target.protocol)) continue;
        el.href=target.href;el.target="_blank";el.rel="noopener";
        const key=Object.keys(db.docs).find(k=>new URL(urlPath(k),document.baseURI).href===target.href);
        if(key) el.dataset.doc=key;
      }catch{ /* Leave malformed references as text. */ }
    }
  }
  const walker=document.createTreeWalker(fragment.content,NodeFilter.SHOW_TEXT);
  const texts=[];
  while(walker.nextNode()){
    const node=walker.currentNode;
    if(!node.parentElement?.closest("a,pre,code") && /\bR[123]-\d{2}\b/.test(node.data)) texts.push(node);
  }
  for(const node of texts){
    const replacement=document.createDocumentFragment();
    for(const part of node.data.split(/(\bR[123]-\d{2}\b)/)){
      const p=papersById.get(part);
      if(!p){replacement.append(part);continue}
      const a=document.createElement("a");a.href=urlPath(p.pdf);a.target="_blank";a.rel="noopener";a.textContent=part;replacement.append(a);
    }
    node.replaceWith(replacement);
  }
  article.replaceChildren(fragment.content);
  $("#original").href=urlPath(path);
  const title=article.querySelector("h1");
  dialog.setAttribute("aria-label",title?.textContent||"研究文档");
  if(!dialog.open)dialog.showModal();
  dialog.scrollTop=0;
}
document.addEventListener("click",event=>{
  const target=event.target.closest("[data-doc],[data-filter],[data-metric]");
  if(!target)return;
  if(target.dataset.doc && Object.hasOwn(db.docs,target.dataset.doc)){
    event.preventDefault();renderDocument(target.dataset.doc);
  }else if(target.dataset.filter)openPapers(target.dataset.filter);
  else if(target.dataset.metric){metric=target.dataset.metric;renderRankings()}
});
$("#closeReader").onclick=()=>$("#reader").close();

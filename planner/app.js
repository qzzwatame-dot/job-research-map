const scoreKeys = [
  ["industry_growth_score", "業界成長"],
  ["company_strength_score", "企業競争力"],
  ["stability_score", "安定性"],
  ["compensation_score", "待遇"],
  ["career_capital_score", "キャリア資本"],
  ["new_grad_access_score", "新卒アクセス"],
  ["culture_clarity_score", "社風情報"],
  ["work_life_balance_score", "働きやすさ"],
  ["transferability_score", "転職市場価値"],
  ["disclosure_score", "情報開示"],
  ["comparison_value_score", "比較価値"],
];

const preferencePresets = {
  balanced: { label: "総合バランス", weights: { industry_growth_score: 0.1, company_strength_score: 0.13, stability_score: 0.1, compensation_score: 0.1, career_capital_score: 0.13, new_grad_access_score: 0.1, culture_clarity_score: 0.07, work_life_balance_score: 0.07, transferability_score: 0.1, disclosure_score: 0.05, comparison_value_score: 0.05 } },
  salary: { label: "高年収重視", weights: { industry_growth_score: 0.08, company_strength_score: 0.12, stability_score: 0.07, compensation_score: 0.22, career_capital_score: 0.14, new_grad_access_score: 0.07, culture_clarity_score: 0.04, work_life_balance_score: 0.04, transferability_score: 0.15, disclosure_score: 0.03, comparison_value_score: 0.04 } },
  growthCareer: { label: "成長環境重視", weights: { industry_growth_score: 0.16, company_strength_score: 0.16, stability_score: 0.05, compensation_score: 0.08, career_capital_score: 0.18, new_grad_access_score: 0.08, culture_clarity_score: 0.05, work_life_balance_score: 0.03, transferability_score: 0.15, disclosure_score: 0.03, comparison_value_score: 0.03 } },
  stability: { label: "安定重視", weights: { industry_growth_score: 0.05, company_strength_score: 0.1, stability_score: 0.22, compensation_score: 0.08, career_capital_score: 0.08, new_grad_access_score: 0.1, culture_clarity_score: 0.08, work_life_balance_score: 0.16, transferability_score: 0.06, disclosure_score: 0.05, comparison_value_score: 0.02 } },
  workLife: { label: "ワークライフバランス重視", weights: { industry_growth_score: 0.05, company_strength_score: 0.08, stability_score: 0.15, compensation_score: 0.08, career_capital_score: 0.07, new_grad_access_score: 0.1, culture_clarity_score: 0.12, work_life_balance_score: 0.24, transferability_score: 0.05, disclosure_score: 0.04, comparison_value_score: 0.02 } },
  engineer: { label: "理系技術職向け", weights: { industry_growth_score: 0.16, company_strength_score: 0.15, stability_score: 0.1, compensation_score: 0.1, career_capital_score: 0.16, new_grad_access_score: 0.06, culture_clarity_score: 0.05, work_life_balance_score: 0.07, transferability_score: 0.12, disclosure_score: 0.02, comparison_value_score: 0.01 } },
  generalist: { label: "文系総合職向け", weights: { industry_growth_score: 0.08, company_strength_score: 0.16, stability_score: 0.12, compensation_score: 0.1, career_capital_score: 0.12, new_grad_access_score: 0.14, culture_clarity_score: 0.08, work_life_balance_score: 0.06, transferability_score: 0.06, disclosure_score: 0.03, comparison_value_score: 0.05 } },
};

const statusColumns = ["未調査", "調査中", "ES準備中", "応募済み", "選考中"];
const localServerUrl = "http://127.0.0.1:8766/planner/";

if (window.location.protocol === "file:") {
  window.location.replace(localServerUrl);
}

const state = {
  companies: [],
  evidenceSources: {},
  applicantProfile: {},
  personalData: {},
  eventData: {},
  sourceData: {},
  interestedCompanies: {},
  recommendations: [],
  selected: null,
  supabase: null,
  authUser: null,
  cloudReady: false,
  syncing: false,
  filters: {
    industry: "すべて",
    interestedOnly: false,
    weeklyCapacity: 10,
  },
};

const els = {
  syncButton: document.querySelector("#syncButton"),
  syncNow: document.querySelector("#syncNow"),
  syncStatus: document.querySelector("#syncStatus"),
  presetMode: document.querySelector("#presetMode"),
  mbtiType: document.querySelector("#mbtiType"),
  preferredJobTypes: document.querySelector("#preferredJobTypes"),
  conditionSummary: document.querySelector("#conditionSummary"),
  esDraft: document.querySelector("#esDraft"),
  changeTolerance: document.querySelector("#changeTolerance"),
  autonomyPreference: document.querySelector("#autonomyPreference"),
  logicOrientation: document.querySelector("#logicOrientation"),
  planningOrientation: document.querySelector("#planningOrientation"),
  saveProfile: document.querySelector("#saveProfile"),
  industryFilter: document.querySelector("#industryFilter"),
  weeklyCapacity: document.querySelector("#weeklyCapacity"),
  interestedOnly: document.querySelector("#interestedOnly"),
  plannerSummary: document.querySelector("#plannerSummary"),
  statCompanies: document.querySelector("#statCompanies"),
  statReady: document.querySelector("#statReady"),
  statInterested: document.querySelector("#statInterested"),
  recommendationGrid: document.querySelector("#recommendationGrid"),
  applicationBoard: document.querySelector("#applicationBoard"),
  detailCompany: document.querySelector("#detailCompany"),
  detailMeta: document.querySelector("#detailMeta"),
  detailScores: document.querySelector("#detailScores"),
  detailReasons: document.querySelector("#detailReasons"),
  detailLinks: document.querySelector("#detailLinks"),
  applicationStatus: document.querySelector("#applicationStatus"),
  nextAction: document.querySelector("#nextAction"),
  nextDeadline: document.querySelector("#nextDeadline"),
  saveApplication: document.querySelector("#saveApplication"),
  toggleInterested: document.querySelector("#toggleInterested"),
  timelineList: document.querySelector("#timelineList"),
  toast: document.querySelector("#toast"),
};

init();

async function init() {
  const [scores, targets, sources] = await Promise.all([
    loadCsv("../data/target_company_scores_initial.csv"),
    loadCsv("../data/target_companies_100.csv"),
    loadCsv("../data/score_evidence_sources.csv"),
  ]);
  const targetMap = new Map(targets.map((d) => [d.company, d]));
  state.companies = scores.map((row) => {
    const target = targetMap.get(row.company) || {};
    const item = { ...target, ...row };
    for (const [key] of scoreKeys) item[key] = Number(item[key]);
    item.priority_rank = Number(item.priority_rank);
    item.overall_score = Number(item.overall_score);
    return item;
  });
  state.evidenceSources = groupByCompany(sources);
  loadLocalData();
  await setupSupabaseSync();
  setupControls();
  renderAll();
}

async function loadCsv(path) {
  const response = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path} could not be loaded`);
  return parseCsv(await response.text());
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (char !== "\r") {
      value += char;
    }
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  const headers = rows.shift();
  return rows.filter((r) => r.length === headers.length).map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
}

function setupControls() {
  const industries = ["すべて", ...unique(state.companies.map((d) => d.industry))];
  els.industryFilter.innerHTML = industries.map((industry) => `<option value="${escapeAttr(industry)}">${industry}</option>`).join("");
  renderProfileForm();
  els.saveProfile.addEventListener("click", () => {
    saveProfile();
    renderAll();
    showToast("診断を更新しました");
  });
  els.mbtiType.addEventListener("change", inferProfileFromMbti);
  els.industryFilter.addEventListener("change", () => {
    state.filters.industry = els.industryFilter.value;
    renderAll();
  });
  els.weeklyCapacity.addEventListener("change", () => {
    state.filters.weeklyCapacity = Number(els.weeklyCapacity.value);
    renderAll();
  });
  els.interestedOnly.addEventListener("change", () => {
    state.filters.interestedOnly = els.interestedOnly.checked;
    renderAll();
  });
  els.saveApplication.addEventListener("click", saveSelectedApplication);
  els.toggleInterested.addEventListener("click", () => toggleInterested(state.selected));
  els.syncButton.addEventListener("click", handleAuthButton);
  els.syncNow.addEventListener("click", () => saveCloudData({ immediate: true }));
}

function renderAll() {
  state.recommendations = buildRecommendations();
  if (!state.selected) state.selected = state.recommendations[0]?.company || state.companies[0];
  els.statCompanies.textContent = state.companies.length;
  els.statReady.textContent = state.recommendations.filter((d) => d.priority >= 80).length;
  els.statInterested.textContent = interestedNames().length;
  els.plannerSummary.textContent = summaryText();
  renderRecommendations();
  renderBoard();
  renderTimeline();
  renderDetail(state.selected);
  updateSyncStatus();
}

function buildRecommendations() {
  const profile = state.applicantProfile;
  const filtered = state.companies.filter((company) => {
    if (state.filters.industry !== "すべて" && company.industry !== state.filters.industry) return false;
    if (state.filters.interestedOnly && !state.interestedCompanies[company.company]) return false;
    return true;
  });
  return filtered.map((company) => {
    const personal = personalFit(company, profile);
    const offer = offerLikelihood(company);
    const motivation = motivationEase(company, profile);
    const es = esMaterialFit(company, profile);
    const urgency = urgencyScore(company);
    const access = normalize(company.new_grad_access_score, 1, 5);
    const priority = Math.round(personal * 0.28 + offer * 0.22 + motivation * 0.18 + es * 0.14 + urgency * 0.1 + access * 0.08);
    return {
      company,
      priority,
      personal: Math.round(personal),
      offer: Math.round(offer),
      motivation: Math.round(motivation),
      es: Math.round(es),
      urgency: Math.round(urgency),
      action: nextActionFor(company),
      reasons: reasonsFor(company, { personal, offer, motivation, es, urgency }),
    };
  }).sort((a, b) => b.priority - a.priority || b.company.overall_score - a.company.overall_score);
}

function renderRecommendations() {
  const items = state.recommendations.slice(0, state.filters.weeklyCapacity);
  els.recommendationGrid.innerHTML = items.map((item, index) => {
    const company = item.company;
    const selected = state.selected?.company === company.company;
    const link = primaryLink(company);
    return `
      <article class="recommend-card ${selected ? "is-selected" : ""}" data-company="${escapeAttr(company.company)}">
        <div class="card-top">
          <div>
            <span class="rank">#${index + 1}</span>
            <strong class="company-name">${company.company}</strong>
            <span class="industry">${company.industry}</span>
          </div>
          <div class="priority-score"><strong>${item.priority}</strong><span>priority</span></div>
        </div>
        <div class="metric-row">
          <div><strong>${item.personal}</strong><span>あなた向け</span></div>
          <div><strong>${item.offer}</strong><span>内定しやすさ</span></div>
          <div><strong>${item.motivation}</strong><span>志望動機</span></div>
          <div><strong>${item.es}</strong><span>ES素材</span></div>
        </div>
        <div class="next-action">${item.action}</div>
        <div class="card-actions">
          <button class="primary" type="button" data-action="select" data-company="${escapeAttr(company.company)}">詳細</button>
          <button type="button" data-action="es" data-company="${escapeAttr(company.company)}">ES準備</button>
          <button type="button" data-action="interest" data-company="${escapeAttr(company.company)}">${state.interestedCompanies[company.company] ? "リスト解除" : "志望リスト"}</button>
          ${link ? `<a href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${link.label}</a>` : ""}
        </div>
      </article>
    `;
  }).join("");
  els.recommendationGrid.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const company = findCompany(button.dataset.company);
      if (button.dataset.action === "select") selectCompany(company);
      if (button.dataset.action === "interest") toggleInterested(company);
      if (button.dataset.action === "es") updateStatus(company, "ES準備中");
    });
  });
  els.recommendationGrid.querySelectorAll(".recommend-card").forEach((card) => {
    card.addEventListener("click", () => selectCompany(findCompany(card.dataset.company)));
  });
}

function renderBoard() {
  const byStatus = Object.fromEntries(statusColumns.map((status) => [status, []]));
  for (const item of state.recommendations.slice(0, 40)) {
    const status = boardStatus(getPersonalEntry(item.company.company).status);
    if (byStatus[status]) byStatus[status].push(item);
  }
  els.applicationBoard.innerHTML = statusColumns.map((status) => `
    <div class="board-column">
      <h3>${status} ${byStatus[status].length}</h3>
      ${byStatus[status].slice(0, 8).map((item) => `
        <button class="board-item" type="button" data-company="${escapeAttr(item.company.company)}">
          <strong>${item.company.company}</strong>
          <small>${item.priority} / ${item.action}</small>
        </button>
      `).join("")}
    </div>
  `).join("");
  els.applicationBoard.querySelectorAll(".board-item").forEach((button) => {
    button.addEventListener("click", () => selectCompany(findCompany(button.dataset.company)));
  });
}

function renderTimeline() {
  const items = Object.entries(state.personalData)
    .filter(([, entry]) => entry.next_deadline || entry.next_action)
    .map(([company, entry]) => ({ company, ...entry }))
    .sort((a, b) => (a.next_deadline || "9999-99-99").localeCompare(b.next_deadline || "9999-99-99"))
    .slice(0, 8);
  if (!items.length) {
    els.timelineList.innerHTML = `<div>締切や次アクションを登録すると、ここに表示されます。</div>`;
    return;
  }
  els.timelineList.innerHTML = items.map((item) => `
    <div>
      <strong>${item.company}</strong><br>
      ${item.next_deadline ? `締切 ${item.next_deadline} / ` : ""}${item.next_action || item.status}
    </div>
  `).join("");
}

function renderDetail(company) {
  if (!company) return;
  const item = state.recommendations.find((d) => d.company.company === company.company) || buildRecommendations().find((d) => d.company.company === company.company);
  const entry = getPersonalEntry(company.company);
  els.detailCompany.textContent = company.company;
  els.detailMeta.textContent = `${company.industry} / 総合 ${company.overall_score.toFixed(2)} / ${preferencePresets[state.applicantProfile.preference_preset || "balanced"].label}`;
  els.applicationStatus.value = entry.status;
  els.nextAction.value = entry.next_action || item?.action || "";
  els.nextDeadline.value = entry.next_deadline || "";
  els.toggleInterested.textContent = state.interestedCompanies[company.company] ? "志望リスト解除" : "志望リスト追加";
  const metrics = [
    ["あなた向け", item?.personal || 0],
    ["内定しやすさ", item?.offer || 0],
    ["志望動機", item?.motivation || 0],
    ["ES素材", item?.es || 0],
    ["優先度", item?.priority || 0],
  ];
  els.detailScores.innerHTML = metrics.map(([label, value]) => `
    <div class="score-line">
      <span>${label}</span>
      <div class="track"><div class="fill" style="width:${value}%"></div></div>
      <strong>${value}</strong>
    </div>
  `).join("");
  els.detailReasons.innerHTML = (item?.reasons || reasonsFor(company, {})).map((reason) => `<div>${reason}</div>`).join("");
  const links = sourceLinks(company);
  els.detailLinks.innerHTML = links.map((link) => `<a href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${link.label}</a>`).join("");
}

function selectCompany(company) {
  state.selected = company;
  renderAll();
  document.querySelector(".detail-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function saveSelectedApplication() {
  if (!state.selected) return;
  const company = state.selected.company;
  state.personalData[company] = {
    ...getPersonalEntry(company),
    status: els.applicationStatus.value,
    next_action: els.nextAction.value.trim(),
    next_deadline: els.nextDeadline.value,
  };
  saveLocal("jobResearchPersonalData", state.personalData);
  showToast(`${company}の応募状況を保存しました`);
  renderAll();
}

function updateStatus(company, status) {
  if (!company) return;
  state.personalData[company.company] = {
    ...getPersonalEntry(company.company),
    status,
    next_action: status === "ES準備中" ? "ES素材を企業の強みと接続する" : getPersonalEntry(company.company).next_action,
  };
  saveLocal("jobResearchPersonalData", state.personalData);
  showToast(`${company.company}を${status}に移動しました`);
  renderAll();
}

function toggleInterested(company) {
  if (!company) return;
  if (state.interestedCompanies[company.company]) {
    delete state.interestedCompanies[company.company];
    showToast(`${company.company}を志望リストから外しました`);
  } else {
    state.interestedCompanies[company.company] = { company: company.company, industry: company.industry, added_at: new Date().toISOString() };
    showToast(`${company.company}を志望リストに追加しました`);
  }
  saveLocal("jobResearchInterestedCompanies", state.interestedCompanies);
  renderAll();
}

function saveProfile() {
  state.applicantProfile = {
    ...state.applicantProfile,
    preference_preset: els.presetMode.value,
    mbti_type: els.mbtiType.value,
    preferred_job_types: els.preferredJobTypes.value.trim(),
    condition_summary: els.conditionSummary.value.trim(),
    es_draft: els.esDraft.value.trim(),
    change_tolerance_score: Number(els.changeTolerance.value),
    autonomy_preference_score: Number(els.autonomyPreference.value),
    logic_orientation_score: Number(els.logicOrientation.value),
    planning_orientation_score: Number(els.planningOrientation.value),
  };
  saveLocal("jobResearchApplicantProfile", state.applicantProfile);
}

function renderProfileForm() {
  const profile = { ...defaultProfile(), ...state.applicantProfile };
  els.presetMode.value = profile.preference_preset;
  els.mbtiType.value = profile.mbti_type || "";
  els.preferredJobTypes.value = profile.preferred_job_types || "";
  els.conditionSummary.value = profile.condition_summary || "";
  els.esDraft.value = profile.es_draft || "";
  els.changeTolerance.value = profile.change_tolerance_score;
  els.autonomyPreference.value = profile.autonomy_preference_score;
  els.logicOrientation.value = profile.logic_orientation_score;
  els.planningOrientation.value = profile.planning_orientation_score;
}

function inferProfileFromMbti() {
  const type = els.mbtiType.value;
  if (!type) return;
  els.changeTolerance.value = type[1] === "N" ? 4 : 3;
  els.autonomyPreference.value = type[1] === "N" || type[3] === "P" ? 4 : 3;
  els.logicOrientation.value = type[2] === "T" ? 4 : 3;
  els.planningOrientation.value = type[3] === "J" ? 4 : 2;
}

function personalFit(company, profile) {
  const preset = preferencePresets[profile.preference_preset || "balanced"] || preferencePresets.balanced;
  const weighted = Object.entries(preset.weights).reduce((sum, [key, weight]) => sum + normalize(company[key], 1, 5) * weight, 0);
  const env = companyEnvironment(company);
  const user = {
    change: Number(profile.change_tolerance_score || 3),
    autonomy: Number(profile.autonomy_preference_score || 3),
    logic: Number(profile.logic_orientation_score || 3),
    planning: Number(profile.planning_orientation_score || 3),
  };
  const closeness = avg(Object.keys(user).map((key) => normalize(5 - Math.abs(user[key] - env[key]), 1, 5)));
  return clamp(weighted * 72 + closeness * 28, 0, 100);
}

function offerLikelihood(company) {
  const access = normalize(company.new_grad_access_score, 1, 5);
  const competitionPenalty = normalize(avg([company.company_strength_score, company.compensation_score, company.career_capital_score]), 1, 5) * 26;
  const info = normalize(avg([company.disclosure_score, company.culture_clarity_score]), 1, 5) * 22;
  const base = access * 44 + info + 34 - competitionPenalty * 0.45;
  return clamp(base, 20, 96);
}

function motivationEase(company, profile) {
  const text = `${profile.es_draft || ""} ${profile.condition_summary || ""} ${profile.preferred_job_types || ""}`;
  let keyword = 0;
  if (/技術|開発|研究|データ|IT|システム|理系/.test(text) && /IT|電機|半導体|自動車|製薬/.test(company.industry)) keyword += 14;
  if (/企画|営業|マーケ|ブランド|消費/.test(text) && /消費財|広告|商社/.test(company.industry)) keyword += 14;
  if (/安定|ワークライフ|転勤|長く/.test(text) && company.stability_score >= 4) keyword += 10;
  if (/成長|裁量|挑戦|コンサル/.test(text) && company.industry_growth_score >= 4) keyword += 10;
  return clamp(normalize(avg([company.comparison_value_score, company.disclosure_score, company.culture_clarity_score]), 1, 5) * 74 + keyword, 20, 98);
}

function esMaterialFit(company, profile) {
  const length = `${profile.es_draft || ""} ${profile.condition_summary || ""}`.trim().length;
  const material = length > 240 ? 22 : length > 90 ? 14 : length > 20 ? 7 : 0;
  return clamp(normalize(avg([company.culture_clarity_score, company.comparison_value_score, company.new_grad_access_score]), 1, 5) * 72 + material, 18, 98);
}

function urgencyScore(company) {
  const entry = getPersonalEntry(company.company);
  if (!entry.next_deadline) {
    if (entry.status === "未調査") return 54;
    if (entry.status === "ES準備中") return 68;
    return 46;
  }
  const days = Math.ceil((new Date(`${entry.next_deadline}T00:00:00`) - new Date()) / 86400000);
  if (days < 0) return 20;
  if (days <= 3) return 96;
  if (days <= 10) return 84;
  if (days <= 21) return 68;
  return 52;
}

function nextActionFor(company) {
  const entry = getPersonalEntry(company.company);
  if (entry.next_action) return entry.next_action;
  if (entry.status === "未調査") return primaryLink(company)?.isSearch ? "公式採用情報を確認してマイページ導線を確定" : "新卒採用ページを開いて募集職種を確認";
  if (entry.status === "調査中") return "根拠ソースから志望理由を3行に圧縮";
  if (entry.status === "ES準備中") return "ES素材を企業の強みと職種に接続";
  if (entry.status === "応募済み") return "面接想定質問と逆質問を準備";
  if (entry.status === "選考中") return "直近面接の企業別メモを整理";
  return "次の応募アクションを登録";
}

function reasonsFor(company, scores) {
  const reasons = [];
  if ((scores.personal || 0) >= 78) reasons.push("あなたの志向プリセットと企業スコアの噛み合わせが高いです。");
  if ((scores.offer || 0) >= 70) reasons.push("採用導線と情報量があり、初動を作りやすい候補です。");
  if ((scores.motivation || 0) >= 72) reasons.push("企業の強みが明確で、志望動機に落とし込みやすいです。");
  if ((scores.es || 0) >= 72) reasons.push("ES素材を企業の採用文脈に接続しやすいです。");
  if (company.advantage_tags) reasons.push(`業界内優位性: ${company.advantage_tags}`);
  if (company.caution_tags) reasons.push(`注意点: ${company.caution_tags}`);
  return reasons.slice(0, 5);
}

function companyEnvironment(company) {
  return {
    change: clamp(avg([company.industry_growth_score, company.transferability_score]), 1, 5),
    autonomy: clamp(2.5 + (company.industry_growth_score - 3) * 0.5 + (company.work_life_balance_score <= 2 ? 0.5 : 0), 1, 5),
    logic: clamp(3 + (/IT|電機|半導体|金融|コンサル/.test(company.industry) ? 0.8 : 0), 1, 5),
    planning: clamp(2.6 + (company.stability_score - 3) * 0.45 + (company.disclosure_score - 3) * 0.25, 1, 5),
  };
}

function sourceLinks(company) {
  const sources = state.evidenceSources[company.company] || [];
  const links = [];
  const recruit = primaryLink(company);
  if (recruit) links.push(recruit);
  for (const source of sources) {
    if (!source.url) continue;
    if (source.source_type === "選考体験記") continue;
    links.push({ label: source.source_type === "IR" ? "IR/統合報告書" : source.title, url: normalizeUrl(source.url) });
  }
  return uniqueBy(links, (d) => d.url).slice(0, 4);
}

function primaryLink(company) {
  if (!company.mypage_url) return null;
  const url = normalizeUrl(company.mypage_url);
  return { label: isSearchUrl(url) ? "公式採用を検索" : "新卒採用を開く", url, isSearch: isSearchUrl(url) };
}

function summaryText() {
  const top = state.recommendations[0];
  if (!top) return "条件に合う企業がありません。フィルターを広げてください。";
  return `${top.company.company}を最優先候補として、${state.filters.weeklyCapacity}社まで行動リスト化しています。`;
}

function boardStatus(status) {
  if (statusColumns.includes(status)) return status;
  if (["マイページ登録済み", "イベント参加予定"].includes(status)) return "調査中";
  if (["内定", "辞退候補", "見送り"].includes(status)) return "選考中";
  return "未調査";
}

function defaultProfile() {
  return {
    mbti_type: "",
    preference_preset: "balanced",
    preferred_job_types: "",
    condition_summary: "",
    es_draft: "",
    change_tolerance_score: 3,
    autonomy_preference_score: 3,
    logic_orientation_score: 3,
    planning_orientation_score: 3,
  };
}

function defaultPersonalEntry() {
  return { status: "未調査", next_action: "", next_deadline: "", personal_memo: "" };
}

function getPersonalEntry(companyName) {
  return state.personalData[companyName] || defaultPersonalEntry();
}

function findCompany(name) {
  return state.companies.find((company) => company.company === name);
}

function interestedNames() {
  return Object.keys(state.interestedCompanies || {}).filter((name) => findCompany(name));
}

function loadLocalData() {
  state.applicantProfile = { ...defaultProfile(), ...loadLocal("jobResearchApplicantProfile") };
  state.personalData = loadLocal("jobResearchPersonalData");
  state.eventData = loadLocal("jobResearchEventData");
  state.sourceData = loadLocal("jobResearchSourceData");
  state.interestedCompanies = loadLocal("jobResearchInterestedCompanies");
}

function loadLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  scheduleCloudSave();
}

function persistAllLocalData() {
  localStorage.setItem("jobResearchApplicantProfile", JSON.stringify(state.applicantProfile));
  localStorage.setItem("jobResearchPersonalData", JSON.stringify(state.personalData));
  localStorage.setItem("jobResearchEventData", JSON.stringify(state.eventData));
  localStorage.setItem("jobResearchSourceData", JSON.stringify(state.sourceData));
  localStorage.setItem("jobResearchInterestedCompanies", JSON.stringify(state.interestedCompanies));
}

async function setupSupabaseSync() {
  const config = window.JOB_RESEARCH_SUPABASE || {};
  if (!config.url || !config.anonKey || !window.supabase) {
    updateSyncStatus("ローカル保存のみ");
    return;
  }
  state.supabase = window.supabase.createClient(config.url, config.anonKey);
  const { data } = await state.supabase.auth.getSession();
  state.authUser = data.session?.user || null;
  state.cloudReady = Boolean(state.authUser);
  if (state.authUser) await loadCloudData();
  state.supabase.auth.onAuthStateChange(async (_event, session) => {
    state.authUser = session?.user || null;
    state.cloudReady = Boolean(state.authUser);
    if (state.authUser) await loadCloudData();
    renderProfileForm();
    renderAll();
  });
  updateSyncStatus();
}

async function handleAuthButton() {
  if (!state.supabase) {
    showToast("Supabase設定が未登録です");
    return;
  }
  if (state.authUser) {
    await state.supabase.auth.signOut();
    state.authUser = null;
    state.cloudReady = false;
    updateSyncStatus();
    return;
  }
  await state.supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.JOB_RESEARCH_SUPABASE?.redirectUrl?.replace("/visualizer/", "/planner/") || window.location.href.split("#")[0],
    },
  });
}

async function loadCloudData() {
  if (!state.supabase || !state.authUser) return;
  const { data, error } = await state.supabase
    .from("user_job_research_profiles")
    .select("applicant_profile, personal_data, event_data, source_data, interested_companies")
    .eq("user_id", state.authUser.id)
    .maybeSingle();
  if (error) {
    updateSyncStatus("クラウド読込に失敗");
    return;
  }
  if (!data) {
    await saveCloudData({ immediate: true, silent: true });
    return;
  }
  state.applicantProfile = { ...defaultProfile(), ...(data.applicant_profile || {}) };
  state.personalData = data.personal_data || {};
  state.eventData = data.event_data || {};
  state.sourceData = data.source_data || {};
  state.interestedCompanies = data.interested_companies || {};
  persistAllLocalData();
}

function scheduleCloudSave() {
  if (!state.cloudReady || !state.authUser || !state.supabase) return;
  window.clearTimeout(scheduleCloudSave.timer);
  scheduleCloudSave.timer = window.setTimeout(() => saveCloudData(), 700);
}

async function saveCloudData(options = {}) {
  if (!state.supabase || !state.authUser) {
    if (!options.silent) showToast("Googleログインすると同期できます");
    return;
  }
  if (state.syncing) return;
  state.syncing = true;
  const payload = {
    user_id: state.authUser.id,
    applicant_profile: state.applicantProfile || {},
    personal_data: state.personalData || {},
    event_data: state.eventData || {},
    source_data: state.sourceData || {},
    interested_companies: state.interestedCompanies || {},
  };
  const { error } = await state.supabase.from("user_job_research_profiles").upsert(payload, { onConflict: "user_id" });
  state.syncing = false;
  if (error) {
    updateSyncStatus("同期に失敗");
    if (!options.silent) showToast("同期に失敗しました");
    return;
  }
  updateSyncStatus();
  if (options.immediate && !options.silent) showToast("クラウド同期しました");
}

function updateSyncStatus(message = "") {
  const configured = Boolean(window.JOB_RESEARCH_SUPABASE?.url && window.JOB_RESEARCH_SUPABASE?.anonKey && window.supabase);
  if (!configured) {
    els.syncStatus.textContent = message || "ローカル保存のみ";
    els.syncButton.textContent = "未設定";
    els.syncButton.disabled = true;
    els.syncNow.disabled = true;
    return;
  }
  if (!state.authUser) {
    els.syncStatus.textContent = message || "未ログイン。Googleログインで同期できます";
    els.syncButton.textContent = "Googleログイン";
    els.syncButton.disabled = false;
    els.syncNow.disabled = true;
    return;
  }
  els.syncStatus.textContent = message || `${state.authUser.email || "Googleアカウント"}で同期中`;
  els.syncButton.textContent = "ログアウト";
  els.syncNow.disabled = false;
}

function groupByCompany(rows) {
  return rows.reduce((map, row) => {
    if (!map[row.company]) map[row.company] = [];
    map[row.company].push(row);
    return map;
  }, {});
}

function unique(values) {
  return [...new Set(values)];
}

function uniqueBy(items, getKey) {
  const seen = new Set();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function avg(values) {
  const nums = values.filter((value) => Number.isFinite(value));
  return nums.reduce((sum, value) => sum + value, 0) / (nums.length || 1);
}

function normalize(value, min, max) {
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeUrl(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function isSearchUrl(url) {
  return /^https:\/\/www\.google\.com\/search\?/i.test(normalizeUrl(url));
}

function escapeAttr(value) {
  return String(value || "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.hidden = true;
  }, 2400);
}

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
  balanced: {
    label: "総合バランス",
    weights: {
      industry_growth_score: 0.10,
      company_strength_score: 0.13,
      stability_score: 0.10,
      compensation_score: 0.10,
      career_capital_score: 0.13,
      new_grad_access_score: 0.10,
      culture_clarity_score: 0.07,
      work_life_balance_score: 0.07,
      transferability_score: 0.10,
      disclosure_score: 0.05,
      comparison_value_score: 0.05,
    },
  },
  salary: {
    label: "高年収重視",
    weights: {
      industry_growth_score: 0.08,
      company_strength_score: 0.12,
      stability_score: 0.07,
      compensation_score: 0.22,
      career_capital_score: 0.14,
      new_grad_access_score: 0.07,
      culture_clarity_score: 0.04,
      work_life_balance_score: 0.04,
      transferability_score: 0.15,
      disclosure_score: 0.03,
      comparison_value_score: 0.04,
    },
  },
  growthCareer: {
    label: "成長環境重視",
    weights: {
      industry_growth_score: 0.16,
      company_strength_score: 0.16,
      stability_score: 0.05,
      compensation_score: 0.08,
      career_capital_score: 0.18,
      new_grad_access_score: 0.08,
      culture_clarity_score: 0.05,
      work_life_balance_score: 0.03,
      transferability_score: 0.15,
      disclosure_score: 0.03,
      comparison_value_score: 0.03,
    },
  },
  stability: {
    label: "安定重視",
    weights: {
      industry_growth_score: 0.05,
      company_strength_score: 0.10,
      stability_score: 0.22,
      compensation_score: 0.08,
      career_capital_score: 0.08,
      new_grad_access_score: 0.10,
      culture_clarity_score: 0.08,
      work_life_balance_score: 0.16,
      transferability_score: 0.06,
      disclosure_score: 0.05,
      comparison_value_score: 0.02,
    },
  },
  workLife: {
    label: "ワークライフバランス重視",
    weights: {
      industry_growth_score: 0.05,
      company_strength_score: 0.08,
      stability_score: 0.15,
      compensation_score: 0.08,
      career_capital_score: 0.07,
      new_grad_access_score: 0.10,
      culture_clarity_score: 0.12,
      work_life_balance_score: 0.24,
      transferability_score: 0.05,
      disclosure_score: 0.04,
      comparison_value_score: 0.02,
    },
  },
  engineer: {
    label: "理系技術職向け",
    weights: {
      industry_growth_score: 0.16,
      company_strength_score: 0.15,
      stability_score: 0.10,
      compensation_score: 0.10,
      career_capital_score: 0.16,
      new_grad_access_score: 0.06,
      culture_clarity_score: 0.05,
      work_life_balance_score: 0.07,
      transferability_score: 0.12,
      disclosure_score: 0.02,
      comparison_value_score: 0.01,
    },
  },
  generalist: {
    label: "文系総合職向け",
    weights: {
      industry_growth_score: 0.08,
      company_strength_score: 0.16,
      stability_score: 0.12,
      compensation_score: 0.10,
      career_capital_score: 0.12,
      new_grad_access_score: 0.14,
      culture_clarity_score: 0.08,
      work_life_balance_score: 0.06,
      transferability_score: 0.06,
      disclosure_score: 0.03,
      comparison_value_score: 0.05,
    },
  },
};

const industryColors = {
  "IT・SI・通信": "#197278",
  "コンサル": "#c05a2b",
  "総合商社": "#7f5aa2",
  "金融": "#2f6fab",
  "自動車・機械・精密": "#7a7f2b",
  "電機・半導体": "#be7c1f",
  "消費財・食品・日用品": "#2f855a",
  "製薬・ヘルスケア": "#a2476f",
  "広告・エンタメ・メディア": "#d14e6a",
  "不動産・インフラ": "#5f6f7f",
};

const redirectingToServer = window.location.protocol === "file:";
const localServerUrl = "http://127.0.0.1:8766/visualizer/";

if (redirectingToServer) {
  window.location.replace(localServerUrl);
}

const state = {
  companies: [],
  applicantProfile: {},
  applicantSignals: {},
  personalData: {},
  eventData: {},
  sourceData: {},
  evidenceSources: {},
  interestedCompanies: {},
  selected: null,
  selectedIndustry: "",
  view: "home",
  filters: {
    industry: "すべて",
    presetMode: "balanced",
    minScore: 3,
    confirmedOnly: false,
  },
};

const els = {
  statCompanies: document.querySelector("#statCompanies"),
  statIndustries: document.querySelector("#statIndustries"),
  statInterested: document.querySelector("#statInterested"),
  homeJump: document.querySelector("#homeJump"),
  interestedJump: document.querySelector("#interestedJump"),
  profileJump: document.querySelector("#profileJump"),
  applicantProfile: document.querySelector("#applicantProfile"),
  profileTimelineSummary: document.querySelector("#profileTimelineSummary"),
  profileTimelineList: document.querySelector("#profileTimelineList"),
  interestedCompanyList: document.querySelector("#interestedCompanyList"),
  industryFilter: document.querySelector("#industryFilter"),
  presetMode: document.querySelector("#presetMode"),
  minScore: document.querySelector("#minScore"),
  minScoreLabel: document.querySelector("#minScoreLabel"),
  confirmedOnly: document.querySelector("#confirmedOnly"),
  mbtiType: document.querySelector("#mbtiType"),
  extroversionPreference: document.querySelector("#extroversionPreference"),
  changeTolerance: document.querySelector("#changeTolerance"),
  teamOrientation: document.querySelector("#teamOrientation"),
  autonomyPreference: document.querySelector("#autonomyPreference"),
  logicOrientation: document.querySelector("#logicOrientation"),
  planningOrientation: document.querySelector("#planningOrientation"),
  preferredJobTypes: document.querySelector("#preferredJobTypes"),
  preferredLocations: document.querySelector("#preferredLocations"),
  esDraft: document.querySelector("#esDraft"),
  experienceSummary: document.querySelector("#experienceSummary"),
  conditionSummary: document.querySelector("#conditionSummary"),
  saveApplicantProfile: document.querySelector("#saveApplicantProfile"),
  runApplicantAnalysis: document.querySelector("#runApplicantAnalysis"),
  profileStatus: document.querySelector("#profileStatus"),
  industryStatusList: document.querySelector("#industryStatusList"),
  mapLegend: document.querySelector("#mapLegend"),
  companyMap: document.querySelector("#companyMap"),
  companyMapTitle: document.querySelector("#companyMapTitle"),
  industryMap: document.querySelector("#industryMap"),
  axisCaption: document.querySelector("#axisCaption"),
  selectedCompany: document.querySelector("#selectedCompany"),
  selectedMeta: document.querySelector("#selectedMeta"),
  mypageLink: document.querySelector("#mypageLink"),
  interestToggle: document.querySelector("#interestToggle"),
  personalScore: document.querySelector("#personalScore"),
  offerScore: document.querySelector("#offerScore"),
  fitScore: document.querySelector("#fitScore"),
  motivationScore: document.querySelector("#motivationScore"),
  esMaterialScore: document.querySelector("#esMaterialScore"),
  applicationStatus: document.querySelector("#applicationStatus"),
  nextAction: document.querySelector("#nextAction"),
  nextDeadline: document.querySelector("#nextDeadline"),
  personalMemo: document.querySelector("#personalMemo"),
  savePersonalData: document.querySelector("#savePersonalData"),
  exportPersonalData: document.querySelector("#exportPersonalData"),
  detailTabs: document.querySelectorAll(".detail-tabs button"),
  tabApplication: document.querySelector("#tabApplication"),
  tabEvents: document.querySelector("#tabEvents"),
  tabSources: document.querySelector("#tabSources"),
  eventList: document.querySelector("#eventList"),
  eventType: document.querySelector("#eventType"),
  eventTitle: document.querySelector("#eventTitle"),
  eventDate: document.querySelector("#eventDate"),
  eventDeadline: document.querySelector("#eventDeadline"),
  eventUrl: document.querySelector("#eventUrl"),
  eventNotes: document.querySelector("#eventNotes"),
  addEvent: document.querySelector("#addEvent"),
  sourceList: document.querySelector("#sourceList"),
  sourceScoreKey: document.querySelector("#sourceScoreKey"),
  sourceType: document.querySelector("#sourceType"),
  sourceTitle: document.querySelector("#sourceTitle"),
  sourceUrl: document.querySelector("#sourceUrl"),
  sourceReliability: document.querySelector("#sourceReliability"),
  sourceReliabilityLabel: document.querySelector("#sourceReliabilityLabel"),
  sourceSummary: document.querySelector("#sourceSummary"),
  addSource: document.querySelector("#addSource"),
  scoreBars: document.querySelector("#scoreBars"),
  advantageText: document.querySelector("#advantageText"),
  cautionText: document.querySelector("#cautionText"),
  aiInsightList: document.querySelector("#aiInsightList"),
  recommendationList: document.querySelector("#recommendationList"),
  companyTable: document.querySelector("#companyTable"),
  tooltip: document.querySelector("#tooltip"),
  toast: document.querySelector("#toast"),
};

if (!redirectingToServer) init();

async function init() {
  const [scores, targets, evidenceSources] = await loadCompanyData();
  const targetByCompany = new Map(targets.map((d) => [d.company, d]));
  state.companies = scores.map((row) => {
    const target = targetByCompany.get(row.company) || {};
    const item = { ...target, ...row };
    for (const [key] of scoreKeys) item[key] = Number(item[key]);
    item.priority_rank = Number(item.priority_rank);
    item.overall_score = Number(item.overall_score);
      item.mypage_2028_status = target.mypage_2028_status || "要確認";
      item.mypage_url = target.mypage_url || "";
      item.status = companyStatus(item);
      item.personal_score = 0;
      item.offer_score = 0;
      item.fit_score = 0;
      return item;
  });

  state.applicantProfile = loadApplicantProfile();
  state.filters.presetMode = state.applicantProfile.preference_preset || state.filters.presetMode;
  state.applicantSignals = analyzeApplicantProfile(state.applicantProfile);
  state.personalData = loadPersonalData();
  state.eventData = loadStorageMap("jobResearchEventData");
  state.sourceData = loadStorageMap("jobResearchSourceData");
  state.evidenceSources = groupByCompany(evidenceSources);
  state.interestedCompanies = loadStorageMap("jobResearchInterestedCompanies");
  state.selected = [...state.companies].sort((a, b) => b.overall_score - a.overall_score)[0];
  state.selectedIndustry = state.selected.industry;
  setupControls();
  renderAll();
}

async function loadCompanyData() {
  try {
    return await Promise.all([
      loadCsv("../data/target_company_scores_initial.csv"),
      loadCsv("../data/target_companies_100.csv"),
      loadOptionalCsv("../data/score_evidence_sources.csv"),
    ]);
  } catch (error) {
    if (window.location.protocol === "file:") window.location.replace(localServerUrl);
    throw error;
  }
}

async function loadCsv(path) {
  const response = await fetch(withCacheBust(path), { cache: "no-store" });
  if (!response.ok) throw new Error(`${path} could not be loaded`);
  return parseCsv(await response.text());
}

async function loadOptionalCsv(path) {
  const response = await fetch(withCacheBust(path), { cache: "no-store" });
  if (!response.ok) return [];
  return parseCsv(await response.text());
}

function withCacheBust(path) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${Date.now()}`;
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
  els.sourceScoreKey.innerHTML = scoreKeys.map(([key, label]) => `<option value="${key}">${label}</option>`).join("");
  renderApplicantProfileForm();
  els.industryFilter.addEventListener("change", () => {
    selectIndustry(els.industryFilter.value);
    renderAll();
  });
  els.presetMode.addEventListener("change", () => {
    state.filters.presetMode = els.presetMode.value;
    state.applicantProfile.preference_preset = els.presetMode.value;
    renderAll();
  });
  els.homeJump.addEventListener("click", () => setView("home"));
  els.interestedJump.addEventListener("click", () => setView("profile"));
  els.profileJump.addEventListener("click", () => {
    setView(state.view === "profile" ? "home" : "profile");
  });
  els.minScore.addEventListener("input", () => {
    state.filters.minScore = Number(els.minScore.value);
    els.minScoreLabel.textContent = state.filters.minScore.toFixed(2);
    renderAll();
  });
  els.confirmedOnly.addEventListener("change", () => {
    state.filters.confirmedOnly = els.confirmedOnly.checked;
    renderAll();
  });
  els.mbtiType.addEventListener("change", inferProfileFromMbti);
  els.saveApplicantProfile.addEventListener("click", () => {
    saveApplicantProfile();
    showProfileStatus("プロフィールを更新しました");
    renderAll();
  });
  els.runApplicantAnalysis.addEventListener("click", () => {
    saveApplicantProfile();
    state.applicantSignals = analyzeApplicantProfile(state.applicantProfile);
    showProfileStatus("AI分析を更新しました");
    renderAll();
  });
  els.savePersonalData.addEventListener("click", () => {
    saveSelectedPersonalData();
    renderAll();
  });
  els.interestToggle.addEventListener("click", () => toggleInterestedCompany(state.selected));
  els.exportPersonalData.addEventListener("click", exportPersonalDataCsv);
  els.detailTabs.forEach((button) => {
    button.addEventListener("click", () => setDetailTab(button.dataset.tab));
  });
  els.addEvent.addEventListener("click", () => {
    addSelectedEvent();
    renderAll();
  });
  els.addSource.addEventListener("click", () => {
    addSelectedSource();
    renderAll();
  });
  els.sourceReliability.addEventListener("input", () => {
    els.sourceReliabilityLabel.textContent = els.sourceReliability.value;
  });
  window.addEventListener("resize", debounce(renderAll, 120));
}

function renderAll() {
  applyPersonalScores();
  const filtered = getFilteredCompanies();
  els.statCompanies.textContent = state.companies.length;
  els.statIndustries.textContent = unique(state.companies.map((d) => d.industry)).length;
  els.statInterested.textContent = interestedCompanyNames().length;
  els.minScoreLabel.textContent = state.filters.minScore.toFixed(2);
  els.axisCaption.textContent = "横軸: 安定性 ←→ 成長性 / 縦軸: 働きやすさ ←→ キャリア資本 / 円の大きさ: 業界内優位性";
  els.companyMapTitle.textContent = `${state.selectedIndustry || "選択業界"}の企業マップ`;
  renderView();
  renderIndustryStatus();
  renderLegend();
  renderCompanyMap(getIndustryMapCompanies());
  renderIndustryMap();
  renderDetail(state.selected);
  renderRecommendations(filtered);
  renderProfileTimeline();
  renderTable(filtered);
}

function setView(view) {
  state.view = view;
  renderView();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderView() {
  document.body.classList.toggle("profile-mode", state.view === "profile");
  els.profileJump.classList.toggle("is-active", state.view === "profile");
  els.homeJump.classList.toggle("is-active", state.view === "home");
  els.profileJump.querySelector("span").textContent = state.view === "profile" ? "Companies" : "My Profile";
  els.profileJump.querySelector("small").textContent = state.view === "profile" ? "マップに戻る" : "設定を開く";
}

function getFilteredCompanies() {
  return state.companies.filter((d) => {
    if (state.filters.industry !== "すべて" && d.industry !== state.filters.industry) return false;
    if (state.filters.confirmedOnly && d.mypage_2028_status !== "確認済み") return false;
    return d.overall_score >= state.filters.minScore;
  });
}

function getIndustryMapCompanies() {
  const targetIndustry = state.selectedIndustry || state.filters.industry;
  return getFilteredCompanies().filter((d) => targetIndustry === "すべて" || d.industry === targetIndustry);
}

function renderIndustryStatus() {
  const summaries = industrySummaries(state.companies);
  els.industryStatusList.innerHTML = summaries.map((s) => `
    <button class="status-item ${s.industry === state.selectedIndustry ? "is-active" : ""}" type="button" data-industry="${escapeAttr(s.industry)}">
      <strong>
        <span>${s.industry}</span>
        <span class="status-pill ${s.statusClass}">${s.status}</span>
      </strong>
      <small>平均 ${s.avg.toFixed(2)} / 28卒確認 ${s.confirmed}社 / ${s.count}社</small>
    </button>
  `).join("");
  els.industryStatusList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectIndustry(button.dataset.industry);
      renderAll();
    });
  });
}

function selectIndustry(industry) {
  state.filters.industry = industry;
  els.industryFilter.value = industry;
  if (industry === "すべて") return;
  state.selectedIndustry = industry;
  if (!state.selected || state.selected.industry !== industry) {
    const candidates = state.companies
      .filter((company) => company.industry === industry)
      .sort((a, b) => b.overall_score - a.overall_score);
    state.selected = candidates[0] || state.selected;
  }
}

function renderLegend() {
  els.mapLegend.innerHTML = unique(state.companies.map((d) => d.industry)).map((industry) => `
    <span><i class="swatch" style="background:${industryColors[industry]}"></i>${industry}</span>
  `).join("");
}

function renderCompanyMap(data) {
  const svg = els.companyMap;
  const width = svg.clientWidth || 820;
  const height = svg.clientHeight || 520;
  const pad = { top: 76, right: 82, bottom: 76, left: 82 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const domain = [0, 100];
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  clear(svg);

  drawGrid(svg, width, height, pad, domain);

  const horizontalValues = data.map(stabilityGrowthBalance);
  const verticalValues = data.map(workLifeCareerBalance);
  const advantageValues = data.map(industryAdvantageScore);
  const nodes = data.map((d) => {
    const jitter = hashPoint(d.company);
    const xValue = relativeScore(stabilityGrowthBalance(d), horizontalValues);
    const yValue = relativeScore(workLifeCareerBalance(d), verticalValues);
    const radius = 12 + relativeScore(industryAdvantageScore(d), advantageValues) * 0.16;
    const rawX = pad.left + ((xValue - domain[0]) / (domain[1] - domain[0])) * plotW + jitter.x * 14;
    const rawY = pad.top + plotH - ((yValue - domain[0]) / (domain[1] - domain[0])) * plotH + jitter.y * 14;
    return {
      d,
      x: clamp(rawX, pad.left + radius, pad.left + plotW - radius),
      y: clamp(rawY, pad.top + radius, pad.top + plotH - radius),
      r: radius,
    };
  });
  resolveNodeOverlaps(nodes, pad, plotW, plotH, 14);

  const pairs = pairDistances(nodes.map((node) => ({
    industry: node.d.company,
    vector: companyVector(node.d),
    x: node.x,
    y: node.y,
  }))).sort((a, b) => a.distance - b.distance).slice(0, Math.min(16, Math.max(0, nodes.length - 1)));
  for (const pair of pairs) {
    const a = nodes.find((node) => node.d.company === pair.a);
    const b = nodes.find((node) => node.d.company === pair.b);
    if (!a || !b || pair.distance > 2.2) continue;
    svg.appendChild(el("line", {
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      stroke: industryColors[a.d.industry],
      "stroke-width": 1,
      opacity: 0.23,
    }));
  }

  for (const node of nodes) {
    const glyph = companyGlyph(node);
    glyph.addEventListener("click", () => selectCompany(node.d));
    glyph.addEventListener("mousemove", (event) => showTooltip(event, companyTooltip(node.d)));
    glyph.addEventListener("mouseleave", hideTooltip);
    svg.appendChild(glyph);
  }

  for (const labelNode of labelCandidates(nodes)) {
    const label = compactCompanyName(labelNode.d.company);
    const labelW = Math.max(42, label.length * 11 + 14);
    const labelH = 22;
    const rightSide = labelNode.x < width - pad.right - labelW - labelNode.r - 10;
    const x = rightSide ? labelNode.x + labelNode.r + 8 : labelNode.x - labelNode.r - labelW - 8;
    const y = clamp(labelNode.y - labelH / 2, pad.top + 4, pad.top + plotH - labelH - 4);
    svg.appendChild(el("rect", {
      x,
      y,
      width: labelW,
      height: labelH,
      rx: 5,
      fill: "#ffffff",
      stroke: "#d9e0df",
      "stroke-width": 1,
      opacity: 0.92,
    }));
    svg.appendChild(el("text", {
      x: x + labelW / 2,
      y: y + 15,
      fill: "#263234",
      "font-size": 11,
      "font-weight": 700,
      "text-anchor": "middle",
    }, label));
  }

  if (!data.length) {
    svg.appendChild(el("text", { x: width / 2, y: height / 2, "text-anchor": "middle", fill: "#667478" }, "この業界で条件に合う企業がありません"));
  }
}

function drawGrid(svg, width, height, pad, domain) {
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const ticks = makeTicks(domain[0], domain[1]);
  for (const i of ticks) {
    const x = pad.left + ((i - domain[0]) / (domain[1] - domain[0])) * plotW;
    const y = pad.top + plotH - ((i - domain[0]) / (domain[1] - domain[0])) * plotH;
    svg.appendChild(el("line", { class: "grid-line", x1: x, y1: pad.top, x2: x, y2: pad.top + plotH }));
    svg.appendChild(el("line", { class: "grid-line", x1: pad.left, y1: y, x2: pad.left + plotW, y2: y }));
    svg.appendChild(el("text", { class: "axis-label tick-label", x, y: pad.top + plotH + 20, "text-anchor": "middle" }, formatTick(i)));
    svg.appendChild(el("text", { class: "axis-label tick-label", x: pad.left - 20, y: y + 4, "text-anchor": "middle" }, formatTick(i)));
  }
  const midX = pad.left + plotW / 2;
  const midY = pad.top + plotH / 2;
  svg.appendChild(el("line", { x1: midX, y1: pad.top, x2: midX, y2: pad.top + plotH, stroke: "#9fb0b2", "stroke-width": 1.4, opacity: 0.55 }));
  svg.appendChild(el("line", { x1: pad.left, y1: midY, x2: pad.left + plotW, y2: midY, stroke: "#9fb0b2", "stroke-width": 1.4, opacity: 0.55 }));
  svg.appendChild(el("text", { class: "axis-label edge-label", x: midX, y: pad.top - 24, "text-anchor": "middle" }, "キャリア資本"));
  svg.appendChild(el("text", { class: "axis-label edge-label", x: midX, y: pad.top + plotH + 42, "text-anchor": "middle" }, "働きやすさ"));
  svg.appendChild(el("text", { class: "axis-label edge-label", x: pad.left - 28, y: midY + 4, "text-anchor": "end" }, "安定性"));
  svg.appendChild(el("text", { class: "axis-label edge-label", x: pad.left + plotW + 28, y: midY + 4 }, "成長性"));
}

function renderIndustryMap() {
  const svg = els.industryMap;
  const width = svg.clientWidth || 640;
  const height = svg.clientHeight || 368;
  const pad = 42;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  clear(svg);

  const summaries = industrySummaries(state.companies);
  const vectors = summaries.map((s) => ({
    ...s,
    vector: averageVector(state.companies.filter((d) => d.industry === s.industry)),
  }));
  const maxDist = Math.max(...pairDistances(vectors).map((d) => d.distance));
  const xMetric = (v) => avg([v.vector.industry_growth_score, v.vector.career_capital_score, v.vector.transferability_score]);
  const yMetric = (v) => avg([v.vector.stability_score, v.vector.work_life_balance_score, v.vector.disclosure_score]);
  const xs = vectors.map(xMetric);
  const ys = vectors.map(yMetric);
  const xScale = scale(Math.min(...xs) - 0.08, Math.max(...xs) + 0.08, pad, width - pad);
  const yScale = scale(Math.min(...ys) - 0.08, Math.max(...ys) + 0.08, height - pad, pad);
  const positioned = vectors.map((v) => ({ ...v, x: xScale(xMetric(v)), y: yScale(yMetric(v)) }));

  const pairs = pairDistances(positioned)
    .filter((p) => p.distance <= maxDist * 0.48)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 12);
  for (const pair of pairs) {
    const a = positioned.find((d) => d.industry === pair.a);
    const b = positioned.find((d) => d.industry === pair.b);
    svg.appendChild(el("line", {
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      stroke: "#9fb0b2",
      "stroke-width": 1.2,
      opacity: 0.42,
    }));
  }

  svg.appendChild(el("text", { class: "axis-label", x: width / 2, y: height - 10, "text-anchor": "middle" }, "成長性・キャリア資本・転職市場価値"));
  svg.appendChild(el("text", { class: "axis-label", x: 15, y: height / 2, transform: `rotate(-90 15 ${height / 2})`, "text-anchor": "middle" }, "安定性・働きやすさ・情報開示"));

  for (const item of positioned) {
    const group = el("g", { tabindex: 0 });
    group.appendChild(el("circle", {
      cx: item.x,
      cy: item.y,
      r: 18 + item.avg * 3,
      fill: industryColors[item.industry],
      opacity: 0.86,
      stroke: "#fff",
      "stroke-width": 2,
    }));
    group.appendChild(el("text", {
      class: "industry-label",
      x: item.x,
      y: item.y + 38,
      "text-anchor": "middle",
    }, item.industry));
    group.addEventListener("click", () => {
      state.selectedIndustry = item.industry;
      state.filters.industry = item.industry;
      els.industryFilter.value = item.industry;
      const topCompany = [...state.companies]
        .filter((company) => company.industry === item.industry)
        .sort((a, b) => b.personal_score - a.personal_score)[0];
      if (topCompany) state.selected = topCompany;
      renderAll();
    });
    group.addEventListener("mousemove", (event) => showTooltip(event, `${item.industry}<br>平均総合点 ${item.avg.toFixed(2)}<br>${item.status}`));
    group.addEventListener("mouseleave", hideTooltip);
    svg.appendChild(group);
  }
}

function renderDetail(company) {
  if (!company) return;
  els.selectedCompany.textContent = company.company;
  els.selectedMeta.textContent = `${company.industry} / 総合 ${company.overall_score.toFixed(2)} / ${company.mypage_2028_status} / ${preferencePresets[state.filters.presetMode].label}`;
  els.advantageText.textContent = company.advantage_tags || "-";
  els.cautionText.textContent = company.caution_tags || "-";
  els.personalScore.textContent = company.personal_score.toFixed(2);
  els.offerScore.textContent = company.offer_score.toFixed(2);
  els.fitScore.textContent = company.fit_score.toFixed(2);
  els.motivationScore.textContent = company.motivation_score.toFixed(2);
  els.esMaterialScore.textContent = company.es_material_score.toFixed(2);
  renderInterestToggle(company);
  renderPersonalForm(company);
  renderEventList(company);
  renderSourceList(company);
  renderAiInsights(company);
  if (company.mypage_url) {
    els.mypageLink.hidden = false;
    els.mypageLink.href = normalizeUrl(company.mypage_url);
    els.mypageLink.textContent = company.mypage_2028_status === "確認済み" ? "新卒マイページ" : "採用ページ確認";
  } else {
    els.mypageLink.hidden = true;
    els.mypageLink.href = "#";
    els.mypageLink.textContent = "マイページ未登録";
  }
  els.scoreBars.innerHTML = scoreKeys.map(([key, label]) => `
    <div class="score-row">
      <span>${label}</span>
      <div class="score-track"><div class="score-fill" style="width:${(company[key] / 5) * 100}%"></div></div>
      <strong>${company[key]}</strong>
    </div>
  `).join("");
}

function renderInterestToggle(company) {
  const active = Boolean(state.interestedCompanies[company.company]);
  els.interestToggle.textContent = active ? "志望リスト解除" : "志望リスト追加";
  els.interestToggle.classList.toggle("is-active", active);
}

function toggleInterestedCompany(company) {
  if (!company) return;
  if (state.interestedCompanies[company.company]) {
    delete state.interestedCompanies[company.company];
    showToast(`${company.company}を志望リストから外しました`);
  } else {
    state.interestedCompanies[company.company] = {
      company: company.company,
      industry: company.industry,
      added_at: new Date().toISOString(),
    };
    showToast(`${company.company}を志望リストに追加しました`);
  }
  localStorage.setItem("jobResearchInterestedCompanies", JSON.stringify(state.interestedCompanies));
  renderAll();
}

function interestedCompanyNames() {
  return Object.keys(state.interestedCompanies || {}).filter((name) => state.companies.some((company) => company.company === name));
}

function renderTable(data) {
  const rows = [...data].sort((a, b) => b.personal_score - a.personal_score || b.overall_score - a.overall_score || a.priority_rank - b.priority_rank);
  els.companyTable.innerHTML = rows.map((d, index) => `
    <tr data-company="${escapeAttr(d.company)}" class="${d === state.selected ? "is-selected" : ""}">
      <td>${index + 1}</td>
      <td>${d.company}</td>
      <td>${d.industry}</td>
      <td><strong>${d.overall_score.toFixed(2)}</strong></td>
      <td><strong>${d.personal_score.toFixed(2)}</strong></td>
      <td>${d.motivation_score.toFixed(2)}</td>
      <td>${d.es_material_score.toFixed(2)}</td>
      <td>${getPersonalEntry(d.company).status}</td>
      <td>${d.compensation_score}</td>
      <td>${d.career_capital_score}</td>
      <td>${d.stability_score}</td>
      <td>${d.mypage_2028_status}</td>
    </tr>
  `).join("");
  els.companyTable.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      const company = state.companies.find((d) => d.company === row.dataset.company);
      selectCompany(company);
    });
  });
}

function selectCompany(company) {
  state.selected = company;
  state.selectedIndustry = company.industry;
  els.industryFilter.value = company.industry;
  state.filters.industry = company.industry;
  renderCompanyMap(getIndustryMapCompanies());
  renderDetail(company);
  renderTable(getFilteredCompanies());
}

function applyPersonalScores() {
  for (const company of state.companies) {
    const entry = getPersonalEntry(company.company);
    const weighted = weightedCompanyScore(company);
    const fit = personalFitScore(company, entry);
    const offer = offerLikelihoodScore(company, entry);
    const motivation = motivationBuildScore(company, entry);
    const esMaterial = esMaterialFitScore(company, entry);
    const analysis = companyAiAnalysis(company, entry, motivation, esMaterial);
    company.fit_score = fit;
    company.offer_score = offer;
    company.motivation_score = motivation;
    company.es_material_score = esMaterial;
    company.caution_summary = analysis.caution;
    company.recommended_next_action = analysis.nextAction;
    company.matching_reasons = analysis.reasons;
    company.personal_score = round2(weighted * 0.46 + fit * 0.20 + offer * 0.16 + motivation * 0.10 + esMaterial * 0.08);
  }
}

function weightedCompanyScore(company) {
  const preset = preferencePresets[state.filters.presetMode];
  const score = scoreKeys.reduce((sum, [key]) => sum + company[key] * preset.weights[key], 0);
  return round2(score);
}

function industryAdvantageScore(company) {
  return round2(clamp(avg([
    company.company_strength_score,
    company.comparison_value_score,
    company.compensation_score,
    company.disclosure_score,
  ]), 3, 5));
}

function stabilityGrowthBalance(company) {
  return company.industry_growth_score + company.company_strength_score * 0.35 - company.stability_score * 0.75;
}

function workLifeCareerBalance(company) {
  return company.career_capital_score + company.transferability_score * 0.35 - company.work_life_balance_score * 0.8;
}

function companyPresenceRadius(company) {
  return 8 + (companyPresenceValue(company) - 3) * 7;
}

function companyPresenceValue(company) {
  return avg([
    company.company_strength_score,
    company.stability_score,
    company.comparison_value_score,
    company.overall_score,
  ]);
}

function companyVector(company) {
  return Object.fromEntries(scoreKeys.map(([key]) => [key, company[key]]));
}

function resolveNodeOverlaps(nodes, pad, plotW, plotH, gap = 10) {
  for (let iteration = 0; iteration < 120; iteration += 1) {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = a.r + b.r + gap;
        if (distance === 0) {
          dx = hashPoint(a.d.company).x || 0.4;
          dy = hashPoint(b.d.company).y || -0.4;
          distance = Math.sqrt(dx * dx + dy * dy);
        }
        if (distance < minDistance) {
          const push = (minDistance - distance) / 2;
          const ux = dx / distance;
          const uy = dy / distance;
          a.x -= ux * push;
          a.y -= uy * push;
          b.x += ux * push;
          b.y += uy * push;
        }
      }
    }
    for (const node of nodes) {
      node.x = clamp(node.x, pad.left + node.r, pad.left + plotW - node.r);
      node.y = clamp(node.y, pad.top + node.r, pad.top + plotH - node.r);
    }
  }
}

function companyColor(company) {
  const base = hexToRgb(industryColors[company.industry] || "#197278");
  const hash = hashNumber(company.company);
  const mixTargets = [
    { r: 255, g: 255, b: 255 },
    { r: 20, g: 33, b: 38 },
    { r: 236, g: 139, b: 76 },
    { r: 75, g: 125, b: 185 },
    { r: 69, g: 150, b: 96 },
  ];
  const target = mixTargets[hash % mixTargets.length];
  const ratio = 0.18 + ((hash >> 3) % 18) / 100;
  return rgbToCss({
    r: Math.round(base.r * (1 - ratio) + target.r * ratio),
    g: Math.round(base.g * (1 - ratio) + target.g * ratio),
    b: Math.round(base.b * (1 - ratio) + target.b * ratio),
  });
}

function companyInitial(name) {
  return String(name).replace(/\s|株式会社|グループ|ホールディングス|株式会社/g, "").slice(0, 2);
}

function compactCompanyName(name) {
  return String(name)
    .replace(/株式会社/g, "")
    .replace(/ホールディングス/g, "HD")
    .replace(/グループ/g, "G")
    .slice(0, 8);
}

function companyGlyph(node) {
  const group = el("g", { class: "company-dot", tabindex: 0 });
  const base = companyColor(node.d);
  const dark = adjustColor(base, -32);
  const light = adjustColor(base, 58);
  group.appendChild(el("circle", {
    cx: node.x,
    cy: node.y,
    r: node.r,
    fill: light,
    opacity: 0.9,
    stroke: node.d === state.selected ? "#182022" : dark,
    "stroke-width": node.d === state.selected ? 3 : 1.5,
  }));
  group.appendChild(el("circle", {
    cx: node.x,
    cy: node.y,
    r: Math.max(6, node.r - 5),
    fill: base,
    opacity: 0.88,
    stroke: "#ffffff",
    "stroke-width": 1.2,
  }));
  group.appendChild(el("text", {
    x: node.x,
    y: node.y + 4,
    "text-anchor": "middle",
    fill: "#ffffff",
    "font-size": Math.max(9, Math.min(12, node.r * 0.48)),
    "font-weight": 800,
  }, companyInitial(node.d.company)));
  return group;
}

function relativeScore(value, values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 50;
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

function adjustColor(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${clamp(Math.round(r + amount), 0, 255)}, ${clamp(Math.round(g + amount), 0, 255)}, ${clamp(Math.round(b + amount), 0, 255)})`;
}

function hexToRgb(hex) {
  if (hex.startsWith("rgb")) {
    const [r, g, b] = hex.match(/\d+/g).map(Number);
    return { r, g, b };
  }
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToCss({ r, g, b }) {
  return `rgb(${r}, ${g}, ${b})`;
}

function hashNumber(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return hash;
}

function oneLineComment(company) {
  const points = [];
  if (company.motivation_score >= 4.2) points.push("志望動機を作りやすい");
  if (company.es_material_score >= 4.2) points.push("ES素材と接続しやすい");
  if (industryAdvantageScore(company) >= 4.5) points.push("業界内優位性が高い");
  if (company.mypage_2028_status === "確認済み") points.push("28卒導線確認済み");
  if (!points.length) points.push("追加調査で相性を見極めたい");
  return points.slice(0, 2).join(" / ");
}

function personalFitScore(company, entry) {
  const baseFit =
    entry.interest_score * 0.14 +
    entry.skill_fit_score * 0.14 +
    entry.culture_fit_score * 0.13 +
    entry.location_fit_score * 0.10 +
    entry.job_fit_score * 0.13 +
    entry.major_fit_score * 0.10 +
    entry.work_style_fit_score * 0.09 +
    entry.salary_fit_score * 0.07 +
    entry.global_fit_score * 0.04 +
    entry.self_pr_strength_score * 0.06;
  const mbtiFit = mbtiSupplementFit(company);
  return round2(baseFit * 0.92 + mbtiFit * 0.08);
}

function offerLikelihoodScore(company, entry) {
  const progress = statusProgress(entry.status);
  const access = company.new_grad_access_score * 0.28;
  const fit = entry.skill_fit_score * 0.16 + entry.self_pr_strength_score * 0.16 + entry.job_fit_score * 0.11 + entry.major_fit_score * 0.07;
  const research = researchConfidence(company) * 0.14;
  const action = progress * 0.18;
  const confirmed = company.mypage_2028_status === "確認済み" ? 0.25 : 0;
  return round2(clamp(access + fit + research + action + confirmed, 1, 5));
}

function motivationBuildScore(company, entry) {
  const signals = state.applicantSignals;
  const industryHit = signals.industries.includes(company.industry) ? 0.7 : 0;
  const valueHit = overlapCount(signals.values, companyKeywords(company)) * 0.18;
  const reasonBase = avg([company.company_strength_score, company.comparison_value_score, company.disclosure_score]);
  const interest = (entry.interest_score - 3) * 0.18;
  return round2(clamp(reasonBase + industryHit + valueHit + interest, 1, 5));
}

function esMaterialFitScore(company, entry) {
  const signals = state.applicantSignals;
  const skillHit = overlapCount(signals.skills, companyKeywords(company)) * 0.22;
  const strengthHit = overlapCount(signals.strengths, companyKeywords(company)) * 0.18;
  const jobFit = entry.job_fit_score * 0.22 + entry.skill_fit_score * 0.22 + entry.self_pr_strength_score * 0.16;
  const industryFit = signals.industries.includes(company.industry) ? 0.45 : 0;
  return round2(clamp(jobFit + skillHit + strengthHit + industryFit, 1, 5));
}

function companyAiAnalysis(company, entry, motivation, esMaterial) {
  const reasons = [];
  const cautions = [];
  if (motivation >= 4.2) reasons.push("志望動機を作る材料が多い");
  if (esMaterial >= 4.2) reasons.push("ESで使える経験との接続が強い");
  if (company.new_grad_access_score >= 5 || company.mypage_2028_status === "確認済み") reasons.push("新卒採用導線を追いやすい");
  if (company.compensation_score >= 5) reasons.push("待遇面の比較優位がある");
  if (company.work_life_balance_score <= 2) cautions.push("働き方や負荷の確認が必要");
  if (entry.location_fit_score <= 2) cautions.push("勤務地条件とのズレに注意");
  if (state.applicantSignals.constraints.length && !conditionMatchesCompany(company)) cautions.push("希望条件との整合を追加確認");

  const nextAction = nextActionForCompany(company, entry, motivation, esMaterial);
  return {
    reasons: reasons.length ? reasons.join(" / ") : "企業研究と自己PRの接続を追加で確認",
    caution: cautions.length ? cautions.join(" / ") : "大きな懸念は未入力。根拠ソースで裏取り推奨",
    nextAction,
  };
}

function nextActionForCompany(company, entry, motivation, esMaterial) {
  if (entry.status === "未調査") return company.mypage_url ? "新卒マイページ登録と採用ページ確認" : "公式採用ページと新卒導線を確認";
  if (motivation < 3.6) return "事業・職種・自分の経験をつなぐ志望理由を1つ作る";
  if (esMaterial < 3.6) return "ESに使う経験を企業の採用人物像に合わせて選び直す";
  if (entry.status === "調査中") return "説明会・OB訪問・選考体験記で根拠を補強";
  if (entry.status === "ES準備中") return "自己PRと志望動機を企業別に調整";
  return entry.next_action || "次の締切とイベントを確認";
}

function statusProgress(status) {
  const progress = {
    "未調査": 1,
    "調査中": 2,
    "マイページ登録済み": 3,
    "イベント参加予定": 3.3,
    "ES準備中": 3.6,
    "応募済み": 4,
    "選考中": 4.3,
    "内定": 5,
    "辞退候補": 2,
    "見送り": 1,
  };
  return progress[status] || 1;
}

function getPersonalEntry(companyName) {
  return state.personalData[companyName] || defaultPersonalEntry();
}

function defaultPersonalEntry() {
  return {
    status: "未調査",
    interest_score: 3,
    skill_fit_score: 3,
    culture_fit_score: 3,
    location_fit_score: 3,
    job_fit_score: 3,
    major_fit_score: 3,
    work_style_fit_score: 3,
    salary_fit_score: 3,
    global_fit_score: 3,
    self_pr_strength_score: 3,
    next_action: "",
    next_deadline: "",
    personal_memo: "",
  };
}

function defaultApplicantProfile() {
  return {
    mbti_type: "",
    extroversion_preference_score: 3,
    change_tolerance_score: 3,
    team_orientation_score: 3,
    autonomy_preference_score: 3,
    logic_orientation_score: 3,
    planning_orientation_score: 3,
    preference_preset: "balanced",
    preferred_job_types: "",
    preferred_locations: "",
    es_draft: "",
    experience_summary: "",
    condition_summary: "",
  };
}

function loadApplicantProfile() {
  return { ...defaultApplicantProfile(), ...loadStorageMap("jobResearchApplicantProfile") };
}

function renderApplicantProfileForm() {
  const profile = state.applicantProfile;
  els.mbtiType.value = profile.mbti_type || "";
  els.presetMode.value = profile.preference_preset || state.filters.presetMode;
  els.extroversionPreference.value = profile.extroversion_preference_score;
  els.changeTolerance.value = profile.change_tolerance_score;
  els.teamOrientation.value = profile.team_orientation_score;
  els.autonomyPreference.value = profile.autonomy_preference_score;
  els.logicOrientation.value = profile.logic_orientation_score;
  els.planningOrientation.value = profile.planning_orientation_score;
  els.preferredJobTypes.value = profile.preferred_job_types;
  els.preferredLocations.value = profile.preferred_locations;
  els.esDraft.value = profile.es_draft;
  els.experienceSummary.value = profile.experience_summary;
  els.conditionSummary.value = profile.condition_summary;
}

function saveApplicantProfile() {
  state.applicantProfile = {
    mbti_type: els.mbtiType.value,
    extroversion_preference_score: Number(els.extroversionPreference.value),
    change_tolerance_score: Number(els.changeTolerance.value),
    team_orientation_score: Number(els.teamOrientation.value),
    autonomy_preference_score: Number(els.autonomyPreference.value),
    logic_orientation_score: Number(els.logicOrientation.value),
    planning_orientation_score: Number(els.planningOrientation.value),
    preference_preset: els.presetMode.value,
    preferred_job_types: els.preferredJobTypes.value.trim(),
    preferred_locations: els.preferredLocations.value.trim(),
    es_draft: els.esDraft.value.trim(),
    experience_summary: els.experienceSummary.value.trim(),
    condition_summary: els.conditionSummary.value.trim(),
  };
  state.applicantSignals = analyzeApplicantProfile(state.applicantProfile);
  localStorage.setItem("jobResearchApplicantProfile", JSON.stringify(state.applicantProfile));
}

function showProfileStatus(message) {
  els.profileStatus.textContent = message;
  showToast(message);
  window.clearTimeout(showProfileStatus.timer);
  showProfileStatus.timer = window.setTimeout(() => {
    els.profileStatus.textContent = "";
  }, 2400);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  els.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove("is-visible");
    els.toast.hidden = true;
  }, 2600);
}

function inferProfileFromMbti() {
  const type = els.mbtiType.value;
  if (!type) return;
  els.extroversionPreference.value = type[0] === "E" ? 4 : 2;
  els.changeTolerance.value = type[1] === "N" ? 4 : 3;
  els.teamOrientation.value = type[2] === "F" || type[0] === "E" ? 4 : 3;
  els.autonomyPreference.value = type[1] === "N" || type[3] === "P" ? 4 : 3;
  els.logicOrientation.value = type[2] === "T" ? 4 : 3;
  els.planningOrientation.value = type[3] === "J" ? 4 : 2;
}

function mbtiSupplementFit(company) {
  const profile = state.applicantProfile || defaultApplicantProfile();
  if (!profile.mbti_type) return 3;
  const environment = companyEnvironmentVector(company);
  const preference = {
    extroversion: profile.extroversion_preference_score,
    change: profile.change_tolerance_score,
    team: profile.team_orientation_score,
    autonomy: profile.autonomy_preference_score,
    logic: profile.logic_orientation_score,
    planning: profile.planning_orientation_score,
  };
  const closeness = Object.keys(preference).map((key) => 5 - Math.abs(preference[key] - environment[key]));
  return round2(clamp(avg(closeness), 1, 5));
}

function companyEnvironmentVector(company) {
  const isConsulting = company.industry === "コンサル";
  const isTrading = company.industry === "総合商社";
  const isFinance = company.industry === "金融";
  const isMedia = company.industry === "広告・エンタメ・メディア";
  const isConsumer = company.industry === "消費財・食品・日用品";
  return {
    extroversion: clamp(2.6 + (isConsulting || isTrading || isFinance || isMedia ? 1.2 : 0) + (isConsumer ? 0.5 : 0), 1, 5),
    change: clamp(avg([company.industry_growth_score, attackDefense(company)]) - 0.1, 1, 5),
    team: clamp(3 + (isConsulting || isTrading || isFinance ? 0.8 : 0) + (company.culture_clarity_score - 3) * 0.2, 1, 5),
    autonomy: clamp(2.6 + (company.industry_growth_score - 3) * 0.45 + (company.work_life_balance_score <= 2 ? 0.4 : 0), 1, 5),
    logic: clamp(3 + (company.industry === "IT・SI・通信" || company.industry === "電機・半導体" || isConsulting || isFinance ? 0.8 : 0), 1, 5),
    planning: clamp(2.7 + (company.stability_score - 3) * 0.45 + (company.disclosure_score - 3) * 0.25, 1, 5),
  };
}

function renderPersonalForm(company) {
  const entry = getPersonalEntry(company.company);
  els.applicationStatus.value = entry.status;
  els.nextAction.value = entry.next_action;
  els.nextDeadline.value = entry.next_deadline;
  els.personalMemo.value = entry.personal_memo;
}

function saveSelectedPersonalData() {
  if (!state.selected) return;
  const current = getPersonalEntry(state.selected.company);
  state.personalData[state.selected.company] = {
    ...current,
    status: els.applicationStatus.value,
    next_action: els.nextAction.value,
    next_deadline: els.nextDeadline.value,
    personal_memo: els.personalMemo.value,
  };
  localStorage.setItem("jobResearchPersonalData", JSON.stringify(state.personalData));
  showToast(`${state.selected.company}の応募状況を保存しました`);
}

function loadPersonalData() {
  return loadStorageMap("jobResearchPersonalData");
}

function loadStorageMap(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function setDetailTab(tabName) {
  const panels = {
    application: els.tabApplication,
    events: els.tabEvents,
    sources: els.tabSources,
  };
  for (const [name, panel] of Object.entries(panels)) {
    panel.hidden = name !== tabName;
  }
  els.detailTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });
}

function renderAiInsights(company) {
  els.aiInsightList.innerHTML = `
    <div class="mini-item">
      <strong>一致理由</strong>
      <small>${company.matching_reasons}</small>
    </div>
    <div class="mini-item">
      <strong>注意点</strong>
      <small>${company.caution_summary}</small>
    </div>
    <div class="mini-item">
      <strong>推奨次アクション</strong>
      <small>${company.recommended_next_action}</small>
    </div>
    <div class="mini-item">
      <strong>抽出された応募者シグナル</strong>
      <small>強み: ${displayList(state.applicantSignals.strengths)} / スキル: ${displayList(state.applicantSignals.skills)}</small>
      <small>希望: ${displayList(state.applicantSignals.preferences)} / 制約: ${displayList(state.applicantSignals.constraints)}</small>
    </div>
  `;
}

function renderRecommendations(data) {
  const rows = [...data].sort((a, b) => b.personal_score - a.personal_score || b.offer_score - a.offer_score).slice(0, 8);
  els.recommendationList.innerHTML = rows.map((company, index) => `
    <button class="recommendation-item" type="button" data-company="${escapeAttr(company.company)}">
      <strong><span>${index + 1}. ${company.company}</span><span>${company.personal_score.toFixed(2)}</span></strong>
      <small>${company.industry} / 内定しやすさ ${company.offer_score.toFixed(2)} / 相性 ${company.fit_score.toFixed(2)}</small>
      <small>${company.recommended_next_action}</small>
    </button>
  `).join("");
  els.recommendationList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectCompany(state.companies.find((company) => company.company === button.dataset.company));
    });
  });
}

function renderProfileTimeline() {
  const items = buildProfileTimelineItems();
  renderInterestedCompanies();
  const activeEntries = state.companies.filter((company) => getPersonalEntry(company.company).status !== "未調査").length;
  const upcomingEvents = items.filter((item) => item.kind === "event" && item.date && item.status !== "終了").length;
  const sourceCount = Object.values(state.sourceData).reduce((sum, sources) => sum + sources.length, 0);
  els.profileTimelineSummary.innerHTML = `
    <div><strong>${activeEntries}</strong><span>進行中企業</span></div>
    <div><strong>${upcomingEvents}</strong><span>予定・締切</span></div>
    <div><strong>${sourceCount}</strong><span>追加ソース</span></div>
  `;
  if (!items.length) {
    els.profileTimelineList.innerHTML = `
      <div class="mini-item">
        <strong>まだ登録がありません</strong>
        <small>企業詳細の応募状況、締切・イベント、根拠ソースを保存するとここに時系列で表示されます。</small>
      </div>
    `;
    return;
  }
  els.profileTimelineList.innerHTML = items.map((item) => `
    <div class="timeline-item" style="border-left-color:${industryColors[item.industry] || "#116d74"}">
      <button class="timeline-open" type="button" data-company="${escapeAttr(item.company)}">
        <strong><span>${item.company}</span><span class="timeline-kind">${item.label}</span></strong>
        <small>${item.industry}${item.date ? ` / ${item.date}` : ""}${item.status ? ` / ${item.status}` : ""}</small>
        <small>${item.text}</small>
      </button>
      <button class="delete-button" type="button" data-kind="${item.kind}" data-company="${escapeAttr(item.company)}" data-index="${item.index ?? ""}">削除</button>
    </div>
  `).join("");
  els.profileTimelineList.querySelectorAll(".timeline-open").forEach((button) => {
    button.addEventListener("click", () => {
      const company = state.companies.find((item) => item.company === button.dataset.company);
      if (!company) return;
      selectCompany(company);
      setView("home");
    });
  });
  els.profileTimelineList.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", () => deleteTimelineItem(button.dataset.kind, button.dataset.company, button.dataset.index));
  });
}

function renderInterestedCompanies() {
  const rows = interestedCompanyNames()
    .map((name) => state.companies.find((company) => company.company === name))
    .filter(Boolean)
    .sort((a, b) => b.personal_score - a.personal_score || b.overall_score - a.overall_score);
  if (!rows.length) {
    els.interestedCompanyList.innerHTML = `
      <div class="mini-item">
        <strong>未登録</strong>
        <small>企業詳細の「志望リスト追加」から、気になる企業だけをここに集められます。</small>
      </div>
    `;
    return;
  }
  els.interestedCompanyList.innerHTML = `
    <div class="interested-items">
      ${rows.map((company) => `
        <div class="interested-item" style="border-left-color:${industryColors[company.industry] || "#116d74"}">
          <button type="button" data-company="${escapeAttr(company.company)}">
            <strong>${company.company}</strong>
            <small>${company.industry} / あなた向け ${company.personal_score.toFixed(2)}</small>
          </button>
          <button class="delete-button" type="button" data-remove-interest="${escapeAttr(company.company)}">解除</button>
        </div>
      `).join("")}
    </div>
  `;
  els.interestedCompanyList.querySelectorAll("[data-company]").forEach((button) => {
    button.addEventListener("click", () => {
      const company = state.companies.find((item) => item.company === button.dataset.company);
      if (!company) return;
      selectCompany(company);
      setView("home");
    });
  });
  els.interestedCompanyList.querySelectorAll("[data-remove-interest]").forEach((button) => {
    button.addEventListener("click", () => {
      const company = state.companies.find((item) => item.company === button.dataset.removeInterest);
      toggleInterestedCompany(company);
    });
  });
}

function buildProfileTimelineItems() {
  const items = [];
  for (const company of state.companies) {
    const entry = getPersonalEntry(company.company);
    if (entry.status !== "未調査" || entry.next_action || entry.next_deadline || entry.personal_memo) {
      items.push({
        kind: "application",
        label: "応募状況",
        company: company.company,
        industry: company.industry,
        date: entry.next_deadline,
        status: entry.status,
        text: entry.next_action || entry.personal_memo || company.recommended_next_action || "次アクションを設定してください",
        sortDate: entry.next_deadline || "9999-99-97",
      });
    }
    for (const [index, event] of (state.eventData[company.company] || []).entries()) {
      const date = event.deadline_date || event.event_date;
      items.push({
        kind: "event",
        index,
        label: event.deadline_date ? "締切" : "イベント",
        company: company.company,
        industry: company.industry,
        date,
        status: event.status || eventStatusFromDates(event.deadline_date, event.event_date),
        text: `${event.event_type}: ${event.title}${event.notes ? ` / ${event.notes}` : ""}`,
        sortDate: date || "9999-99-98",
      });
    }
    for (const [index, source] of (state.sourceData[company.company] || []).entries()) {
      items.push({
        kind: "source",
        index,
        label: "根拠ソース",
        company: company.company,
        industry: company.industry,
        date: "",
        status: `信頼度 ${source.reliability_score}`,
        text: `${source.source_type}: ${source.title}${source.evidence_summary ? ` / ${source.evidence_summary}` : ""}`,
        sortDate: "9999-99-99",
      });
    }
  }
  return items.sort((a, b) => {
    const dateCompare = a.sortDate.localeCompare(b.sortDate);
    if (dateCompare !== 0) return dateCompare;
    return a.company.localeCompare(b.company, "ja");
  });
}

function deleteTimelineItem(kind, companyName, indexValue) {
  if (kind === "application") {
    delete state.personalData[companyName];
    localStorage.setItem("jobResearchPersonalData", JSON.stringify(state.personalData));
    showToast(`${companyName}の応募状況を削除しました`);
  } else if (kind === "event") {
    deleteStoredListItem(state.eventData, "jobResearchEventData", companyName, Number(indexValue));
    showToast(`${companyName}のイベントを削除しました`);
  } else if (kind === "source") {
    deleteStoredListItem(state.sourceData, "jobResearchSourceData", companyName, Number(indexValue));
    showToast(`${companyName}の根拠ソースを削除しました`);
  }
  renderAll();
}

function deleteStoredListItem(store, storageKey, companyName, index) {
  if (!Number.isInteger(index) || !store[companyName]) return;
  store[companyName].splice(index, 1);
  if (!store[companyName].length) delete store[companyName];
  localStorage.setItem(storageKey, JSON.stringify(store));
}

function getEvents(company) {
  const manual = (state.eventData[company.company] || []).map((event, index) => ({ ...event, manualIndex: index }));
  const auto = [];
  if (company.mypage_url) {
    auto.push({
      event_type: "新卒マイページ",
      title: "新卒マイページ",
      event_date: "",
      deadline_date: "",
      url: company.mypage_url,
      status: "受付中",
      notes: "公式確認済みのマイページ導線",
      auto: true,
    });
  }
  return [...auto, ...manual].sort((a, b) => (a.deadline_date || a.event_date || "9999-99-99").localeCompare(b.deadline_date || b.event_date || "9999-99-99"));
}

function renderEventList(company) {
  const events = getEvents(company);
  if (!events.length) {
    els.eventList.innerHTML = `<div class="mini-item"><strong>未登録</strong><small>締切や説明会が分かったら追加してください。</small></div>`;
    return;
  }
  els.eventList.innerHTML = events.map((event) => `
    <div class="mini-item">
      <strong>${event.title}</strong>
      <small>${event.event_type} / ${event.status || "未確認"}${event.deadline_date ? ` / 締切 ${event.deadline_date}` : ""}${event.event_date ? ` / 開催 ${event.event_date}` : ""}</small>
      ${event.url ? `<small><a href="${escapeAttr(event.url)}" target="_blank" rel="noreferrer">URLを開く</a></small>` : ""}
      ${event.notes ? `<small>${event.notes}</small>` : ""}
      ${event.auto ? "" : `<button class="delete-button mini-delete" type="button" data-index="${event.manualIndex}">削除</button>`}
    </div>
  `).join("");
  els.eventList.querySelectorAll(".mini-delete").forEach((button) => {
    button.addEventListener("click", () => {
      deleteStoredListItem(state.eventData, "jobResearchEventData", company.company, Number(button.dataset.index));
      showToast(`${company.company}のイベントを削除しました`);
      renderAll();
    });
  });
}

function addSelectedEvent() {
  if (!state.selected || !els.eventTitle.value.trim()) return;
  const company = state.selected.company;
  const events = state.eventData[company] || [];
  events.push({
    event_type: els.eventType.value,
    title: els.eventTitle.value.trim(),
    event_date: els.eventDate.value,
    deadline_date: els.eventDeadline.value,
    url: els.eventUrl.value.trim(),
    status: eventStatusFromDates(els.eventDeadline.value, els.eventDate.value),
    notes: els.eventNotes.value.trim(),
  });
  state.eventData[company] = events;
  localStorage.setItem("jobResearchEventData", JSON.stringify(state.eventData));
  els.eventTitle.value = "";
  els.eventDate.value = "";
  els.eventDeadline.value = "";
  els.eventUrl.value = "";
  els.eventNotes.value = "";
  showToast(`${company}にイベントを追加しました`);
}

function eventStatusFromDates(deadline, eventDate) {
  const target = deadline || eventDate;
  if (!target) return "未確認";
  const today = new Date();
  const targetDate = new Date(`${target}T00:00:00`);
  const days = Math.ceil((targetDate - today) / 86400000);
  if (days < 0) return "終了";
  if (days <= 14) return "締切間近";
  return "予定";
}

function getSources(company) {
  const imported = (state.evidenceSources[company.company] || []).map((source) => ({ ...source, imported: true }));
  const manual = (state.sourceData[company.company] || []).map((source, index) => ({ ...source, manualIndex: index }));
  if (imported.length) return [...imported, ...manual];
  return [{
    score_key: "new_grad_access_score",
    source_type: "採用ページ",
    title: company.mypage_2028_status === "確認済み" ? "新卒マイページ確認済み" : "新卒マイページ要確認",
    url: company.mypage_url,
    reliability_score: company.mypage_2028_status === "確認済み" ? 4 : 2,
    evidence_summary: company.mypage_2028_status === "確認済み" ? "公式採用導線で新卒向けページを確認。" : "現時点では公式確認待ち。",
  }, ...manual];
}

function renderSourceList(company) {
  const sources = getSources(company);
  els.sourceList.innerHTML = sources.map((source) => {
    const label = scoreKeys.find(([key]) => key === source.score_key)?.[1] || source.score_key;
    return `
      <div class="mini-item">
        <strong>${source.title}</strong>
        <small>${label} / ${source.source_type} / 信頼度 ${source.reliability_score}${source.imported ? " / DB登録済み" : ""}${source.checked_date ? ` / ${source.checked_date}` : ""}</small>
        ${source.url ? `<small><a href="${escapeAttr(source.url)}" target="_blank" rel="noreferrer">ソースを開く</a></small>` : ""}
        ${source.evidence_summary ? `<small>${source.evidence_summary}</small>` : ""}
        ${source.manualIndex === undefined ? "" : `<button class="delete-button mini-delete" type="button" data-index="${source.manualIndex}">削除</button>`}
      </div>
    `;
  }).join("");
  els.sourceList.querySelectorAll(".mini-delete").forEach((button) => {
    button.addEventListener("click", () => {
      deleteStoredListItem(state.sourceData, "jobResearchSourceData", company.company, Number(button.dataset.index));
      showToast(`${company.company}の根拠ソースを削除しました`);
      renderAll();
    });
  });
}

function addSelectedSource() {
  if (!state.selected || !els.sourceTitle.value.trim()) return;
  const company = state.selected.company;
  const sources = state.sourceData[company] || [];
  sources.push({
    score_key: els.sourceScoreKey.value,
    source_type: els.sourceType.value,
    title: els.sourceTitle.value.trim(),
    url: els.sourceUrl.value.trim(),
    reliability_score: Number(els.sourceReliability.value),
    evidence_summary: els.sourceSummary.value.trim(),
  });
  state.sourceData[company] = sources;
  localStorage.setItem("jobResearchSourceData", JSON.stringify(state.sourceData));
  els.sourceTitle.value = "";
  els.sourceUrl.value = "";
  els.sourceReliability.value = "3";
  els.sourceReliabilityLabel.textContent = "3";
  els.sourceSummary.value = "";
  showToast(`${company}に根拠ソースを追加しました`);
}

function analyzeApplicantProfile(profile) {
  const text = normalizeText([
    profile.es_draft,
    profile.experience_summary,
    profile.condition_summary,
    profile.preferred_job_types,
    profile.preferred_locations,
  ].join(" "));
  return {
    strengths: matchKeywords(text, {
      leadership: ["リーダー", "主導", "代表", "マネジメント", "巻き込み"],
      teamwork: ["チーム", "協働", "サークル", "部活", "調整"],
      analysis: ["分析", "データ", "仮説", "検証", "改善"],
      execution: ["実行", "継続", "達成", "目標", "成果"],
      creativity: ["企画", "創造", "提案", "新規", "発想"],
      global: ["英語", "海外", "留学", "グローバル", "多文化"],
    }),
    skills: matchKeywords(text, {
      it: ["プログラミング", "python", "javascript", "sql", "開発", "se", "it", "ai"],
      consulting: ["コンサル", "課題解決", "業務改善", "戦略", "資料作成"],
      sales: ["営業", "接客", "交渉", "顧客", "提案"],
      research: ["研究", "実験", "論文", "解析", "技術"],
      finance: ["金融", "会計", "簿記", "投資", "統計"],
      marketing: ["マーケ", "広告", "sns", "ブランド", "市場調査"],
    }),
    preferences: matchKeywords(text, {
      highPay: ["高年収", "待遇", "給与", "報酬"],
      stability: ["安定", "大手", "長く", "福利厚生"],
      growth: ["成長", "裁量", "若手", "挑戦", "スピード"],
      workLife: ["ワークライフ", "残業", "リモート", "休み", "柔軟"],
      global: ["海外", "英語", "グローバル"],
    }),
    constraints: matchKeywords(text, {
      location: ["勤務地", "東京", "関西", "地元", "転勤不可", "転勤なし"],
      remote: ["リモート", "在宅"],
      lowOvertime: ["残業少", "ワークライフ", "休日"],
      salary: ["希望年収", "給与", "待遇"],
    }),
    industries: inferPreferredIndustries(text),
  };
}

function companyKeywords(company) {
  const keywords = [];
  const industryMap = {
    "IT・SI・通信": ["it", "analysis", "research", "growth"],
    "コンサル": ["consulting", "analysis", "leadership", "growth"],
    "総合商社": ["global", "sales", "leadership", "growth"],
    "金融": ["finance", "sales", "analysis", "stability"],
    "自動車・機械・精密": ["research", "analysis", "execution", "stability"],
    "電機・半導体": ["it", "research", "analysis", "growth"],
    "消費財・食品・日用品": ["marketing", "creativity", "sales", "stability"],
    "製薬・ヘルスケア": ["research", "analysis", "stability"],
    "広告・エンタメ・メディア": ["marketing", "creativity", "teamwork", "growth"],
    "不動産・インフラ": ["sales", "stability", "execution", "teamwork"],
  };
  keywords.push(...(industryMap[company.industry] || []));
  if (company.compensation_score >= 5) keywords.push("highPay");
  if (company.work_life_balance_score >= 4) keywords.push("workLife");
  if (company.industry_growth_score >= 5) keywords.push("growth");
  return keywords;
}

function inferPreferredIndustries(text) {
  const entries = {
    "IT・SI・通信": ["it", "se", "通信", "クラウド", "ai", "dx"],
    "コンサル": ["コンサル", "課題解決", "戦略"],
    "総合商社": ["商社", "海外", "事業投資"],
    "金融": ["金融", "銀行", "証券", "保険"],
    "自動車・機械・精密": ["自動車", "機械", "メーカー", "ものづくり"],
    "電機・半導体": ["半導体", "電機", "電子", "デバイス"],
    "消費財・食品・日用品": ["食品", "消費財", "日用品", "化粧品"],
    "製薬・ヘルスケア": ["製薬", "医療", "ヘルスケア", "薬"],
    "広告・エンタメ・メディア": ["広告", "メディア", "エンタメ", "ゲーム"],
    "不動産・インフラ": ["不動産", "インフラ", "鉄道", "電力", "ガス"],
  };
  return Object.entries(entries)
    .filter(([, words]) => words.some((word) => text.includes(word.toLowerCase())))
    .map(([industry]) => industry);
}

function matchKeywords(text, dictionary) {
  return Object.entries(dictionary)
    .filter(([, words]) => words.some((word) => text.includes(word.toLowerCase())))
    .map(([key]) => key);
}

function normalizeText(text) {
  return String(text || "").toLowerCase();
}

function normalizeUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "#";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function overlapCount(a, b) {
  const set = new Set(a);
  return b.filter((value) => set.has(value)).length;
}

function conditionMatchesCompany(company) {
  const constraints = state.applicantSignals.constraints;
  if (constraints.includes("lowOvertime") && company.work_life_balance_score <= 2) return false;
  if (constraints.includes("salary") && company.compensation_score <= 3) return false;
  return true;
}

function displayList(values) {
  return values.length ? values.join(", ") : "未抽出";
}

function groupByCompany(rows) {
  return rows.reduce((acc, row) => {
    if (!row.company) return acc;
    if (!acc[row.company]) acc[row.company] = [];
    acc[row.company].push(row);
    return acc;
  }, {});
}

function exportPersonalDataCsv() {
  const rows = [[
    "mbti_type",
    "extroversion_preference_score",
    "change_tolerance_score",
    "team_orientation_score",
    "autonomy_preference_score",
    "logic_orientation_score",
    "planning_orientation_score",
    "company",
    "status",
    "interest_score",
    "skill_fit_score",
    "culture_fit_score",
    "location_fit_score",
    "job_fit_score",
    "major_fit_score",
    "work_style_fit_score",
    "salary_fit_score",
    "global_fit_score",
    "self_pr_strength_score",
    "next_action",
    "next_deadline",
    "personal_memo",
    "personal_score",
    "offer_score",
    "fit_score",
  ]];
  for (const company of state.companies) {
    const entry = getPersonalEntry(company.company);
    if (!state.personalData[company.company]) continue;
    const profile = state.applicantProfile;
    rows.push([
      profile.mbti_type,
      profile.extroversion_preference_score,
      profile.change_tolerance_score,
      profile.team_orientation_score,
      profile.autonomy_preference_score,
      profile.logic_orientation_score,
      profile.planning_orientation_score,
      company.company,
      entry.status,
      entry.interest_score,
      entry.skill_fit_score,
      entry.culture_fit_score,
      entry.location_fit_score,
      entry.job_fit_score,
      entry.major_fit_score,
      entry.work_style_fit_score,
      entry.salary_fit_score,
      entry.global_fit_score,
      entry.self_pr_strength_score,
      entry.next_action,
      entry.next_deadline,
      entry.personal_memo,
      company.personal_score.toFixed(2),
      company.offer_score.toFixed(2),
      company.fit_score.toFixed(2),
    ]);
  }
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "personal_job_research.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function companyTooltip(d) {
  return `<strong>${d.company}</strong><br>${oneLineComment(d)}<br>業界内優位 ${industryAdvantageScore(d).toFixed(2)} / あなた向け ${d.personal_score.toFixed(2)}<br>横: 安定性←→成長性 / 縦: 働きやすさ←→キャリア資本<br>${d.mypage_2028_status} / ${getPersonalEntry(d.company).status}`;
}

function showTooltip(event, html) {
  els.tooltip.innerHTML = html;
  els.tooltip.hidden = false;
  const x = Math.min(event.clientX + 14, window.innerWidth - 300);
  const y = Math.min(event.clientY + 14, window.innerHeight - 120);
  els.tooltip.style.left = `${x}px`;
  els.tooltip.style.top = `${y}px`;
}

function hideTooltip() {
  els.tooltip.hidden = true;
}

function industrySummaries(companies) {
  return [...groupBy(companies, (d) => d.industry)].map(([industry, items]) => {
    const avgScore = avg(items.map((d) => d.overall_score));
    const confirmed = items.filter((d) => d.mypage_2028_status === "確認済み").length;
    const growth = avg(items.map((d) => d.industry_growth_score));
    const stability = avg(items.map((d) => d.stability_score));
    const status = industryStatus(avgScore, growth, stability);
    return {
      industry,
      count: items.length,
      confirmed,
      avg: avgScore,
      status: status.label,
      statusClass: status.className,
    };
  }).sort((a, b) => b.avg - a.avg);
}

function industryStatus(avgScore, growth, stability) {
  if (avgScore >= 4.25) return { label: "優位", className: "status-strong" };
  if (growth >= 4.5) return { label: "成長", className: "status-growth" };
  if (stability >= 4.5) return { label: "安定", className: "status-stable" };
  return { label: "要精査", className: "status-watch" };
}

function contactReadiness(d) {
  const confirmedBonus = d.mypage_2028_status === "確認済み" ? 0.28 : -0.1;
  return clamp(avg([d.new_grad_access_score, d.disclosure_score, d.culture_clarity_score]) + confirmedBonus, 3, 5);
}

function returnExpectation(d) {
  const reward = avg([d.compensation_score, d.career_capital_score, d.transferability_score, d.company_strength_score]);
  const growthLift = (d.industry_growth_score - 3) * 0.16;
  return clamp(reward + growthLift, 2, 5);
}

function attackDefense(d) {
  const attack = avg([d.industry_growth_score, d.company_strength_score, d.career_capital_score]);
  const defense = avg([d.stability_score, d.work_life_balance_score]);
  return clamp(3 + (attack - defense) * 0.95, 1.8, 4.8);
}

function researchConfidence(d) {
  const confirmedBonus = d.mypage_2028_status === "確認済み" ? 0.22 : 0;
  return clamp(avg([d.disclosure_score, d.culture_clarity_score, d.new_grad_access_score]) + confirmedBonus, 3, 5);
}

function advantageSharpness(d) {
  return clamp(avg([d.company_strength_score, d.compensation_score, d.comparison_value_score, d.overall_score]) - 0.05, 3, 5);
}

function companyStatus(d) {
  if (d.overall_score >= 4.4) return "最優先候補";
  if (d.overall_score >= 4.1) return "優先比較候補";
  if (d.mypage_2028_status === "確認済み") return "早期接触候補";
  return "比較候補";
}

function averageVector(items) {
  return Object.fromEntries(scoreKeys.map(([key]) => [key, avg(items.map((d) => d[key]))]));
}

function pairDistances(items) {
  const pairs = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      pairs.push({
        a: items[i].industry,
        b: items[j].industry,
        distance: vectorDistance(items[i].vector, items[j].vector),
      });
    }
  }
  return pairs;
}

function vectorDistance(a, b) {
  return Math.sqrt(scoreKeys.reduce((sum, [key]) => sum + (a[key] - b[key]) ** 2, 0));
}

function labelCandidates(nodes) {
  return [...nodes]
    .sort((a, b) => b.d.overall_score - a.d.overall_score)
    .slice(0, Math.min(14, nodes.length));
}

function unique(values) {
  return [...new Set(values)];
}

function groupBy(items, getKey) {
  const map = new Map();
  for (const item of items) {
    const key = getKey(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

function avg(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scale(min, max, outMin, outMax) {
  return (value) => {
    if (max === min) return (outMin + outMax) / 2;
    return outMin + ((value - min) / (max - min)) * (outMax - outMin);
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function makeTicks(min, max) {
  const ticks = [];
  const step = (max - min) / 4;
  for (let i = 0; i <= 4; i += 1) ticks.push(min + step * i);
  return ticks;
}

function formatTick(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function hashPoint(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return {
    x: ((hash % 200) / 100) - 1,
    y: (((hash >> 8) % 200) / 100) - 1,
  };
}

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function el(name, attrs = {}, text = "") {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text) node.textContent = text;
  return node;
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function debounce(fn, delay) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

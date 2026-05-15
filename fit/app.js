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

const questions = [
  { text: "仕事では、安定した仕組みより変化の大きい環境に惹かれる", axis: "change", left: "安定がいい", right: "変化がいい" },
  { text: "細かく教わるより、自分で考えて進める方が力を出しやすい", axis: "autonomy", left: "伴走がほしい", right: "裁量がほしい" },
  { text: "人の感情より、構造や論理で整理する方が得意", axis: "logic", left: "感情を重視", right: "論理を重視" },
  { text: "予定通り進めるより、状況に合わせて動く方が自然", axis: "planning", left: "計画型", right: "柔軟型", reverse: true },
  { text: "若いうちから負荷が高くても、成長できるなら挑戦したい", axis: "growth", left: "無理なく成長", right: "負荷も歓迎" },
  { text: "給与や待遇は、企業選びでかなり重要だ", axis: "salary", left: "そこそこ", right: "かなり重要" },
  { text: "長く安心して働ける会社への魅力が強い", axis: "stability", left: "成長優先", right: "安定優先" },
  { text: "ワークライフバランスは、入社後の満足度を大きく左右する", axis: "workLife", left: "成長優先", right: "WLB重視" },
  { text: "専門性を深めるより、幅広い経験でキャリアを作りたい", axis: "generalist", left: "専門性", right: "幅広さ" },
  { text: "数字、データ、技術、仕組みに触れる仕事に惹かれる", axis: "technical", left: "人や企画", right: "技術やデータ" },
  { text: "社会的な信頼性や公共性のある企業に惹かれる", axis: "stability", left: "新しさ重視", right: "信頼性重視" },
  { text: "ブランドや生活者に近い商品・サービスに関わりたい", axis: "consumer", left: "BtoB寄り", right: "生活者寄り" },
  { text: "グローバル、投資、事業づくりのような大きなテーマに惹かれる", axis: "global", left: "国内・現場", right: "大きな事業" },
  { text: "就活では、選考難度が高くても納得できる会社を狙いたい", axis: "ambition", left: "現実重視", right: "挑戦重視" },
  { text: "社風や働き方の情報が少ない会社は不安になる", axis: "disclosure", left: "気にしない", right: "情報重視" },
  { text: "転職市場でも評価される経験を積みたい", axis: "career", left: "社内で成長", right: "市場価値重視" },
  { text: "個人プレーより、チームで成果を出す方が好きだ", axis: "team", left: "個人で突破", right: "チーム重視" },
  { text: "ESでは、自分の経験を企業の強みと結びつけて語れる方だ", axis: "story", left: "まだ苦手", right: "得意" },
  { text: "ルールが明確な環境より、曖昧でも自分で道を作る環境が好き", axis: "autonomy", left: "明確さ重視", right: "自走重視" },
  { text: "人気企業かどうかより、自分の伸び方に合うかを重視したい", axis: "selfFit", left: "人気も重要", right: "相性重視" },
];

const typeProfiles = [
  {
    id: "growth",
    name: "Growth Strategist",
    label: "成長戦略タイプ",
    tagline: "変化を読む、構造化する、自走して成果に変える人。",
    lead: "裁量、成長速度、論理性のある環境で伸びるタイプ。難度の高いテーマでも、自分で構造化しながら前に進むほど強みが出ます。",
    flow: ["違和感を見つける", "構造に分解する", "仮説で動く", "成果から学び直す"],
    match: { change: 4.5, autonomy: 4.5, logic: 4.2, growth: 4.7, career: 4.5, stability: 2.4, workLife: 2.6 },
    fit: ["裁量が大きく、若手にも任せる環境", "変化の速い市場や新規性のあるテーマ", "論理、データ、仮説検証で評価される仕事"],
    risk: ["意思決定が遅く、役割が固定的な組織", "年功序列が強く挑戦機会が少ない環境", "曖昧な評価で成長実感を得にくい職場"],
    strengths: ["課題を構造化して解決に向かう力", "変化を前向きに捉えて学び続ける姿勢", "難度の高いテーマにも自走して取り組める点"],
    stuck: ["目的が曖昧なまま作業だけ任される", "挑戦より調整が中心になる", "失敗から学ぶ余白がない"],
    script: "私は、変化のある状況でも課題を構造化し、仮説を立てて行動に移すことで成果につなげるタイプです。未経験のテーマでも学びながら前進できる点を強みとして活かしたいです。",
  },
  {
    id: "stable",
    name: "Stable Builder",
    label: "安定構築タイプ",
    tagline: "信頼を積み上げ、仕組みを整え、長く強い成果を作る人。",
    lead: "信頼性、計画性、長期的な成長がある環境で力を発揮するタイプ。仕組みを丁寧に理解し、堅実に成果を積み上げます。",
    flow: ["全体像を掴む", "手順を整える", "確実に積み上げる", "周囲から信頼を得る"],
    match: { stability: 4.8, planning: 4.5, workLife: 4.2, disclosure: 4.2, team: 4.0, change: 2.4, autonomy: 2.8 },
    fit: ["制度や育成が整った大手企業", "社会インフラ性や公共性のある仕事", "チームで長期的に成果を積み上げる環境"],
    risk: ["変化が激しく常に方針が変わる環境", "自走前提で育成が薄い組織", "長時間労働や属人的な働き方"],
    strengths: ["継続的に信頼を積み上げる力", "計画的に物事を進める安定感", "周囲と協調しながら成果を出せる点"],
    stuck: ["方針が頻繁に変わり優先順位が定まらない", "育成や基準がなく手探りが続く", "短期成果だけで評価される"],
    script: "私は、目標に対して必要な手順を整理し、周囲と信頼関係を築きながら着実に成果を積み上げることが得意です。長期的に価値を出せる環境で強みを発揮したいです。",
  },
  {
    id: "market",
    name: "Market Creator",
    label: "市場創造タイプ",
    tagline: "人の気持ちを読み、価値に変え、周囲を巻き込む人。",
    lead: "生活者、ブランド、企画、コミュニケーションに近い環境で伸びるタイプ。人の気持ちや市場の動きを捉えて価値に変える力があります。",
    flow: ["相手の本音を掴む", "価値を言語化する", "人を巻き込む", "体験として届ける"],
    match: { consumer: 4.8, team: 4.3, story: 4.4, generalist: 4.2, culture: 4.2, logic: 3.0, technical: 2.7 },
    fit: ["消費者や顧客に近い商品・サービス", "企画、マーケティング、営業、ブランドに関わる仕事", "人を巻き込みながら形にする環境"],
    risk: ["技術や数値だけで評価される環境", "顧客や市場との距離が遠い仕事", "個人で淡々と進める時間が長い職場"],
    strengths: ["相手視点で価値を考える力", "経験をストーリーとして伝える力", "周囲を巻き込みながら前に進める点"],
    stuck: ["ユーザーや顧客の反応が見えない", "一人で完結する作業が長く続く", "数字や仕様だけで価値判断される"],
    script: "私は、相手の立場や感情を捉え、価値を分かりやすく言語化して周囲を巻き込むことが得意です。顧客や生活者に近いところで、納得感のある価値づくりに関わりたいです。",
  },
  {
    id: "expert",
    name: "Technical Expert",
    label: "専門深化タイプ",
    tagline: "深く理解し、磨き続け、専門性で突破する人。",
    lead: "技術、データ、専門性を深める環境で伸びるタイプ。複雑なものを理解し、専門性を武器に価値を出していきます。",
    flow: ["複雑さに向き合う", "原理を理解する", "手を動かして磨く", "専門性で貢献する"],
    match: { technical: 4.8, logic: 4.7, career: 4.2, planning: 4.0, autonomy: 3.8, consumer: 2.6, global: 3.1 },
    fit: ["技術、研究、データ、プロダクトに近い仕事", "専門性が評価される職種別採用", "長期的にスキルを積み上げられる環境"],
    risk: ["配属幅が広すぎて専門性が定まりにくい環境", "営業・調整中心で技術に触れにくい仕事", "学習支援や育成が薄い職場"],
    strengths: ["複雑な課題を粘り強く理解する力", "専門性を継続的に磨ける姿勢", "論理的に説明し改善できる点"],
    stuck: ["専門性より配属運に左右される", "深く考える前に調整業務で埋まる", "学習や検証の時間が取れない"],
    script: "私は、複雑なテーマを粘り強く理解し、専門性を積み上げながら価値を出すことに強みがあります。技術やデータをもとに、再現性のある改善に貢献したいです。",
  },
  {
    id: "global",
    name: "Global Producer",
    label: "事業推進タイプ",
    tagline: "大きく捉え、人と資源を動かし、事業を前に進める人。",
    lead: "大きな事業、グローバル、投資、組織横断のテーマで伸びるタイプ。広い視点で機会を見つけ、人と資源を動かす仕事に向きます。",
    flow: ["大局を見る", "機会を見つける", "関係者をつなぐ", "事業を動かす"],
    match: { global: 4.8, generalist: 4.5, ambition: 4.5, team: 4.2, salary: 4.0, stability: 3.5, workLife: 2.7 },
    fit: ["商社、金融、インフラ、大規模事業会社", "海外、投資、法人営業、事業開発に近い仕事", "多様な関係者を動かす環境"],
    risk: ["狭い専門領域に閉じる仕事", "変化や異動が少なすぎる環境", "個人作業が中心で外部接点が少ない職場"],
    strengths: ["大きな目的から逆算して動く力", "関係者を巻き込む推進力", "未知の環境でも学びながら適応する点"],
    stuck: ["担当範囲が狭く全体像が見えない", "人や組織を動かす機会が少ない", "国内・単一業務だけで完結する"],
    script: "私は、全体像から目的を捉え、関係者を巻き込みながら物事を前に進めることにやりがいを感じます。大きな事業や多様な人が関わる環境で強みを発揮したいです。",
  },
  {
    id: "culture",
    name: "Culture Connector",
    label: "組織調整タイプ",
    tagline: "人と人をつなぎ、場を整え、チームの成果を底上げする人。",
    lead: "チーム、社風、育成、人との信頼関係がある環境で伸びるタイプ。対立や曖昧さをほどき、周囲が動きやすい状態を作れます。",
    flow: ["状況を受け止める", "関係性を整える", "役割をつなぐ", "チームで成果にする"],
    match: { team: 4.8, culture: 4.7, disclosure: 4.1, planning: 3.9, workLife: 4.0, autonomy: 2.8, ambition: 2.9 },
    fit: ["チームで成果を出す大手事業会社", "人事、営業企画、カスタマーサクセス、管理部門", "育成や社風が見えやすい環境"],
    risk: ["個人の競争色が強すぎる組織", "人間関係や評価基準が見えにくい職場", "短期成果だけで動く環境"],
    strengths: ["相手の状況を汲み取り調整する力", "周囲を安心させながら前進させる姿勢", "チーム全体の成果に目を向けられる点"],
    stuck: ["個人プレーだけが評価される", "関係者が分断されている", "心理的安全性が低い"],
    script: "私は、周囲の状況を丁寧に捉え、関係者が動きやすい状態を作ることに強みがあります。チームで成果を出す環境で、組織全体の前進に貢献したいです。",
  },
  {
    id: "creative",
    name: "Creative Planner",
    label: "企画表現タイプ",
    tagline: "違和感を拾い、言葉と体験に変え、人の心を動かす人。",
    lead: "企画、表現、ブランド、メディアに近い環境で伸びるタイプ。人の感情や空気を読み取り、魅力的なストーリーに変える力があります。",
    flow: ["空気を読む", "切り口を見つける", "表現に落とす", "反応を見て磨く"],
    match: { consumer: 4.7, story: 4.8, change: 4.0, autonomy: 3.9, team: 3.8, technical: 2.3, planning: 2.8 },
    fit: ["広告、メディア、エンタメ、消費財の企画職", "ブランドやコミュニケーションに関わる仕事", "アイデアを形にしやすい環境"],
    risk: ["手順や承認が重く自由度が低い環境", "数字や仕様だけで判断される仕事", "表現より運用が中心の職場"],
    strengths: ["人の気持ちを言語化する力", "魅力的な切り口を見つける発想力", "経験を伝わるストーリーにできる点"],
    stuck: ["表現の余地がほとんどない", "正解が固定されすぎている", "反応やフィードバックが見えない"],
    script: "私は、人の感情や場の空気を捉え、伝わる言葉や企画に変えることが得意です。生活者や顧客の反応に近い場所で、心が動く価値づくりに関わりたいです。",
  },
  {
    id: "impact",
    name: "Social Impact Builder",
    label: "社会貢献タイプ",
    tagline: "社会の必要性を見つめ、信頼される仕組みを育てる人。",
    lead: "公共性、社会課題、長期的な価値に関心が強いタイプ。派手さよりも、誰かの生活や社会基盤を支える実感が力になります。",
    flow: ["課題の背景を知る", "必要な人を考える", "仕組みに落とす", "長く支える"],
    match: { stability: 4.6, disclosure: 4.4, team: 4.1, workLife: 4.0, planning: 4.2, salary: 2.8, ambition: 2.8 },
    fit: ["インフラ、金融、ヘルスケア、公共性の高い事業", "社会課題や生活基盤に関わる仕事", "長期視点で信頼を積み上げる環境"],
    risk: ["短期的な売上や競争だけが重視される環境", "事業の社会的意義が見えにくい仕事", "方針が頻繁に変わる職場"],
    strengths: ["社会や顧客への責任感", "長期的に価値を支える粘り強さ", "信頼性を大切にして行動できる点"],
    stuck: ["仕事の意義が見えない", "短期利益だけで判断される", "顧客や社会との接点が薄い"],
    script: "私は、仕事を通じて社会や生活を支える実感を大切にしています。長期的に信頼される仕組みづくりに関わり、必要とされ続ける価値を届けたいです。",
  },
  {
    id: "reward",
    name: "High Reward Challenger",
    label: "高報酬挑戦タイプ",
    tagline: "高い基準に挑み、成果で評価を取りにいく人。",
    lead: "競争環境、明確な成果評価、高待遇に惹かれるタイプ。負荷があっても、成長と報酬が結びつく環境でエネルギーが出ます。",
    flow: ["高い目標を置く", "勝ち筋を探す", "行動量を上げる", "成果で示す"],
    match: { salary: 4.9, ambition: 4.8, growth: 4.5, career: 4.5, autonomy: 4.0, workLife: 2.1, stability: 2.7 },
    fit: ["外資、コンサル、金融、商社、成長企業", "成果が報酬や機会に反映される仕事", "選考難度が高く市場価値も上がりやすい環境"],
    risk: ["評価基準が曖昧で報われにくい組織", "挑戦機会が少なく横並びの環境", "給与より年功が重視される職場"],
    strengths: ["高い目標に向かう推進力", "負荷を成長機会として捉える姿勢", "成果にこだわって行動できる点"],
    stuck: ["頑張りが評価や報酬に反映されない", "目標が低く刺激が少ない", "横並びで差がつきにくい"],
    script: "私は、高い目標に対して行動量と改善を重ね、成果で価値を示すことにやりがいを感じます。厳しい環境でも成長と評価が結びつく場所で挑戦したいです。",
  },
  {
    id: "craft",
    name: "Craft Specialist",
    label: "職人専門タイプ",
    tagline: "一つの領域を磨き、品質と再現性で信頼を作る人。",
    lead: "専門性、品質、継続的な改善に強いタイプ。大きな変化よりも、目の前の技術や仕事を深く磨くほど価値が出ます。",
    flow: ["基礎を固める", "細部を観察する", "反復して磨く", "品質で信頼される"],
    match: { technical: 4.5, planning: 4.6, stability: 4.0, logic: 4.4, autonomy: 3.1, generalist: 2.0, change: 2.5 },
    fit: ["メーカー、研究開発、品質管理、専門職", "技術や業務知識を深められる職種", "長期的にスキルを磨ける環境"],
    risk: ["異動が多く専門性が積み上がらない環境", "スピードだけで品質が軽視される職場", "広く浅い経験ばかり求められる仕事"],
    strengths: ["細部まで丁寧に詰める力", "専門性を継続して磨く粘り強さ", "品質や再現性にこだわれる点"],
    stuck: ["短期で役割が変わり続ける", "品質より勢いが評価される", "深く学ぶ時間が取れない"],
    script: "私は、一つの領域を深く理解し、品質や再現性を高めることで価値を出すことに強みがあります。専門性を着実に磨ける環境で信頼される成果を出したいです。",
  },
  {
    id: "lifestyle",
    name: "Life Design Optimizer",
    label: "働き方重視タイプ",
    tagline: "無理なく続けられる働き方で、安定して価値を出す人。",
    lead: "働きやすさ、制度、生活とのバランスを重視するタイプ。長く健康的に働ける環境でこそ、集中力と継続力が活きます。",
    flow: ["生活軸を整える", "無理のない計画を立てる", "継続して成果を出す", "余白から学ぶ"],
    match: { workLife: 4.9, stability: 4.3, disclosure: 4.5, planning: 4.1, team: 3.8, growth: 2.5, ambition: 2.2 },
    fit: ["制度や働き方の情報開示がある企業", "勤務地や勤務時間の納得感が高い仕事", "継続的に成長できる落ち着いた環境"],
    risk: ["長時間労働が常態化している職場", "配属や勤務地の不確実性が高い環境", "負荷の高さを美徳にしすぎる組織"],
    strengths: ["継続的に成果を出す自己管理力", "無理のない計画を立てる現実感", "生活と仕事を両立して成長できる点"],
    stuck: ["働き方の見通しが立たない", "忙しさで学習や生活が崩れる", "制度があっても使いにくい"],
    script: "私は、安定して力を発揮できる働き方を大切にしながら、継続的に成果を積み上げることが得意です。長く価値を出せる環境で着実に成長したいです。",
  },
  {
    id: "discoverer",
    name: "Career Explorer",
    label: "探索成長タイプ",
    tagline: "まず動き、経験から自分の軸を見つけていく人。",
    lead: "幅広い経験、配属の広がり、試行錯誤の余地がある環境で伸びるタイプ。最初から一つに絞るより、経験を通じて得意を見つける方が自然です。",
    flow: ["まず試す", "違いを比べる", "得意を見つける", "軸に育てる"],
    match: { generalist: 4.8, change: 4.1, selfFit: 4.7, autonomy: 3.7, growth: 3.8, technical: 2.9, stability: 3.0 },
    fit: ["ジョブローテーションや配属幅のある大手企業", "複数職種を経験できる総合職", "自分の軸を育てながら選べる環境"],
    risk: ["入社時点で専門性を固定される職場", "異動や挑戦の選択肢が少ない環境", "自分で振り返る余白がない仕事"],
    strengths: ["未知の経験から学ぶ柔軟性", "複数の観点を比べて考える力", "自分の適性を更新し続けられる点"],
    stuck: ["選択肢が狭く固定される", "経験の意味づけをする時間がない", "早期に専門を決めきる必要がある"],
    script: "私は、幅広い経験から学び、自分の強みや軸を更新していくことに前向きです。多様な仕事に触れながら、将来的に大きく価値を出せる領域を見つけたいです。",
  },
];

const industryVectors = {
  "IT・SI・通信": { change: 4.2, autonomy: 3.7, logic: 4.4, growth: 4.5, career: 4.5, technical: 4.4, stability: 3.7 },
  "コンサル": { change: 4.7, autonomy: 4.2, logic: 4.5, growth: 4.8, career: 4.8, ambition: 4.6, workLife: 2.2 },
  "総合商社": { global: 4.8, salary: 4.6, ambition: 4.7, generalist: 4.6, team: 4.4, stability: 4.2 },
  "金融": { stability: 4.5, planning: 4.2, team: 4.0, disclosure: 4.1, salary: 4.0, logic: 3.8 },
  "自動車・機械・精密": { technical: 4.2, stability: 4.0, planning: 4.0, global: 3.9, career: 3.8, logic: 4.0 },
  "電機・半導体": { technical: 4.7, growth: 4.5, logic: 4.4, career: 4.1, change: 4.0, planning: 3.7 },
  "消費財・食品・日用品": { consumer: 4.8, story: 4.3, team: 4.0, stability: 4.0, workLife: 3.8, generalist: 3.8 },
  "製薬・ヘルスケア": { technical: 4.1, stability: 4.2, planning: 4.1, salary: 4.1, disclosure: 4.0, growth: 3.8 },
  "広告・エンタメ・メディア": { consumer: 4.7, story: 4.7, change: 4.4, autonomy: 4.0, team: 4.2, workLife: 2.8 },
  "不動産・インフラ": { stability: 4.6, planning: 4.2, global: 3.7, team: 4.0, salary: 4.0, disclosure: 3.8 },
};

const state = {
  answers: {},
  companies: [],
  targets: {},
  scores: {},
  result: null,
};

const els = {
  startDiagnosis: document.querySelector("#startDiagnosis"),
  showSample: document.querySelector("#showSample"),
  diagnosisPanel: document.querySelector("#diagnosisPanel"),
  questionList: document.querySelector("#questionList"),
  progressText: document.querySelector("#progressText"),
  progressBar: document.querySelector("#progressBar"),
  resetAnswers: document.querySelector("#resetAnswers"),
  calculateResult: document.querySelector("#calculateResult"),
  resultPanel: document.querySelector("#resultPanel"),
  typeName: document.querySelector("#typeName"),
  typeTagline: document.querySelector("#typeTagline"),
  typeLead: document.querySelector("#typeLead"),
  fitScore: document.querySelector("#fitScore"),
  growthFlow: document.querySelector("#growthFlow"),
  fitEnvironment: document.querySelector("#fitEnvironment"),
  riskEnvironment: document.querySelector("#riskEnvironment"),
  esStrengths: document.querySelector("#esStrengths"),
  stuckPoints: document.querySelector("#stuckPoints"),
  interviewScript: document.querySelector("#interviewScript"),
  industryFitList: document.querySelector("#industryFitList"),
  companyList: document.querySelector("#companyList"),
  saveToPlanner: document.querySelector("#saveToPlanner"),
  shareType: document.querySelector("#shareType"),
  shareSummary: document.querySelector("#shareSummary"),
  copyResult: document.querySelector("#copyResult"),
  toast: document.querySelector("#toast"),
};

init();

async function init() {
  const [scores, targets] = await Promise.all([
    loadCsv("../data/target_company_scores_initial.csv"),
    loadCsv("../data/target_companies_100.csv"),
  ]);
  const targetMap = new Map(targets.map((d) => [d.company, d]));
  state.companies = scores.map((row) => {
    const target = targetMap.get(row.company) || {};
    const item = { ...target, ...row };
    for (const [key] of scoreKeys) item[key] = Number(item[key]);
    item.overall_score = Number(item.overall_score);
    item.priority_rank = Number(item.priority_rank);
    return item;
  });
  renderQuestions();
  bindEvents();
  updateProgress();
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

function bindEvents() {
  els.startDiagnosis.addEventListener("click", () => els.diagnosisPanel.scrollIntoView({ behavior: "smooth" }));
  els.showSample.addEventListener("click", () => {
    questions.forEach((question, index) => {
      state.answers[index] = ["change", "growth", "autonomy", "logic", "career", "selfFit"].includes(question.axis) ? 5 : 3;
    });
    calculateAndRender();
  });
  els.resetAnswers.addEventListener("click", () => {
    state.answers = {};
    renderQuestions();
    updateProgress();
  });
  els.calculateResult.addEventListener("click", calculateAndRender);
  els.copyResult.addEventListener("click", copyResultText);
  els.saveToPlanner.addEventListener("click", saveToPlanner);
}

function renderQuestions() {
  els.questionList.innerHTML = questions.map((question, index) => `
    <article class="question-card">
      <strong>${index + 1}. ${question.text}</strong>
      <div class="choice-row">
        <button type="button" data-index="${index}" data-value="2">${question.left}</button>
        <button type="button" data-index="${index}" data-value="5">${question.right}</button>
      </div>
    </article>
  `).join("");
  els.questionList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const question = questions[Number(button.dataset.index)];
      const raw = Number(button.dataset.value);
      state.answers[button.dataset.index] = question.reverse ? 7 - raw : raw;
      renderQuestions();
      updateProgress();
    });
  });
  for (const [index, value] of Object.entries(state.answers)) {
    const question = questions[Number(index)];
    const raw = question.reverse ? 7 - value : value;
    els.questionList.querySelector(`button[data-index="${index}"][data-value="${raw}"]`)?.classList.add("is-selected");
  }
}

function updateProgress() {
  const answered = Object.keys(state.answers).length;
  els.progressText.textContent = `${answered} / ${questions.length}`;
  els.progressBar.style.setProperty("--value", `${(answered / questions.length) * 100}%`);
}

function calculateAndRender() {
  if (Object.keys(state.answers).length < questions.length) {
    showToast("未回答の質問があります。サンプル結果を見るか、全問回答してください。");
    return;
  }
  state.result = buildResult();
  renderResult(state.result);
  els.resultPanel.hidden = false;
  els.resultPanel.scrollIntoView({ behavior: "smooth" });
}

function buildResult() {
  const vector = answerVector();
  const type = bestType(vector);
  const fitScore = Math.round(typeCompatibility(vector, type.match));
  const industries = industryRanking(vector);
  const companies = companyRanking(vector, industries);
  return { vector, type, fitScore, industries, companies };
}

function answerVector() {
  const vector = {};
  for (const [index, answer] of Object.entries(state.answers)) {
    const question = questions[Number(index)];
    if (!vector[question.axis]) vector[question.axis] = [];
    vector[question.axis].push(answer);
  }
  const defaults = {
    change: 3, autonomy: 3, logic: 3, planning: 3, growth: 3, salary: 3, stability: 3, workLife: 3,
    generalist: 3, technical: 3, consumer: 3, global: 3, ambition: 3, disclosure: 3, career: 3,
    team: 3, story: 3, selfFit: 3, culture: 3,
  };
  for (const [key, value] of Object.entries(defaults)) {
    vector[key] = vector[key] ? avg(vector[key]) : value;
  }
  vector.culture = avg([vector.team, vector.story, vector.consumer]);
  return vector;
}

function bestType(vector) {
  return [...typeProfiles].sort((a, b) => typeCompatibility(vector, b.match) - typeCompatibility(vector, a.match))[0];
}

function typeCompatibility(vector, target) {
  const keys = Object.keys(target);
  return avg(keys.map((key) => normalize(5 - Math.abs((vector[key] || 3) - target[key]), 1, 5)));
}

function industryRanking(vector) {
  return Object.entries(industryVectors).map(([industry, target]) => ({
    industry,
    score: Math.round(typeCompatibility(vector, target)),
  })).sort((a, b) => b.score - a.score);
}

function companyRanking(vector, industries) {
  const industryScore = Object.fromEntries(industries.map((d) => [d.industry, d.score]));
  return state.companies.map((company) => {
    const fit = companyFit(company, vector, industryScore[company.industry] || 50);
    return { company, ...fit };
  }).sort((a, b) => b.score - a.score || b.company.overall_score - a.company.overall_score).slice(0, 10);
}

function companyFit(company, vector, industryFit) {
  const growthFit = closeness(vector.growth, company.industry_growth_score);
  const stabilityFit = closeness(vector.stability, company.stability_score);
  const salaryFit = closeness(vector.salary, company.compensation_score);
  const careerFit = closeness(vector.career, company.career_capital_score);
  const wlbFit = closeness(vector.workLife, company.work_life_balance_score);
  const disclosureFit = closeness(vector.disclosure, company.disclosure_score);
  const esFit = normalize(avg([company.culture_clarity_score, company.comparison_value_score, company.new_grad_access_score]), 1, 5);
  const score = Math.round(industryFit * 0.3 + growthFit * 0.13 + stabilityFit * 0.12 + salaryFit * 0.1 + careerFit * 0.14 + wlbFit * 0.08 + disclosureFit * 0.06 + esFit * 0.07);
  return { score, growthFit: Math.round(growthFit), careerFit: Math.round(careerFit), esFit: Math.round(esFit), cultureFit: Math.round((industryFit + disclosureFit) / 2) };
}

function renderResult(result) {
  els.typeName.textContent = `${result.type.label} / ${result.type.name}`;
  els.typeTagline.textContent = result.type.tagline;
  els.typeLead.textContent = result.type.lead;
  els.fitScore.textContent = result.fitScore;
  els.growthFlow.innerHTML = result.type.flow.map((text, index) => `
    <div>
      <span>${index + 1}</span>
      <strong>${text}</strong>
    </div>
  `).join("");
  els.fitEnvironment.innerHTML = result.type.fit.map((text) => `<li>${text}</li>`).join("");
  els.riskEnvironment.innerHTML = result.type.risk.map((text) => `<li>${text}</li>`).join("");
  els.esStrengths.innerHTML = result.type.strengths.map((text) => `<li>${text}</li>`).join("");
  els.stuckPoints.innerHTML = result.type.stuck.map((text) => `<li>${text}</li>`).join("");
  els.interviewScript.textContent = result.type.script;
  els.industryFitList.innerHTML = result.industries.slice(0, 5).map((item) => `
    <div class="industry-item">
      <strong>${item.industry}</strong>
      <span>${item.score}</span>
    </div>
  `).join("");
  els.companyList.innerHTML = result.companies.map((item, index) => {
    const link = primaryLink(item.company);
    return `
      <article class="company-card">
        <header>
          <div>
            <p>#${index + 1} ${item.company.industry}</p>
            <h3>${item.company.company}</h3>
          </div>
          <div class="company-score">${item.score}</div>
        </header>
        <div class="metric-row">
          <div><strong>${item.growthFit}</strong><span>成長</span></div>
          <div><strong>${item.careerFit}</strong><span>キャリア</span></div>
          <div><strong>${item.cultureFit}</strong><span>社風</span></div>
          <div><strong>${item.esFit}</strong><span>ES</span></div>
        </div>
        <p>${recommendReason(item.company, result.type)}</p>
        <div class="company-actions">
          <button type="button" data-company="${escapeAttr(item.company.company)}">Plannerに追加</button>
          ${link ? `<a href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${link.label}</a>` : ""}
        </div>
      </article>
    `;
  }).join("");
  els.companyList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => saveCompanyToPlanner(button.dataset.company));
  });
  els.shareType.textContent = result.type.label;
  els.shareSummary.textContent = `${result.type.tagline} 相性が良い業界は ${result.industries.slice(0, 3).map((d) => d.industry).join("、")}。`;
}

function recommendReason(company, type) {
  const strengths = [company.advantage_tags, company.selection_reason].filter(Boolean).join(" / ");
  return `${type.label}の伸び方と、${company.industry}の環境が噛み合いやすい候補です。${strengths}`;
}

function saveToPlanner() {
  if (!state.result) return;
  for (const item of state.result.companies.slice(0, 10)) saveCompanyToPlanner(item.company.company, false);
  const profile = {
    ...(loadLocal("jobResearchApplicantProfile") || {}),
    preference_preset: profilePresetFromType(state.result.type.id),
    condition_summary: `${state.result.type.label}: ${state.result.type.lead}`,
  };
  localStorage.setItem("jobResearchApplicantProfile", JSON.stringify(profile));
  showToast("TOP10と診断タイプをPlannerに保存しました");
}

function saveCompanyToPlanner(companyName, notify = true) {
  const company = state.companies.find((d) => d.company === companyName);
  if (!company) return;
  const interested = loadLocal("jobResearchInterestedCompanies");
  interested[company.company] = { company: company.company, industry: company.industry, added_at: new Date().toISOString() };
  localStorage.setItem("jobResearchInterestedCompanies", JSON.stringify(interested));
  const personal = loadLocal("jobResearchPersonalData");
  personal[company.company] = {
    ...(personal[company.company] || { status: "未調査", next_deadline: "", personal_memo: "" }),
    status: "調査中",
    next_action: "診断結果をもとに採用ページ確認とES素材整理",
  };
  localStorage.setItem("jobResearchPersonalData", JSON.stringify(personal));
  if (notify) showToast(`${company.company}をPlannerに追加しました`);
}

async function copyResultText() {
  if (!state.result) return;
  const text = `私のキャリア相性診断は「${state.result.type.label}」。${state.result.type.tagline} 相性が良い業界は ${state.result.industries.slice(0, 3).map((d) => d.industry).join("、")}。おすすめ企業は ${state.result.companies.slice(0, 3).map((d) => d.company.company).join("、")}。`;
  try {
    await navigator.clipboard?.writeText(text);
    showToast("結果テキストをコピーしました");
  } catch {
    window.prompt("結果テキストをコピーしてください", text);
  }
}

function profilePresetFromType(typeId) {
  const presetMap = {
    growth: "growthCareer",
    reward: "growthCareer",
    stable: "stability",
    impact: "stability",
    lifestyle: "stability",
    expert: "engineer",
    craft: "engineer",
    global: "generalist",
    discoverer: "generalist",
    market: "balanced",
    creative: "balanced",
    culture: "balanced",
  };
  return presetMap[typeId] || "balanced";
}

function primaryLink(company) {
  if (!company.mypage_url) return null;
  const url = normalizeUrl(company.mypage_url);
  return { url, label: isSearchUrl(url) ? "公式採用を検索" : "採用ページ" };
}

function loadLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function closeness(preference, score) {
  return normalize(5 - Math.abs(preference - score), 1, 5);
}

function normalize(value, min, max) {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function avg(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
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

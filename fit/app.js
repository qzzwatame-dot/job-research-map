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

const choiceLabels = [
  { value: 1, label: "かなり左" },
  { value: 2, label: "やや左" },
  { value: 3, label: "どちらでもない" },
  { value: 4, label: "やや右" },
  { value: 5, label: "かなり右" },
];

const axisDefinitions = [
  {
    id: "pace",
    leftCode: "R",
    rightCode: "D",
    leftLabel: "安定志向",
    rightLabel: "変化志向",
    score: (vector) => avg([vector.change, vector.growth, 6 - vector.stability]),
  },
  {
    id: "scope",
    leftCode: "S",
    rightCode: "B",
    leftLabel: "専門深化",
    rightLabel: "幅広経験",
    score: (vector) => avg([vector.generalist, 6 - vector.technical]),
  },
  {
    id: "lens",
    leftCode: "H",
    rightCode: "L",
    leftLabel: "人間重視",
    rightLabel: "論理重視",
    score: (vector) => avg([vector.logic, 6 - vector.consumer, 6 - vector.story]),
  },
  {
    id: "mode",
    leftCode: "C",
    rightCode: "I",
    leftLabel: "協働志向",
    rightLabel: "自走志向",
    score: (vector) => avg([vector.autonomy, 6 - vector.team]),
  },
];

const typeProfiles = [
  {
    code: "DBLI",
    id: "strategist",
    name: "Frontier Strategist",
    label: "開拓戦略タイプ",
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
    code: "DBLC",
    id: "producer",
    name: "Venture Producer",
    label: "事業推進タイプ",
    tagline: "変化を捉え、構造を描き、人を動かして前進させる人。",
    lead: "新しいテーマを俯瞰しながら、関係者を巻き込んで形にするタイプ。事業開発や組織横断の推進で強みが出ます。",
    flow: ["機会を見つける", "構造を描く", "人を巻き込む", "事業を動かす"],
    match: { change: 4.5, generalist: 4.4, logic: 4.4, team: 4.3, global: 4.2, ambition: 4.3 },
    fit: ["事業開発、商社、コンサル、成長企業", "複数部署を巻き込むプロジェクト", "大きな裁量と連携が両立する環境"],
    risk: ["分業が細かく全体像が見えない環境", "挑戦より前例踏襲が強い組織", "関係者を動かす余地が少ない職場"],
    strengths: ["全体像から勝ち筋を描く力", "周囲を巻き込む推進力", "変化の中でも判断を前に進める点"],
    stuck: ["担当範囲が狭く閉じている", "意思決定が遅く動けない", "部門間の壁が高い"],
    script: "私は、変化のある状況で全体像を整理し、関係者を巻き込みながら前進させることが得意です。複雑なテーマを事業成果につなげる役割で力を発揮したいです。",
  },
  {
    code: "DBHI",
    id: "creator",
    name: "Market Creator",
    label: "市場創造タイプ",
    tagline: "人の気持ちを読み、価値に変え、自分の手で形にする人。",
    lead: "生活者や市場の変化を捉え、独自の切り口で企画に落とすタイプ。企画、ブランド、新規サービスで魅力が出ます。",
    flow: ["反応を読む", "切り口を見つける", "形にする", "市場へ届ける"],
    match: { change: 4.3, generalist: 4.2, consumer: 4.8, story: 4.6, autonomy: 4.2 },
    fit: ["広告、消費財、メディア、ブランド企画", "生活者の反応が見える仕事", "個人の発想を試せる環境"],
    risk: ["顧客から遠い仕事", "承認が重く試行回数が少ない職場", "数字だけで価値判断される環境"],
    strengths: ["相手視点で価値を考える力", "魅力的な切り口を作る発想力", "自分で企画を前に進める点"],
    stuck: ["表現の余地がない", "反応が見えない", "自由度が低い"],
    script: "私は、生活者や顧客の反応を捉え、価値ある企画に変えることが得意です。人の気持ちを動かす商品やサービスづくりに関わりたいです。",
  },
  {
    code: "DBHC",
    id: "coCreator",
    name: "Experience Connector",
    label: "共創企画タイプ",
    tagline: "人を理解し、場をつなぎ、体験を一緒に作る人。",
    lead: "変化のある市場で、人の感情や関係性を起点に価値を作るタイプ。マーケティング、営業企画、イベント、コミュニティ運営と相性が良いです。",
    flow: ["相手を知る", "共感を集める", "人をつなぐ", "体験にする"],
    match: { change: 4.1, generalist: 4.3, consumer: 4.6, story: 4.5, team: 4.7 },
    fit: ["消費財、広告、エンタメ、サービス企画", "顧客接点とチーム連携がある仕事", "共創を重視する環境"],
    risk: ["一人で完結する仕事", "顧客理解より仕様優先の職場", "組織間の連携が薄い環境"],
    strengths: ["相手の本音を汲み取る力", "周囲を巻き込む関係構築力", "価値を体験として届ける点"],
    stuck: ["人との接点が薄い", "横連携が弱い", "顧客の声が届かない"],
    script: "私は、人の気持ちを理解し、周囲と一緒に価値を形にすることに強みがあります。顧客に近い場所で、共感される体験づくりに関わりたいです。",
  },
  {
    code: "DSLI",
    id: "expert",
    name: "Technical Pioneer",
    label: "先端専門タイプ",
    tagline: "深く理解し、素早く試し、専門性で未来を切り開く人。",
    lead: "新しい技術や難度の高い課題を、自走しながら掘り下げるタイプ。IT、研究、データ、半導体などで伸びやすいです。",
    flow: ["難問を掴む", "原理を掘る", "試作する", "突破口を作る"],
    match: { change: 4.2, technical: 4.8, logic: 4.8, autonomy: 4.4, career: 4.4 },
    fit: ["IT、研究開発、データ、先端メーカー", "専門性と裁量が両立する仕事", "新技術に触れ続けられる環境"],
    risk: ["調整業務ばかりで手を動かせない職場", "変化が遅く学習機会が乏しい環境", "配属で専門がぶれやすい組織"],
    strengths: ["複雑な課題を理解する力", "新しい知識を吸収する速さ", "専門性を成果につなげる点"],
    stuck: ["深掘りの時間がない", "新しい挑戦が少ない", "専門が軽視される"],
    script: "私は、難しいテーマを深く理解し、試行錯誤を通じて突破口を作ることが得意です。先端領域で専門性を磨きながら価値を出したいです。",
  },
  {
    code: "DSLC",
    id: "architect",
    name: "Systems Architect",
    label: "技術統合タイプ",
    tagline: "専門性を軸に、人と仕組みをつなぎ、全体最適を作る人。",
    lead: "深い理解を持ちながら、周囲と連携して複雑な仕組みを形にするタイプ。エンジニアリング、プロダクト、製造開発で活きます。",
    flow: ["仕組みを読む", "論点を整理する", "周囲と接続する", "全体を設計する"],
    match: { change: 4.0, technical: 4.6, logic: 4.6, team: 4.4, planning: 4.0 },
    fit: ["プロダクト開発、製造開発、SI、技術企画", "専門職と事業側をつなぐ仕事", "協働しながら改善する環境"],
    risk: ["専門と事業が分断された職場", "個人最適だけが評価される組織", "技術判断が軽視される環境"],
    strengths: ["複雑な論点を整理する力", "専門家同士をつなぐ説明力", "仕組み全体を良くする視点"],
    stuck: ["部分最適で終わる", "連携が悪い", "技術の意図が伝わらない"],
    script: "私は、専門的な内容を整理し、関係者と共有しながら全体として良い形にまとめることが得意です。技術と事業をつなぐ役割で貢献したいです。",
  },
  {
    code: "DSHI",
    id: "artisan",
    name: "Independent Artisan",
    label: "創作専門タイプ",
    tagline: "感性を深め、技を磨き、自分だけの価値を作る人。",
    lead: "一つの領域を深く掘りながら、人に届く表現や品質を追求するタイプ。デザイン、編集、研究、商品開発などで強みが出ます。",
    flow: ["違和感を掴む", "深く掘る", "磨き込む", "作品にする"],
    match: { change: 4.0, technical: 3.8, story: 4.6, consumer: 4.2, autonomy: 4.5, generalist: 2.2 },
    fit: ["デザイン、編集、商品開発、研究企画", "感性と専門性を磨ける仕事", "個人のこだわりを活かせる環境"],
    risk: ["量だけが重視される職場", "専門性より調整が中心の仕事", "表現の自由度が低い環境"],
    strengths: ["細部まで磨き込む力", "感覚を形にする表現力", "自分の軸で品質を高める点"],
    stuck: ["こだわりを持てない", "浅い対応が続く", "自由度がない"],
    script: "私は、一つの領域を深く掘り下げ、相手に届く品質まで磨き込むことに強みがあります。専門性と感性を活かして価値を作りたいです。",
  },
  {
    code: "DSHC",
    id: "coach",
    name: "Human Specialist",
    label: "支援専門タイプ",
    tagline: "人を深く理解し、専門性で支え、成長を後押しする人。",
    lead: "人への関心と専門性を両立するタイプ。医療、ヘルスケア、人事、教育、顧客支援のような領域で力を発揮します。",
    flow: ["相手を理解する", "背景を掘る", "専門で支える", "成長を促す"],
    match: { change: 3.8, technical: 3.9, consumer: 4.1, story: 4.3, team: 4.7, generalist: 2.4 },
    fit: ["医療、ヘルスケア、人事、教育、顧客支援", "人に近い専門職", "信頼関係を積み上げる環境"],
    risk: ["相手との接点が薄い仕事", "専門性が活かせない配属", "短期成果だけを追う職場"],
    strengths: ["相手の状況を深く理解する力", "専門知識を相手のために使う姿勢", "信頼を築きながら支援する点"],
    stuck: ["支える相手が見えない", "専門性が浅くなる", "関係性が短期で切れる"],
    script: "私は、人の状況を丁寧に理解し、専門性を使って支えることにやりがいを感じます。信頼関係を築きながら、相手の成長や安心に貢献したいです。",
  },
  {
    code: "RBLI",
    id: "optimizer",
    name: "Operational Optimizer",
    label: "改善設計タイプ",
    tagline: "仕組みを読み、無駄を見つけ、自分で改善を積み上げる人。",
    lead: "安定した環境の中で、幅広い視点から業務を改善していくタイプ。金融、メーカー、インフラの企画・管理で強みが出ます。",
    flow: ["現状を読む", "無駄を見つける", "改善を試す", "仕組みに残す"],
    match: { stability: 4.4, generalist: 4.3, logic: 4.5, autonomy: 4.0, planning: 4.3 },
    fit: ["金融、メーカー、インフラの企画・管理", "業務改善や管理会計に近い仕事", "制度がありつつ改善余地もある環境"],
    risk: ["改善提案が通りにくい組織", "変化だけが目的化した職場", "評価基準が曖昧な環境"],
    strengths: ["構造を読み解く力", "改善を積み上げる実行力", "安定の中に変化を作る点"],
    stuck: ["非効率が放置される", "提案が届かない", "目的が曖昧"],
    script: "私は、既存の仕組みを理解したうえで課題を見つけ、改善を積み上げることが得意です。安定した事業基盤の中で、より良い運営に貢献したいです。",
  },
  {
    code: "RBLC",
    id: "builder",
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
    code: "RBHI",
    id: "advisor",
    name: "Trusted Advisor",
    label: "顧客伴走タイプ",
    tagline: "相手を理解し、広く考え、自分の判断で支える人。",
    lead: "安定した基盤の中で、顧客や周囲の期待に応えながら幅広く価値を出すタイプ。金融、法人営業、コンサルティブ営業と相性が良いです。",
    flow: ["相手を知る", "背景を整理する", "提案を組む", "信頼を積む"],
    match: { stability: 4.2, generalist: 4.4, consumer: 4.1, story: 4.3, autonomy: 4.0 },
    fit: ["金融、法人営業、不動産、顧客提案型の仕事", "長期的な信頼が重要な仕事", "幅広い知識を使う環境"],
    risk: ["短期売上だけが重視される職場", "顧客との接点が浅い仕事", "裁量がなく提案余地が少ない環境"],
    strengths: ["相手の意図を読む力", "状況に応じた提案力", "自分で判断し信頼を積む点"],
    stuck: ["顧客理解が浅い", "提案の自由度がない", "関係性が短期で終わる"],
    script: "私は、相手の状況を理解し、幅広い選択肢から最適な提案を考えることが得意です。長期的な信頼関係を築きながら価値を届けたいです。",
  },
  {
    code: "RBHC",
    id: "connector",
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
    code: "RSLI",
    id: "craft",
    name: "Craft Specialist",
    label: "職人専門タイプ",
    tagline: "一つの領域を磨き、品質と再現性で信頼を作る人。",
    lead: "専門性、品質、継続的な改善に強いタイプ。大きな変化よりも、目の前の技術や仕事を深く磨くほど価値が出ます。",
    flow: ["基礎を固める", "細部を観察する", "反復して磨く", "品質で信頼される"],
    match: { technical: 4.5, planning: 4.6, stability: 4.0, logic: 4.4, autonomy: 4.1, generalist: 2.0, change: 2.5 },
    fit: ["メーカー、研究開発、品質管理、専門職", "技術や業務知識を深められる職種", "長期的にスキルを磨ける環境"],
    risk: ["異動が多く専門性が積み上がらない環境", "スピードだけで品質が軽視される職場", "広く浅い経験ばかり求められる仕事"],
    strengths: ["細部まで丁寧に詰める力", "専門性を継続して磨く粘り強さ", "品質や再現性にこだわれる点"],
    stuck: ["短期で役割が変わり続ける", "品質より勢いが評価される", "深く学ぶ時間が取れない"],
    script: "私は、一つの領域を深く理解し、品質や再現性を高めることで価値を出すことに強みがあります。専門性を着実に磨ける環境で信頼される成果を出したいです。",
  },
  {
    code: "RSLC",
    id: "steward",
    name: "Reliability Steward",
    label: "品質協働タイプ",
    tagline: "専門性を守り、周囲と連携し、安心できる品質を支える人。",
    lead: "深い知識と協働性を両立し、安定運用や品質を支えるタイプ。製薬、金融システム、品質保証、インフラ運営に向きます。",
    flow: ["基準を理解する", "リスクを見抜く", "周囲と整える", "安心を守る"],
    match: { technical: 4.4, planning: 4.5, stability: 4.5, logic: 4.3, team: 4.4, generalist: 2.2 },
    fit: ["品質保証、製薬、金融システム、インフラ運用", "正確さと連携が必要な専門職", "信頼性を重視する環境"],
    risk: ["スピードだけで品質を犠牲にする職場", "個人依存が強すぎる環境", "基準や役割が曖昧な組織"],
    strengths: ["リスクを先回りして捉える力", "基準を守る責任感", "周囲と品質を作る協働力"],
    stuck: ["基準が曖昧", "属人化が強い", "品質より勢いが優先される"],
    script: "私は、専門知識をもとにリスクを先回りして捉え、周囲と連携しながら品質を支えることが得意です。信頼性が重要な領域で価値を出したいです。",
  },
  {
    code: "RSHI",
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
    code: "RSHC",
    id: "supporter",
    name: "Community Supporter",
    label: "安心支援タイプ",
    tagline: "人に寄り添い、専門性を活かし、安心できる場を守る人。",
    lead: "安定した環境で、人への関心と専門性を活かしながら支えるタイプ。ヘルスケア、教育、人事、顧客支援で強みが出ます。",
    flow: ["相手を受け止める", "背景を理解する", "支援を整える", "安心を広げる"],
    match: { stability: 4.6, technical: 3.8, consumer: 4.2, story: 4.2, team: 4.7, workLife: 4.0 },
    fit: ["ヘルスケア、教育、人事、顧客支援", "人を長期的に支える仕事", "信頼と協働を大切にする環境"],
    risk: ["人との接点が薄い仕事", "短期成果だけを追う職場", "支援より競争が強い環境"],
    strengths: ["相手に寄り添う力", "専門性を安心へ変える力", "周囲と支援を続ける姿勢"],
    stuck: ["人の役に立つ実感がない", "関係性が浅い", "競争が強すぎる"],
    script: "私は、相手に寄り添いながら必要な支援を考え、安心につなげることに強みがあります。人を長期的に支える環境で価値を出したいです。",
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
  axisList: document.querySelector("#axisList"),
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
    renderQuestions();
    updateProgress();
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
        ${choiceLabels.map((choice) => `
          <button type="button" data-index="${index}" data-value="${choice.value}">
            ${choice.value === 1 ? question.left : choice.value === 5 ? question.right : choice.label}
          </button>
        `).join("")}
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
  const dimensions = buildDimensions(vector);
  const type = bestType(dimensions.code, vector);
  const fitScore = Math.round(typeCompatibility(vector, type.match));
  const industries = industryRanking(vector);
  const companies = companyRanking(vector, industries);
  return { vector, dimensions, type, fitScore, industries, companies };
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

function buildDimensions(vector) {
  const items = axisDefinitions.map((axis) => {
    const score = axis.score(vector);
    const isRight = score >= 3;
    return {
      ...axis,
      score,
      code: isRight ? axis.rightCode : axis.leftCode,
      dominantLabel: isRight ? axis.rightLabel : axis.leftLabel,
    };
  });
  return {
    code: items.map((item) => item.code).join(""),
    items,
  };
}

function bestType(code, vector) {
  return typeProfiles.find((type) => type.code === code)
    || [...typeProfiles].sort((a, b) => typeCompatibility(vector, b.match) - typeCompatibility(vector, a.match))[0];
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
  els.typeName.textContent = `${result.type.code} ${result.type.label} / ${result.type.name}`;
  els.typeTagline.textContent = result.type.tagline;
  els.typeLead.textContent = result.type.lead;
  els.fitScore.textContent = result.fitScore;
  els.growthFlow.innerHTML = result.type.flow.map((text, index) => `
    <div>
      <span>${index + 1}</span>
      <strong>${text}</strong>
    </div>
  `).join("");
  els.axisList.innerHTML = result.dimensions.items.map((axis) => `
    <div class="axis-item">
      <div class="axis-head">
        <span>${axis.leftLabel}</span>
        <strong>${axis.dominantLabel}</strong>
        <span>${axis.rightLabel}</span>
      </div>
      <div class="axis-track" style="--value: ${normalize(axis.score, 1, 5)}%;">
        <i></i>
      </div>
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
  els.shareType.textContent = `${result.type.code} ${result.type.label}`;
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
    career_fit_code: state.result.type.code,
    career_fit_label: state.result.type.label,
    career_fit_name: state.result.type.name,
    career_fit_tagline: state.result.type.tagline,
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
  const text = `私のキャリア相性診断は「${state.result.type.code} ${state.result.type.label}」。${state.result.type.tagline} 相性が良い業界は ${state.result.industries.slice(0, 3).map((d) => d.industry).join("、")}。おすすめ企業は ${state.result.companies.slice(0, 3).map((d) => d.company.company).join("、")}。`;
  try {
    await navigator.clipboard?.writeText(text);
    showToast("結果テキストをコピーしました");
  } catch {
    window.prompt("結果テキストをコピーしてください", text);
  }
}

function profilePresetFromType(typeId) {
  const presetMap = {
    strategist: "growthCareer",
    producer: "growthCareer",
    expert: "growthCareer",
    creator: "balanced",
    coCreator: "balanced",
    architect: "engineer",
    artisan: "engineer",
    coach: "balanced",
    optimizer: "generalist",
    builder: "stability",
    advisor: "balanced",
    connector: "balanced",
    craft: "engineer",
    steward: "engineer",
    impact: "stability",
    supporter: "stability",
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

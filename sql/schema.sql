PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS industries (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  overview TEXT,
  market_trend TEXT,
  key_drivers TEXT,
  risks TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY,
  industry_id INTEGER NOT NULL REFERENCES industries(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  legal_name TEXT,
  ticker TEXT,
  listing_market TEXT,
  website_url TEXT,
  headquarters TEXT,
  founded_year INTEGER,
  employee_count INTEGER,
  business_summary TEXT,
  strategy_summary TEXT,
  outlook_summary TEXT,
  overall_status TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(industry_id, name)
);

CREATE TABLE IF NOT EXISTS source_documents (
  id INTEGER PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  industry_id INTEGER REFERENCES industries(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (
    source_type IN (
      'annual_report',
      'integrated_report',
      'earnings',
      'recruiting_page',
      'news',
      'government_statistics',
      'review_site',
      'interview',
      'job_posting',
      'other'
    )
  ),
  title TEXT NOT NULL,
  publisher TEXT,
  url TEXT,
  published_date TEXT,
  retrieved_date TEXT NOT NULL,
  reliability_score INTEGER NOT NULL DEFAULT 3 CHECK (reliability_score BETWEEN 1 AND 5),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS financial_metrics (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  fiscal_year INTEGER NOT NULL,
  revenue_million_yen REAL,
  operating_income_million_yen REAL,
  net_income_million_yen REAL,
  operating_margin_pct REAL,
  revenue_growth_pct REAL,
  roe_pct REAL,
  cash_flow_summary TEXT,
  source_document_id INTEGER REFERENCES source_documents(id) ON DELETE SET NULL,
  UNIQUE(company_id, fiscal_year)
);

CREATE TABLE IF NOT EXISTS hiring_metrics (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  new_graduate_hires INTEGER,
  mid_career_hires INTEGER,
  turnover_rate_pct REAL,
  average_age REAL,
  average_tenure_years REAL,
  average_salary_thousand_yen REAL,
  overtime_hours_monthly REAL,
  paid_leave_usage_pct REAL,
  remote_work_policy TEXT,
  source_document_id INTEGER REFERENCES source_documents(id) ON DELETE SET NULL,
  UNIQUE(company_id, year)
);

CREATE TABLE IF NOT EXISTS culture_assessments (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  assessment_date TEXT NOT NULL,
  culture_keywords TEXT,
  decision_speed_score INTEGER CHECK (decision_speed_score BETWEEN 1 AND 5),
  challenge_orientation_score INTEGER CHECK (challenge_orientation_score BETWEEN 1 AND 5),
  teamwork_score INTEGER CHECK (teamwork_score BETWEEN 1 AND 5),
  hierarchy_score INTEGER CHECK (hierarchy_score BETWEEN 1 AND 5),
  work_life_balance_score INTEGER CHECK (work_life_balance_score BETWEEN 1 AND 5),
  learning_support_score INTEGER CHECK (learning_support_score BETWEEN 1 AND 5),
  evidence_summary TEXT,
  source_document_id INTEGER REFERENCES source_documents(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS offer_profiles (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  year INTEGER,
  applicant_profile TEXT,
  accepted_candidate_traits TEXT,
  common_university_groups TEXT,
  valued_experience TEXT,
  interview_focus TEXT,
  selection_notes TEXT,
  source_document_id INTEGER REFERENCES source_documents(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS turnover_reasons (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  reason_category TEXT NOT NULL CHECK (
    reason_category IN (
      'compensation',
      'career_growth',
      'management',
      'workload',
      'culture_mismatch',
      'business_uncertainty',
      'relocation',
      'personal',
      'other'
    )
  ),
  count_estimate INTEGER,
  share_pct REAL,
  evidence_summary TEXT,
  source_document_id INTEGER REFERENCES source_documents(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS competitor_groups (
  id INTEGER PRIMARY KEY,
  industry_id INTEGER NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(industry_id, name)
);

CREATE TABLE IF NOT EXISTS competitor_group_members (
  competitor_group_id INTEGER NOT NULL REFERENCES competitor_groups(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT,
  PRIMARY KEY (competitor_group_id, company_id)
);

CREATE TABLE IF NOT EXISTS recruitment_targets (
  id INTEGER PRIMARY KEY,
  priority_rank INTEGER NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  company TEXT NOT NULL,
  selection_reason TEXT,
  new_grad_hiring_status TEXT,
  mypage_2028_status TEXT,
  mypage_url TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recruitment_target_scores (
  id INTEGER PRIMARY KEY,
  recruitment_target_id INTEGER NOT NULL REFERENCES recruitment_targets(id) ON DELETE CASCADE,
  scored_date TEXT NOT NULL,
  score_basis TEXT NOT NULL DEFAULT 'initial_hypothesis',
  industry_growth_score INTEGER CHECK (industry_growth_score BETWEEN 1 AND 5),
  company_strength_score INTEGER CHECK (company_strength_score BETWEEN 1 AND 5),
  stability_score INTEGER CHECK (stability_score BETWEEN 1 AND 5),
  compensation_score INTEGER CHECK (compensation_score BETWEEN 1 AND 5),
  career_capital_score INTEGER CHECK (career_capital_score BETWEEN 1 AND 5),
  new_grad_access_score INTEGER CHECK (new_grad_access_score BETWEEN 1 AND 5),
  culture_clarity_score INTEGER CHECK (culture_clarity_score BETWEEN 1 AND 5),
  work_life_balance_score INTEGER CHECK (work_life_balance_score BETWEEN 1 AND 5),
  transferability_score INTEGER CHECK (transferability_score BETWEEN 1 AND 5),
  disclosure_score INTEGER CHECK (disclosure_score BETWEEN 1 AND 5),
  comparison_value_score INTEGER CHECK (comparison_value_score BETWEEN 1 AND 5),
  overall_score REAL,
  advantage_tags TEXT,
  caution_tags TEXT,
  scoring_notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(recruitment_target_id, scored_date, score_basis)
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id INTEGER PRIMARY KEY,
  profile_name TEXT NOT NULL UNIQUE,
  graduation_year TEXT,
  major_group TEXT,
  target_job_types TEXT,
  preferred_industries TEXT,
  preferred_locations TEXT,
  mbti_type TEXT,
  mbti_confidence_score INTEGER CHECK (mbti_confidence_score BETWEEN 1 AND 5),
  extroversion_preference_score INTEGER CHECK (extroversion_preference_score BETWEEN 1 AND 5),
  change_tolerance_score INTEGER CHECK (change_tolerance_score BETWEEN 1 AND 5),
  team_orientation_score INTEGER CHECK (team_orientation_score BETWEEN 1 AND 5),
  autonomy_preference_score INTEGER CHECK (autonomy_preference_score BETWEEN 1 AND 5),
  logic_orientation_score INTEGER CHECK (logic_orientation_score BETWEEN 1 AND 5),
  planning_orientation_score INTEGER CHECK (planning_orientation_score BETWEEN 1 AND 5),
  es_draft TEXT,
  experience_summary TEXT,
  condition_summary TEXT,
  remote_preference_score INTEGER CHECK (remote_preference_score BETWEEN 1 AND 5),
  salary_priority_score INTEGER CHECK (salary_priority_score BETWEEN 1 AND 5),
  stability_priority_score INTEGER CHECK (stability_priority_score BETWEEN 1 AND 5),
  growth_priority_score INTEGER CHECK (growth_priority_score BETWEEN 1 AND 5),
  work_life_priority_score INTEGER CHECK (work_life_priority_score BETWEEN 1 AND 5),
  global_priority_score INTEGER CHECK (global_priority_score BETWEEN 1 AND 5),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS preference_presets (
  id INTEGER PRIMARY KEY,
  preset_name TEXT NOT NULL UNIQUE,
  description TEXT,
  industry_growth_weight REAL NOT NULL,
  company_strength_weight REAL NOT NULL,
  stability_weight REAL NOT NULL,
  compensation_weight REAL NOT NULL,
  career_capital_weight REAL NOT NULL,
  new_grad_access_weight REAL NOT NULL,
  culture_clarity_weight REAL NOT NULL,
  work_life_balance_weight REAL NOT NULL,
  transferability_weight REAL NOT NULL,
  disclosure_weight REAL NOT NULL,
  comparison_value_weight REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_company_preferences (
  id INTEGER PRIMARY KEY,
  student_profile_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  recruitment_target_id INTEGER NOT NULL REFERENCES recruitment_targets(id) ON DELETE CASCADE,
  interest_score INTEGER CHECK (interest_score BETWEEN 1 AND 5),
  skill_fit_score INTEGER CHECK (skill_fit_score BETWEEN 1 AND 5),
  culture_fit_score INTEGER CHECK (culture_fit_score BETWEEN 1 AND 5),
  location_fit_score INTEGER CHECK (location_fit_score BETWEEN 1 AND 5),
  job_fit_score INTEGER CHECK (job_fit_score BETWEEN 1 AND 5),
  major_fit_score INTEGER CHECK (major_fit_score BETWEEN 1 AND 5),
  work_style_fit_score INTEGER CHECK (work_style_fit_score BETWEEN 1 AND 5),
  salary_fit_score INTEGER CHECK (salary_fit_score BETWEEN 1 AND 5),
  global_fit_score INTEGER CHECK (global_fit_score BETWEEN 1 AND 5),
  self_pr_strength_score INTEGER CHECK (self_pr_strength_score BETWEEN 1 AND 5),
  concern_notes TEXT,
  personal_notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_profile_id, recruitment_target_id)
);

CREATE TABLE IF NOT EXISTS application_statuses (
  id INTEGER PRIMARY KEY,
  student_profile_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  recruitment_target_id INTEGER NOT NULL REFERENCES recruitment_targets(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT '未調査' CHECK (
    status IN (
      '未調査',
      '調査中',
      'マイページ登録済み',
      'イベント参加予定',
      'ES準備中',
      '応募済み',
      '選考中',
      '内定',
      '辞退候補',
      '見送り'
    )
  ),
  next_action TEXT,
  next_deadline TEXT,
  last_touched_date TEXT,
  application_notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_profile_id, recruitment_target_id)
);

CREATE TABLE IF NOT EXISTS applicant_documents (
  id INTEGER PRIMARY KEY,
  student_profile_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (
    document_type IN ('ES', '自己PR', 'ガクチカ', '経歴', '希望条件', 'その他')
  ),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  extracted_strengths TEXT,
  extracted_skills TEXT,
  extracted_preferences TEXT,
  extracted_constraints TEXT,
  analyzed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_company_analyses (
  id INTEGER PRIMARY KEY,
  student_profile_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  recruitment_target_id INTEGER NOT NULL REFERENCES recruitment_targets(id) ON DELETE CASCADE,
  analysis_basis TEXT NOT NULL DEFAULT 'local_rule_based',
  analyzed_at TEXT NOT NULL,
  personal_score REAL,
  offer_likelihood_score REAL,
  fit_score REAL,
  motivation_score REAL,
  es_material_score REAL,
  caution_summary TEXT,
  recommended_next_action TEXT,
  matching_reasons TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_profile_id, recruitment_target_id, analysis_basis, analyzed_at)
);

CREATE TABLE IF NOT EXISTS recruiting_events (
  id INTEGER PRIMARY KEY,
  recruitment_target_id INTEGER NOT NULL REFERENCES recruitment_targets(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      '28卒マイページ',
      'インターン',
      '説明会',
      'ES締切',
      'Webテスト',
      '面接',
      'OB訪問',
      'その他'
    )
  ),
  title TEXT NOT NULL,
  event_date TEXT,
  deadline_date TEXT,
  url TEXT,
  status TEXT NOT NULL DEFAULT '未確認' CHECK (
    status IN ('未確認', '受付中', '予定', '締切間近', '終了')
  ),
  source_url TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS score_evidence_sources (
  id INTEGER PRIMARY KEY,
  recruitment_target_id INTEGER NOT NULL REFERENCES recruitment_targets(id) ON DELETE CASCADE,
  score_key TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (
    source_type IN (
      'IR',
      '採用ページ',
      '人的資本開示',
      '口コミ',
      '選考体験記',
      'ニュース',
      '統計',
      'その他'
    )
  ),
  title TEXT NOT NULL,
  url TEXT,
  reliability_score INTEGER NOT NULL DEFAULT 3 CHECK (reliability_score BETWEEN 1 AND 5),
  evidence_summary TEXT,
  checked_date TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_scores (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  scored_date TEXT NOT NULL,
  growth_potential_score INTEGER CHECK (growth_potential_score BETWEEN 1 AND 5),
  stability_score INTEGER CHECK (stability_score BETWEEN 1 AND 5),
  culture_fit_score INTEGER CHECK (culture_fit_score BETWEEN 1 AND 5),
  career_development_score INTEGER CHECK (career_development_score BETWEEN 1 AND 5),
  compensation_score INTEGER CHECK (compensation_score BETWEEN 1 AND 5),
  hiring_difficulty_score INTEGER CHECK (hiring_difficulty_score BETWEEN 1 AND 5),
  notes TEXT,
  UNIQUE(company_id, scored_date)
);

CREATE VIEW IF NOT EXISTS latest_financial_metrics AS
SELECT fm.*
FROM financial_metrics fm
JOIN (
  SELECT company_id, MAX(fiscal_year) AS fiscal_year
  FROM financial_metrics
  GROUP BY company_id
) latest
  ON latest.company_id = fm.company_id
 AND latest.fiscal_year = fm.fiscal_year;

CREATE VIEW IF NOT EXISTS latest_hiring_metrics AS
SELECT hm.*
FROM hiring_metrics hm
JOIN (
  SELECT company_id, MAX(year) AS year
  FROM hiring_metrics
  GROUP BY company_id
) latest
  ON latest.company_id = hm.company_id
 AND latest.year = hm.year;

CREATE VIEW IF NOT EXISTS latest_company_scores AS
SELECT cs.*
FROM company_scores cs
JOIN (
  SELECT company_id, MAX(scored_date) AS scored_date
  FROM company_scores
  GROUP BY company_id
) latest
  ON latest.company_id = cs.company_id
 AND latest.scored_date = cs.scored_date;

CREATE VIEW IF NOT EXISTS company_comparison AS
SELECT
  i.name AS industry,
  c.name AS company,
  c.business_summary,
  c.strategy_summary,
  c.outlook_summary,
  c.overall_status,
  lf.fiscal_year,
  lf.revenue_million_yen,
  lf.operating_margin_pct,
  lf.revenue_growth_pct,
  lh.new_graduate_hires,
  lh.mid_career_hires,
  lh.turnover_rate_pct,
  lh.average_salary_thousand_yen,
  lh.overtime_hours_monthly,
  lh.remote_work_policy,
  lcs.growth_potential_score,
  lcs.stability_score,
  lcs.culture_fit_score,
  lcs.career_development_score,
  lcs.compensation_score,
  lcs.hiring_difficulty_score
FROM companies c
JOIN industries i ON i.id = c.industry_id
LEFT JOIN latest_financial_metrics lf ON lf.company_id = c.id
LEFT JOIN latest_hiring_metrics lh ON lh.company_id = c.id
LEFT JOIN latest_company_scores lcs ON lcs.company_id = c.id;

CREATE VIEW IF NOT EXISTS recruitment_target_comparison AS
SELECT
  rt.priority_rank,
  rt.industry,
  rt.company,
  rt.selection_reason,
  rt.new_grad_hiring_status,
  rt.mypage_2028_status,
  rt.mypage_url,
  rts.scored_date,
  rts.score_basis,
  rts.industry_growth_score,
  rts.company_strength_score,
  rts.stability_score,
  rts.compensation_score,
  rts.career_capital_score,
  rts.new_grad_access_score,
  rts.culture_clarity_score,
  rts.work_life_balance_score,
  rts.transferability_score,
  rts.disclosure_score,
  rts.comparison_value_score,
  rts.overall_score,
  rts.advantage_tags,
  rts.caution_tags,
  rts.scoring_notes
FROM recruitment_targets rt
JOIN recruitment_target_scores rts ON rts.recruitment_target_id = rt.id;

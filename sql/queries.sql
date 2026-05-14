-- 1. 業界内の企業を一覧比較する
SELECT *
FROM company_comparison
WHERE industry = 'サンプル: ITサービス'
ORDER BY growth_potential_score DESC, stability_score DESC;

-- 2. 同業他社の年収・残業・離職率を比較する
SELECT
  company,
  average_salary_thousand_yen,
  overtime_hours_monthly,
  turnover_rate_pct,
  remote_work_policy
FROM company_comparison
WHERE industry = 'サンプル: ITサービス'
ORDER BY average_salary_thousand_yen DESC;

-- 3. 成長性と安定性のバランスを見る
SELECT
  company,
  revenue_growth_pct,
  operating_margin_pct,
  growth_potential_score,
  stability_score,
  outlook_summary
FROM company_comparison
WHERE industry = 'サンプル: ITサービス'
ORDER BY growth_potential_score DESC, stability_score DESC;

-- 4. 社風スコアを比較する
SELECT
  c.name AS company,
  ca.culture_keywords,
  ca.decision_speed_score,
  ca.challenge_orientation_score,
  ca.teamwork_score,
  ca.hierarchy_score,
  ca.work_life_balance_score,
  ca.learning_support_score,
  ca.evidence_summary
FROM culture_assessments ca
JOIN companies c ON c.id = ca.company_id
JOIN industries i ON i.id = c.industry_id
WHERE i.name = 'サンプル: ITサービス'
ORDER BY ca.assessment_date DESC, c.name;

-- 5. 内定者・選考傾向を見る
SELECT
  c.name AS company,
  op.accepted_candidate_traits,
  op.valued_experience,
  op.interview_focus,
  op.selection_notes
FROM offer_profiles op
JOIN companies c ON c.id = op.company_id
JOIN industries i ON i.id = c.industry_id
WHERE i.name = 'サンプル: ITサービス'
ORDER BY c.name, op.year DESC;

-- 6. 転職・退職理由の傾向を見る
SELECT
  c.name AS company,
  tr.period,
  tr.reason_category,
  tr.share_pct,
  tr.evidence_summary
FROM turnover_reasons tr
JOIN companies c ON c.id = tr.company_id
JOIN industries i ON i.id = c.industry_id
WHERE i.name = 'サンプル: ITサービス'
ORDER BY c.name, tr.share_pct DESC;

-- 7. 情報源の信頼性を確認する
SELECT
  COALESCE(c.name, i.name) AS target,
  sd.source_type,
  sd.title,
  sd.publisher,
  sd.published_date,
  sd.retrieved_date,
  sd.reliability_score,
  sd.url
FROM source_documents sd
LEFT JOIN companies c ON c.id = sd.company_id
LEFT JOIN industries i ON i.id = sd.industry_id
ORDER BY sd.reliability_score DESC, sd.retrieved_date DESC;

PRAGMA foreign_keys = ON;

INSERT INTO industries (name, overview, market_trend, key_drivers, risks)
VALUES
  (
    'サンプル: ITサービス',
    '企業向けシステム開発、クラウド導入、運用保守、DX支援を含む業界。',
    'クラウド移行、生成AI活用、セキュリティ投資が需要を押し上げる一方、人材不足が制約になる。',
    'DX投資、クラウド利用拡大、規制対応、AI導入',
    '採用難、単価下落、技術陳腐化、プロジェクト採算悪化'
  );

INSERT INTO companies (
  industry_id, name, legal_name, listing_market, website_url, headquarters,
  founded_year, employee_count, business_summary, strategy_summary,
  outlook_summary, overall_status
)
VALUES
  (
    1,
    'サンプルA社',
    'サンプルA株式会社',
    '東証プライム',
    'https://example.com/a',
    '東京都',
    1980,
    12000,
    '大企業向けSI、クラウド移行、保守運用が中心。',
    '既存大手顧客の深耕と、AI/クラウド案件の高付加価値化を進める。',
    '安定性は高いが、若手の成長機会は配属先に左右されやすい。',
    '収益基盤は安定。人材獲得と利益率改善が課題。'
  ),
  (
    1,
    'サンプルB社',
    'サンプルB株式会社',
    '東証グロース',
    'https://example.com/b',
    '東京都',
    2012,
    900,
    'SaaS導入支援とデータ分析基盤の構築に強み。',
    '特定領域での専門性を高め、コンサルから実装まで一気通貫で提供する。',
    '成長余地は大きいが、事業拡大に伴う組織整備が重要。',
    '売上成長が続く一方、教育・評価制度は発展途上。'
  );

INSERT INTO source_documents (
  company_id, source_type, title, publisher, url, published_date, retrieved_date,
  reliability_score, notes
)
VALUES
  (1, 'other', 'サンプル入力用資料', '自作サンプル', 'https://example.com/a/source', '2026-01-01', '2026-05-13', 1, '実データではなく構造確認用。'),
  (2, 'other', 'サンプル入力用資料', '自作サンプル', 'https://example.com/b/source', '2026-01-01', '2026-05-13', 1, '実データではなく構造確認用。');

INSERT INTO financial_metrics (
  company_id, fiscal_year, revenue_million_yen, operating_income_million_yen,
  net_income_million_yen, operating_margin_pct, revenue_growth_pct, roe_pct,
  cash_flow_summary, source_document_id
)
VALUES
  (1, 2025, 500000, 42000, 28000, 8.4, 5.2, 10.1, '営業CFは安定的にプラス。大型案件の採算管理が重要。', 1),
  (2, 2025, 38000, 2200, 1400, 5.8, 24.5, 8.7, '成長投資によりFCFは変動しやすい。', 2);

INSERT INTO hiring_metrics (
  company_id, year, new_graduate_hires, mid_career_hires, turnover_rate_pct,
  average_age, average_tenure_years, average_salary_thousand_yen,
  overtime_hours_monthly, paid_leave_usage_pct, remote_work_policy,
  source_document_id
)
VALUES
  (1, 2025, 450, 700, 6.5, 39.8, 13.2, 8200, 22.0, 72.0, '部署によりハイブリッド勤務。', 1),
  (2, 2025, 35, 210, 12.0, 33.5, 4.1, 6900, 28.0, 61.0, '原則ハイブリッド。職種によりフルリモート可。', 2);

INSERT INTO culture_assessments (
  company_id, assessment_date, culture_keywords, decision_speed_score,
  challenge_orientation_score, teamwork_score, hierarchy_score,
  work_life_balance_score, learning_support_score, evidence_summary,
  source_document_id
)
VALUES
  (1, '2026-05-13', '安定, 大規模案件, 調整力, 部署差', 3, 3, 4, 4, 3, 4, '大企業らしい制度の厚さがある一方、意思決定は慎重になりやすい。', 1),
  (2, '2026-05-13', '成長, 裁量, スピード, 変化耐性', 4, 5, 3, 2, 3, 3, '若手にも機会が回りやすいが、仕組みは変化中。', 2);

INSERT INTO offer_profiles (
  company_id, year, applicant_profile, accepted_candidate_traits,
  common_university_groups, valued_experience, interview_focus, selection_notes,
  source_document_id
)
VALUES
  (1, 2025, '新卒・理系/文系混合。SI志望、顧客折衝志向が多い。', '粘り強さ、論理性、チームで進める力。', '幅広い大学群', '長期インターン、研究、チーム開発、課外活動', '学生時代の取り組み、チーム経験、志望理由の一貫性', '配属リスクへの理解を確認したい。', 1),
  (2, 2025, 'SaaS、データ、コンサル志向。成長環境を求める層が多い。', '自走力、学習速度、曖昧さへの耐性。', '幅広い大学群', 'インターン、個人開発、データ分析、営業経験', 'なぜ成長企業か、変化への対応、実績の再現性', 'カルチャーフィットの見極めが重要。', 2);

INSERT INTO turnover_reasons (
  company_id, period, reason_category, count_estimate, share_pct,
  evidence_summary, source_document_id
)
VALUES
  (1, '2024-2025', 'career_growth', NULL, 35.0, '大規模組織で専門性や裁量を求めて転職する声がある。', 1),
  (1, '2024-2025', 'workload', NULL, 20.0, '繁忙プロジェクトでは負荷が高まりやすい。', 1),
  (2, '2024-2025', 'management', NULL, 30.0, '急拡大に伴うマネジメント品質のばらつきが見られる。', 2),
  (2, '2024-2025', 'compensation', NULL, 25.0, '成長企業としての期待に対し、報酬水準への不満が出る可能性。', 2);

INSERT INTO competitor_groups (industry_id, name, description)
VALUES
  (1, 'ITサービス主要比較', 'ITサービス企業を就活観点で横比較するためのグループ。');

INSERT INTO competitor_group_members (competitor_group_id, company_id, role)
VALUES
  (1, 1, '大手安定型'),
  (1, 2, '成長特化型');

INSERT INTO company_scores (
  company_id, scored_date, growth_potential_score, stability_score,
  culture_fit_score, career_development_score, compensation_score,
  hiring_difficulty_score,
  notes
)
VALUES
  (1, '2026-05-13', 3, 5, 3, 3, 4, 4, '安定志向、制度重視、顧客折衝経験を積みたい人向き。'),
  (2, '2026-05-13', 5, 3, 4, 4, 3, 3, '変化や裁量を好み、早く経験を積みたい人向き。');

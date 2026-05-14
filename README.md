# 就活企業研究データベース

業界研究、企業研究、社風、内定者傾向、転職者の数や理由、会社全体の状態、今後の展望を、同業他社と比較するためのSQLiteデータベースです。

## 作成されるもの

- `job_research.db`: ローカルSQLiteデータベース
- `sql/schema.sql`: テーブル・ビュー定義
- `sql/seed_sample.sql`: 構造確認用のサンプルデータ
- `sql/queries.sql`: 比較に使うSQL例
- `data/*_template.csv`: 入力用CSVテンプレート
- `data/target_companies_100.csv`: 就活DBに優先追加する大手100社候補
- `data/target_company_scores_initial.csv`: 100社の就活比較用・初期仮説スコア
- `data/preference_presets.csv`: 志向プリセット別のスコア重み
- `data/student_profile_template.csv`: 就活生プロフィール入力テンプレート
- `data/student_company_preferences_template.csv`: 個人相性スコア保存用テンプレート
- `data/application_status_template.csv`: 応募状況管理テンプレート
- `data/recruiting_events_template.csv`: 28卒マイページ、インターン、説明会、ES締切などの入力テンプレート
- `data/score_evidence_sources_template.csv`: IR、採用ページ、口コミ、選考体験記などスコア根拠の入力テンプレート
- `data/applicant_documents_template.csv`: ES、自己PR、ガクチカ、経歴、希望条件の入力テンプレート
- `data/ai_company_analyses_template.csv`: AI分析結果の保存テンプレート
- `scripts/build_db.py`: DB作成・CSV投入スクリプト
- `scripts/generate_initial_scores.py`: 100社候補から初期スコアを生成してDBへ反映するスクリプト
- `docs/scoring_rubric.md`: スコア項目と重みの定義
- `docs/personalization_model.md`: 企業DBと個人DBを組み合わせる設計メモ
- `planner/`: 個人プロフィールと企業DBから今週応募すべき企業TOP10を出す応募優先順位メーカー
- `visualizer/`: 100社スコアを業界マップ・企業比較・業界近接マップで見るブラウザUI

## すぐ試す

```bash
python3 scripts/build_db.py --sample
sqlite3 job_research.db "SELECT * FROM company_comparison;"
```

100社候補リストもDBに入れる場合:

```bash
python3 scripts/build_db.py --targets-csv data/target_companies_100.csv
sqlite3 job_research.db "SELECT industry, COUNT(*) FROM recruitment_targets GROUP BY industry;"
```

志向プリセットもDBに入れる場合:

```bash
python3 scripts/build_db.py --presets-csv data/preference_presets.csv
```

締切・イベント、根拠ソースをDBに入れる場合:

```bash
python3 scripts/build_db.py \
  --events-csv data/recruiting_events_template.csv \
  --sources-csv data/score_evidence_sources_template.csv
```

100社に初期スコアを付ける場合:

```bash
python3 scripts/generate_initial_scores.py
sqlite3 job_research.db "
  SELECT rt.industry, rt.company, rts.overall_score
  FROM recruitment_targets rt
  JOIN recruitment_target_scores rts ON rts.recruitment_target_id = rt.id
  ORDER BY rts.overall_score DESC, rt.priority_rank
  LIMIT 20;
"
```

## 可視化する

```bash
python3 -m http.server 8765
```

ブラウザで次を開きます。

```text
http://127.0.0.1:8765/visualizer/
```

応募優先順位メーカーを開く場合:

```text
http://127.0.0.1:8765/planner/
```

`planner/` では、プロフィール、志向プリセット、応募状況、締切、志望リストから `あなたが今週動くべき企業TOP10`、次アクション、応募ボードを表示します。Supabase設定済みの場合は、同じGoogleアカウントでスマホ/PC間の個人データ同期もできます。

可視化画面では、次を確認できます。

- 業界ごとのステータス: `優位`、`成長`、`安定`、`要精査`
- 業界近接マップ: スコア構造が近い業界を距離と線で表示。業界をクリックすると業界内企業マップを更新
- 業界内企業マップ: 選択業界の企業だけを、安定性←→成長性、働きやすさ←→キャリア資本の2軸で比較。円の大きさは業界内優位性、色は業界テーマカラーをベースにした企業別カラー
- 企業詳細: 11項目スコア、比較優位、確認したい点、28卒マイページリンク
- 志向プリセット: `総合バランス`、`高年収重視`、`成長環境重視`、`安定重視`、`ワークライフバランス重視`、`理系技術職向け`、`文系総合職向け`
- 個人データ: 志望度、スキル適合、社風適合、勤務地適合、職種適合、自己PR強度、応募ステータス、次アクション、締切、メモ
- 締切・イベント管理: 28卒マイページ、インターン、説明会、ES締切、Webテスト、面接などを企業ごとに保存
- 根拠ソース管理: スコア項目ごとにIR、採用ページ、口コミ、選考体験記、ニュースなどの根拠を保存
- 個人相性スコア: AI分析とプロフィールから算出し、必要に応じてDBへ保存可能
- MBTI補助分析: MBTIタイプ、納得度、外向志向、変化耐性、チーム志向、裁量志向、論理重視、計画志向を相性スコアに弱めに反映
- 個人スコア: `あなた向けスコア`、`内定しやすさ`、`相性` を企業データと個人データから算出
- AI分析: ES、自己PR、経歴、希望条件から強み・スキル・希望・制約を抽出し、企業ごとに `志望動機の作りやすさ`、`ES素材適合度`、`注意点`、`次アクション` を提示
- 比較テーブル: 総合点順の一覧、28卒確認済みフィルタ

## 実データを入れる流れ

1. `data/companies_template.csv` をコピーして、業界・企業マスタを入力する。
2. `data/metrics_template.csv` をコピーして、売上、利益率、採用人数、離職率、平均年収、残業時間などを入力する。
3. `data/qualitative_template.csv` を使って、社風、内定者傾向、転職理由などの定性情報を記録する。
4. 次のコマンドでDBに反映する。

```bash
python3 scripts/build_db.py \
  --companies-csv data/companies_template.csv \
  --metrics-csv data/metrics_template.csv
```

## 比較する観点

### 業界研究

- 市場規模、成長率、需要を押し上げる要因
- 規制、景気、技術変化、人口動態などの外部環境
- 主要プレイヤーとビジネスモデルの違い
- 今後伸びる領域、縮小しそうな領域

### 企業研究

- 主力事業、収益源、顧客層
- 売上成長率、営業利益率、ROE、キャッシュフロー
- 中期経営計画、投資方針、新規事業
- 競合と比べた強み・弱み

### 社風・働き方

- 意思決定の速さ
- 挑戦志向か、安定志向か
- チームワーク重視か、個人裁量重視か
- 上下関係の強さ
- ワークライフバランス
- 学習支援・育成制度

### 内定者・選考傾向

- 評価されやすい経験
- 面接で問われるテーマ
- 内定者に多い志向性
- 志望理由で見られる一貫性
- 採用難易度

### 転職者の数・理由

- 中途採用人数
- 離職率
- 退職理由のカテゴリ
- キャリア成長、報酬、上司・組織、労働時間、社風不一致などの割合
- 口コミだけでなく、有価証券報告書や人的資本開示で裏取りする

## 情報源の信頼度

`source_documents.reliability_score` は次の目安で入れます。

- `5`: 有価証券報告書、統合報告書、決算資料、官公庁統計
- `4`: 企業公式の採用ページ、中期経営計画、IR説明会資料
- `3`: 主要メディア記事、採用イベント、社員インタビュー
- `2`: 口コミサイト、個人ブログ、SNS上の複数証言
- `1`: 出所不明、単発の噂、検証前メモ

## 代表的なSQL

業界内の比較:

```sql
SELECT *
FROM company_comparison
WHERE industry = 'サンプル: ITサービス'
ORDER BY growth_potential_score DESC, stability_score DESC;
```

年収・残業・離職率の比較:

```sql
SELECT
  company,
  average_salary_thousand_yen,
  overtime_hours_monthly,
  turnover_rate_pct,
  remote_work_policy
FROM company_comparison
WHERE industry = 'サンプル: ITサービス'
ORDER BY average_salary_thousand_yen DESC;
```

社風の比較:

```sql
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
JOIN companies c ON c.id = ca.company_id;
```

## 注意

サンプルデータは実在企業の分析ではありません。実際の就活判断に使う場合は、必ず各社の最新IR、採用ページ、官公庁統計、複数の口コミ・インタビューで確認してください。

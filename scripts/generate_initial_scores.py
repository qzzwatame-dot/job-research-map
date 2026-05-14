#!/usr/bin/env python3
import csv
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGET_CSV = ROOT / "data" / "target_companies_100.csv"
OUTPUT_CSV = ROOT / "data" / "target_company_scores_initial.csv"
DB_PATH = ROOT / "job_research.db"
SCORED_DATE = "2026-05-13"
SCORE_BASIS = "initial_hypothesis"

WEIGHTS = {
    "industry_growth_score": 0.10,
    "company_strength_score": 0.13,
    "stability_score": 0.10,
    "compensation_score": 0.10,
    "career_capital_score": 0.13,
    "new_grad_access_score": 0.10,
    "culture_clarity_score": 0.07,
    "work_life_balance_score": 0.07,
    "transferability_score": 0.10,
    "disclosure_score": 0.05,
    "comparison_value_score": 0.05,
}

INDUSTRY_BASE = {
    "IT・SI・通信": {
        "industry_growth_score": 5,
        "stability_score": 4,
        "compensation_score": 4,
        "career_capital_score": 5,
        "work_life_balance_score": 3,
        "transferability_score": 5,
        "advantage": "DX需要, 技術汎用性, 採用職種の広さ",
        "caution": "配属差, プロジェクト負荷, 技術変化",
    },
    "コンサル": {
        "industry_growth_score": 5,
        "stability_score": 3,
        "compensation_score": 5,
        "career_capital_score": 5,
        "work_life_balance_score": 2,
        "transferability_score": 5,
        "advantage": "成長環境, 高待遇, 転職市場価値",
        "caution": "労働負荷, 選考難度, 適性差",
    },
    "総合商社": {
        "industry_growth_score": 4,
        "stability_score": 5,
        "compensation_score": 5,
        "career_capital_score": 5,
        "work_life_balance_score": 3,
        "transferability_score": 5,
        "advantage": "高待遇, グローバル, 事業投資経験",
        "caution": "選考難度, 配属幅, 海外勤務可能性",
    },
    "金融": {
        "industry_growth_score": 3,
        "stability_score": 5,
        "compensation_score": 4,
        "career_capital_score": 4,
        "work_life_balance_score": 3,
        "transferability_score": 4,
        "advantage": "社会インフラ性, 金融専門性, 大規模顧客基盤",
        "caution": "規制産業, 営業適性, 組織階層",
    },
    "自動車・機械・精密": {
        "industry_growth_score": 4,
        "stability_score": 4,
        "compensation_score": 4,
        "career_capital_score": 4,
        "work_life_balance_score": 3,
        "transferability_score": 4,
        "advantage": "ものづくり, グローバル, 技術蓄積",
        "caution": "景気循環, 勤務地, EV・自動化対応",
    },
    "電機・半導体": {
        "industry_growth_score": 5,
        "stability_score": 4,
        "compensation_score": 4,
        "career_capital_score": 4,
        "work_life_balance_score": 3,
        "transferability_score": 4,
        "advantage": "半導体需要, BtoB技術, グローバル",
        "caution": "市況変動, 事業再編, 技術競争",
    },
    "消費財・食品・日用品": {
        "industry_growth_score": 3,
        "stability_score": 5,
        "compensation_score": 3,
        "career_capital_score": 4,
        "work_life_balance_score": 4,
        "transferability_score": 4,
        "advantage": "ブランド, 生活密着, マーケティング経験",
        "caution": "国内市場成熟, 人気集中, 職種別採用枠",
    },
    "製薬・ヘルスケア": {
        "industry_growth_score": 4,
        "stability_score": 4,
        "compensation_score": 4,
        "career_capital_score": 4,
        "work_life_balance_score": 4,
        "transferability_score": 4,
        "advantage": "高付加価値, 研究開発, 社会貢献性",
        "caution": "研究開発リスク, 職種要件, 薬価制度",
    },
    "広告・エンタメ・メディア": {
        "industry_growth_score": 3,
        "stability_score": 3,
        "compensation_score": 4,
        "career_capital_score": 4,
        "work_life_balance_score": 2,
        "transferability_score": 4,
        "advantage": "企画力, IP・ブランド, クリエイティブ経験",
        "caution": "労働負荷, 市場構造変化, 人気集中",
    },
    "不動産・インフラ": {
        "industry_growth_score": 3,
        "stability_score": 5,
        "compensation_score": 4,
        "career_capital_score": 4,
        "work_life_balance_score": 3,
        "transferability_score": 4,
        "advantage": "資産性, 社会インフラ, 大規模案件",
        "caution": "景気・金利影響, 配属地, 規制対応",
    },
}

COMPANY_OVERRIDES = {
    "キーエンス": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "work_life_balance_score": 2, "comparison_value_score": 5},
    "ソニーグループ": {"company_strength_score": 5, "career_capital_score": 5, "culture_clarity_score": 4, "comparison_value_score": 5},
    "パナソニックグループ": {"company_strength_score": 4, "new_grad_access_score": 5, "disclosure_score": 5},
    "トヨタ自動車": {"company_strength_score": 5, "stability_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "三菱商事": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "三井物産": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "伊藤忠商事": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "アクセンチュア": {"company_strength_score": 5, "new_grad_access_score": 5, "culture_clarity_score": 4, "comparison_value_score": 5},
    "野村総合研究所": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "ベイカレント": {"company_strength_score": 4, "compensation_score": 5, "work_life_balance_score": 2, "comparison_value_score": 5},
    "NTTデータ": {"company_strength_score": 5, "stability_score": 5, "new_grad_access_score": 5, "comparison_value_score": 5},
    "日立製作所": {"company_strength_score": 5, "stability_score": 5, "disclosure_score": 5, "comparison_value_score": 5},
    "三井住友銀行": {"company_strength_score": 5, "stability_score": 5, "new_grad_access_score": 5, "comparison_value_score": 5},
    "三菱UFJ銀行": {"company_strength_score": 5, "stability_score": 5, "new_grad_access_score": 5, "comparison_value_score": 5},
    "東京海上日動火災保険": {"company_strength_score": 5, "stability_score": 5, "compensation_score": 5, "comparison_value_score": 5},
    "任天堂": {"company_strength_score": 5, "stability_score": 5, "compensation_score": 5, "work_life_balance_score": 4, "comparison_value_score": 5},
    "東京エレクトロン": {"company_strength_score": 5, "industry_growth_score": 5, "compensation_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "レーザーテック": {"company_strength_score": 5, "industry_growth_score": 5, "compensation_score": 5, "stability_score": 3, "new_grad_access_score": 3, "comparison_value_score": 5},
    "武田薬品工業": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "第一三共": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "花王": {"company_strength_score": 5, "stability_score": 5, "work_life_balance_score": 4, "comparison_value_score": 5},
    "資生堂": {"company_strength_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "サントリーホールディングス": {"company_strength_score": 5, "stability_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "電通": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "work_life_balance_score": 2, "comparison_value_score": 5},
    "博報堂DYグループ": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "work_life_balance_score": 2, "comparison_value_score": 5},
    "三井不動産": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
    "三菱地所": {"company_strength_score": 5, "compensation_score": 5, "career_capital_score": 5, "comparison_value_score": 5},
}


def baseline(row):
    base = {
        "company_strength_score": 4,
        "new_grad_access_score": 4,
        "culture_clarity_score": 3,
        "disclosure_score": 4,
        "comparison_value_score": 4,
    }
    base.update(INDUSTRY_BASE[row["industry"]])
    if row["mypage_2028_status"] == "確認済み":
        base["new_grad_access_score"] = 5
        base["culture_clarity_score"] = max(base["culture_clarity_score"], 4)
    if row["company"] in COMPANY_OVERRIDES:
        base.update(COMPANY_OVERRIDES[row["company"]])
    return base


def overall(scores):
    return round(sum(scores[key] * weight for key, weight in WEIGHTS.items()), 2)


def notes(row, scores):
    strong = [key.replace("_score", "") for key in WEIGHTS if scores[key] >= 5]
    weak = [key.replace("_score", "") for key in WEIGHTS if scores[key] <= 2]
    note = "初期仮説。"
    if strong:
        note += " 強み: " + ", ".join(strong[:4]) + "。"
    if weak:
        note += " 要確認: " + ", ".join(weak[:3]) + "。"
    if row["mypage_2028_status"] == "要確認":
        note += " 新卒マイページは公式確認待ち。"
    return note


def write_csv(rows):
    fields = [
        "priority_rank",
        "industry",
        "company",
        "scored_date",
        "score_basis",
        *WEIGHTS.keys(),
        "overall_score",
        "advantage_tags",
        "caution_tags",
        "scoring_notes",
    ]
    with OUTPUT_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def import_to_db(rows):
    conn = sqlite3.connect(DB_PATH)
    try:
        target_ids = {
            (row[0], row[1]): row[2]
            for row in conn.execute("SELECT priority_rank, company, id FROM recruitment_targets")
        }
        for row in rows:
            target_id = target_ids.get((int(row["priority_rank"]), row["company"]))
            if target_id is None:
                continue
            columns = [
                "recruitment_target_id",
                "scored_date",
                "score_basis",
                *WEIGHTS.keys(),
                "overall_score",
                "advantage_tags",
                "caution_tags",
                "scoring_notes",
            ]
            values = [target_id, row["scored_date"], row["score_basis"]]
            values.extend(int(row[key]) for key in WEIGHTS)
            values.extend([float(row["overall_score"]), row["advantage_tags"], row["caution_tags"], row["scoring_notes"]])
            placeholders = ", ".join("?" for _ in columns)
            update_clause = ", ".join(f"{col} = excluded.{col}" for col in columns[3:])
            conn.execute(
                f"""
                INSERT INTO recruitment_target_scores ({", ".join(columns)})
                VALUES ({placeholders})
                ON CONFLICT(recruitment_target_id, scored_date, score_basis)
                DO UPDATE SET {update_clause}, updated_at = CURRENT_TIMESTAMP
                """,
                values,
            )
        conn.commit()
    finally:
        conn.close()


def main():
    scored_rows = []
    with TARGET_CSV.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            scores = baseline(row)
            base = INDUSTRY_BASE[row["industry"]]
            output_scores = {key: scores[key] for key in WEIGHTS}
            scored_rows.append({
                "priority_rank": row["priority_rank"],
                "industry": row["industry"],
                "company": row["company"],
                "scored_date": SCORED_DATE,
                "score_basis": SCORE_BASIS,
                **output_scores,
                "overall_score": overall(scores),
                "advantage_tags": base["advantage"],
                "caution_tags": base["caution"],
                "scoring_notes": notes(row, scores),
            })
    write_csv(scored_rows)
    import_to_db(scored_rows)
    print(f"Wrote {len(scored_rows)} rows: {OUTPUT_CSV}")


if __name__ == "__main__":
    main()

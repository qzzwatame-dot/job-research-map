#!/usr/bin/env python3
import argparse
import csv
import sqlite3
from pathlib import Path
from typing import Optional


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "job_research.db"


def run_sql_file(conn: sqlite3.Connection, path: Path) -> None:
    conn.executescript(path.read_text(encoding="utf-8"))


def migrate_schema(conn: sqlite3.Connection) -> None:
    ensure_columns(
        conn,
        "student_company_preferences",
        {
            "major_fit_score": "INTEGER CHECK (major_fit_score BETWEEN 1 AND 5)",
            "work_style_fit_score": "INTEGER CHECK (work_style_fit_score BETWEEN 1 AND 5)",
            "salary_fit_score": "INTEGER CHECK (salary_fit_score BETWEEN 1 AND 5)",
            "global_fit_score": "INTEGER CHECK (global_fit_score BETWEEN 1 AND 5)",
        },
    )
    ensure_columns(
        conn,
        "student_profiles",
        {
            "mbti_type": "TEXT",
            "mbti_confidence_score": "INTEGER CHECK (mbti_confidence_score BETWEEN 1 AND 5)",
            "extroversion_preference_score": "INTEGER CHECK (extroversion_preference_score BETWEEN 1 AND 5)",
            "change_tolerance_score": "INTEGER CHECK (change_tolerance_score BETWEEN 1 AND 5)",
            "team_orientation_score": "INTEGER CHECK (team_orientation_score BETWEEN 1 AND 5)",
            "autonomy_preference_score": "INTEGER CHECK (autonomy_preference_score BETWEEN 1 AND 5)",
            "logic_orientation_score": "INTEGER CHECK (logic_orientation_score BETWEEN 1 AND 5)",
            "planning_orientation_score": "INTEGER CHECK (planning_orientation_score BETWEEN 1 AND 5)",
            "es_draft": "TEXT",
            "experience_summary": "TEXT",
            "condition_summary": "TEXT",
        },
    )


def ensure_columns(conn: sqlite3.Connection, table: str, columns: dict[str, str]) -> None:
    existing = {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}
    for name, definition in columns.items():
        if name not in existing:
            conn.execute(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")


def ensure_industry(conn: sqlite3.Connection, name: str) -> int:
    conn.execute("INSERT OR IGNORE INTO industries (name) VALUES (?)", (name,))
    row = conn.execute("SELECT id FROM industries WHERE name = ?", (name,)).fetchone()
    return int(row[0])


def import_companies(conn: sqlite3.Connection, csv_path: Path) -> None:
    with csv_path.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if not row.get("name") or row["name"] == "企業名":
                continue
            industry_id = ensure_industry(conn, row["industry"])
            conn.execute(
                """
                INSERT INTO companies (
                  industry_id, name, legal_name, ticker, listing_market, website_url,
                  headquarters, founded_year, employee_count, business_summary,
                  strategy_summary, outlook_summary, overall_status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(industry_id, name) DO UPDATE SET
                  legal_name = excluded.legal_name,
                  ticker = excluded.ticker,
                  listing_market = excluded.listing_market,
                  website_url = excluded.website_url,
                  headquarters = excluded.headquarters,
                  founded_year = excluded.founded_year,
                  employee_count = excluded.employee_count,
                  business_summary = excluded.business_summary,
                  strategy_summary = excluded.strategy_summary,
                  outlook_summary = excluded.outlook_summary,
                  overall_status = excluded.overall_status,
                  updated_at = CURRENT_TIMESTAMP
                """,
                (
                    industry_id,
                    row["name"],
                    row.get("legal_name"),
                    row.get("ticker"),
                    row.get("listing_market"),
                    row.get("website_url"),
                    row.get("headquarters"),
                    nullable_int(row.get("founded_year")),
                    nullable_int(row.get("employee_count")),
                    row.get("business_summary"),
                    row.get("strategy_summary"),
                    row.get("outlook_summary"),
                    row.get("overall_status"),
                ),
            )


def import_metrics(conn: sqlite3.Connection, csv_path: Path) -> None:
    with csv_path.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if not row.get("company") or row["company"] == "企業名":
                continue
            company_id = get_company_id(conn, row["company"])
            fiscal_year = nullable_int(row.get("fiscal_year"))
            if company_id is None or fiscal_year is None:
                continue
            conn.execute(
                """
                INSERT INTO financial_metrics (
                  company_id, fiscal_year, revenue_million_yen,
                  operating_income_million_yen, net_income_million_yen,
                  operating_margin_pct, revenue_growth_pct, roe_pct
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(company_id, fiscal_year) DO UPDATE SET
                  revenue_million_yen = excluded.revenue_million_yen,
                  operating_income_million_yen = excluded.operating_income_million_yen,
                  net_income_million_yen = excluded.net_income_million_yen,
                  operating_margin_pct = excluded.operating_margin_pct,
                  revenue_growth_pct = excluded.revenue_growth_pct,
                  roe_pct = excluded.roe_pct
                """,
                (
                    company_id,
                    fiscal_year,
                    nullable_float(row.get("revenue_million_yen")),
                    nullable_float(row.get("operating_income_million_yen")),
                    nullable_float(row.get("net_income_million_yen")),
                    nullable_float(row.get("operating_margin_pct")),
                    nullable_float(row.get("revenue_growth_pct")),
                    nullable_float(row.get("roe_pct")),
                ),
            )
            conn.execute(
                """
                INSERT INTO hiring_metrics (
                  company_id, year, new_graduate_hires, mid_career_hires,
                  turnover_rate_pct, average_age, average_tenure_years,
                  average_salary_thousand_yen, overtime_hours_monthly,
                  paid_leave_usage_pct, remote_work_policy
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(company_id, year) DO UPDATE SET
                  new_graduate_hires = excluded.new_graduate_hires,
                  mid_career_hires = excluded.mid_career_hires,
                  turnover_rate_pct = excluded.turnover_rate_pct,
                  average_age = excluded.average_age,
                  average_tenure_years = excluded.average_tenure_years,
                  average_salary_thousand_yen = excluded.average_salary_thousand_yen,
                  overtime_hours_monthly = excluded.overtime_hours_monthly,
                  paid_leave_usage_pct = excluded.paid_leave_usage_pct,
                  remote_work_policy = excluded.remote_work_policy
                """,
                (
                    company_id,
                    fiscal_year,
                    nullable_int(row.get("new_graduate_hires")),
                    nullable_int(row.get("mid_career_hires")),
                    nullable_float(row.get("turnover_rate_pct")),
                    nullable_float(row.get("average_age")),
                    nullable_float(row.get("average_tenure_years")),
                    nullable_float(row.get("average_salary_thousand_yen")),
                    nullable_float(row.get("overtime_hours_monthly")),
                    nullable_float(row.get("paid_leave_usage_pct")),
                    row.get("remote_work_policy"),
                ),
            )


def import_recruitment_targets(conn: sqlite3.Connection, csv_path: Path) -> None:
    with csv_path.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if not row.get("priority_rank") or not row.get("company"):
                continue
            conn.execute(
                """
                INSERT INTO recruitment_targets (
                  priority_rank, industry, company, selection_reason,
                  new_grad_hiring_status, mypage_2028_status, mypage_url, notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(priority_rank) DO UPDATE SET
                  industry = excluded.industry,
                  company = excluded.company,
                  selection_reason = excluded.selection_reason,
                  new_grad_hiring_status = excluded.new_grad_hiring_status,
                  mypage_2028_status = excluded.mypage_2028_status,
                  mypage_url = excluded.mypage_url,
                  notes = excluded.notes,
                  updated_at = CURRENT_TIMESTAMP
                """,
                (
                    nullable_int(row.get("priority_rank")),
                    row.get("industry"),
                    row.get("company"),
                    row.get("selection_reason"),
                    row.get("new_grad_hiring_status"),
                    row.get("mypage_2028_status"),
                    row.get("mypage_url"),
                    row.get("notes"),
                ),
            )


def import_preference_presets(conn: sqlite3.Connection, csv_path: Path) -> None:
    with csv_path.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if not row.get("preset_name"):
                continue
            conn.execute(
                """
                INSERT INTO preference_presets (
                  preset_name, description, industry_growth_weight,
                  company_strength_weight, stability_weight, compensation_weight,
                  career_capital_weight, new_grad_access_weight, culture_clarity_weight,
                  work_life_balance_weight, transferability_weight, disclosure_weight,
                  comparison_value_weight
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(preset_name) DO UPDATE SET
                  description = excluded.description,
                  industry_growth_weight = excluded.industry_growth_weight,
                  company_strength_weight = excluded.company_strength_weight,
                  stability_weight = excluded.stability_weight,
                  compensation_weight = excluded.compensation_weight,
                  career_capital_weight = excluded.career_capital_weight,
                  new_grad_access_weight = excluded.new_grad_access_weight,
                  culture_clarity_weight = excluded.culture_clarity_weight,
                  work_life_balance_weight = excluded.work_life_balance_weight,
                  transferability_weight = excluded.transferability_weight,
                  disclosure_weight = excluded.disclosure_weight,
                  comparison_value_weight = excluded.comparison_value_weight,
                  updated_at = CURRENT_TIMESTAMP
                """,
                (
                    row.get("preset_name"),
                    row.get("description"),
                    nullable_float(row.get("industry_growth_weight")),
                    nullable_float(row.get("company_strength_weight")),
                    nullable_float(row.get("stability_weight")),
                    nullable_float(row.get("compensation_weight")),
                    nullable_float(row.get("career_capital_weight")),
                    nullable_float(row.get("new_grad_access_weight")),
                    nullable_float(row.get("culture_clarity_weight")),
                    nullable_float(row.get("work_life_balance_weight")),
                    nullable_float(row.get("transferability_weight")),
                    nullable_float(row.get("disclosure_weight")),
                    nullable_float(row.get("comparison_value_weight")),
                ),
            )


def import_recruiting_events(conn: sqlite3.Connection, csv_path: Path) -> None:
    with csv_path.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if not row.get("company") or not row.get("title"):
                continue
            target_id = get_recruitment_target_id(conn, row["company"])
            if target_id is None:
                continue
            conn.execute(
                """
                INSERT INTO recruiting_events (
                  recruitment_target_id, event_type, title, event_date, deadline_date,
                  url, status, source_url, notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    target_id,
                    row.get("event_type") or "その他",
                    row.get("title"),
                    row.get("event_date"),
                    row.get("deadline_date"),
                    row.get("url"),
                    row.get("status") or "未確認",
                    row.get("source_url"),
                    row.get("notes"),
                ),
            )


def import_score_evidence_sources(conn: sqlite3.Connection, csv_path: Path) -> None:
    conn.execute("DELETE FROM score_evidence_sources")
    with csv_path.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if not row.get("company") or not row.get("title"):
                continue
            target_id = get_recruitment_target_id(conn, row["company"])
            if target_id is None:
                continue
            conn.execute(
                """
                INSERT INTO score_evidence_sources (
                  recruitment_target_id, score_key, source_type, title, url,
                  reliability_score, evidence_summary, checked_date
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    target_id,
                    row.get("score_key"),
                    row.get("source_type") or "その他",
                    row.get("title"),
                    row.get("url"),
                    nullable_int(row.get("reliability_score")) or 3,
                    row.get("evidence_summary"),
                    row.get("checked_date"),
                ),
            )


def get_company_id(conn: sqlite3.Connection, name: str) -> Optional[int]:
    row = conn.execute("SELECT id FROM companies WHERE name = ?", (name,)).fetchone()
    return int(row[0]) if row else None


def get_recruitment_target_id(conn: sqlite3.Connection, company: str) -> Optional[int]:
    row = conn.execute("SELECT id FROM recruitment_targets WHERE company = ?", (company,)).fetchone()
    return int(row[0]) if row else None


def nullable_int(value: Optional[str]) -> Optional[int]:
    return int(value) if value not in (None, "") else None


def nullable_float(value: Optional[str]) -> Optional[float]:
    return float(value) if value not in (None, "") else None


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the job research SQLite database.")
    parser.add_argument("--db", default=str(DEFAULT_DB), help="Output SQLite DB path.")
    parser.add_argument("--sample", action="store_true", help="Load sample data.")
    parser.add_argument("--companies-csv", help="Import company master CSV.")
    parser.add_argument("--metrics-csv", help="Import financial/hiring metrics CSV.")
    parser.add_argument("--targets-csv", help="Import recruitment target company CSV.")
    parser.add_argument("--presets-csv", help="Import preference preset CSV.")
    parser.add_argument("--events-csv", help="Import recruiting event CSV.")
    parser.add_argument("--sources-csv", help="Import score evidence source CSV.")
    args = parser.parse_args()

    db_path = Path(args.db)
    conn = sqlite3.connect(db_path)
    try:
        run_sql_file(conn, ROOT / "sql" / "schema.sql")
        migrate_schema(conn)
        if args.sample:
            run_sql_file(conn, ROOT / "sql" / "seed_sample.sql")
        if args.companies_csv:
            import_companies(conn, Path(args.companies_csv))
        if args.metrics_csv:
            import_metrics(conn, Path(args.metrics_csv))
        if args.targets_csv:
            import_recruitment_targets(conn, Path(args.targets_csv))
        if args.presets_csv:
            import_preference_presets(conn, Path(args.presets_csv))
        if args.events_csv:
            import_recruiting_events(conn, Path(args.events_csv))
        if args.sources_csv:
            import_score_evidence_sources(conn, Path(args.sources_csv))
        conn.commit()
    finally:
        conn.close()

    print(f"Built database: {db_path}")


if __name__ == "__main__":
    main()

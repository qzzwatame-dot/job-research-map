#!/usr/bin/env python3
import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGET_CSV = ROOT / "data" / "target_companies_100.csv"
OUTPUT_CSV = ROOT / "data" / "score_evidence_sources.csv"
CHECKED_DATE = "2026-05-14"


def source_rows(company):
    has_url = bool(company["mypage_url"])
    yield {
        "company": company["company"],
        "score_key": "new_grad_access_score",
        "source_type": "採用ページ",
        "title": "新卒採用ページ・マイページ",
        "url": company["mypage_url"],
        "reliability_score": 4 if has_url else 3,
        "evidence_summary": "新卒採用導線と募集職種を確認。URL未登録の場合は公式採用サイトで追加確認が必要。",
        "checked_date": CHECKED_DATE,
    }
    yield {
        "company": company["company"],
        "score_key": "disclosure_score",
        "source_type": "IR",
        "title": "IR・統合報告書・有価証券報告書",
        "url": "",
        "reliability_score": 4,
        "evidence_summary": "業績、事業リスク、人的資本、平均年収、採用関連開示を確認する主要ソース。",
        "checked_date": CHECKED_DATE,
    }
    yield {
        "company": company["company"],
        "score_key": "culture_clarity_score",
        "source_type": "選考体験記",
        "title": "選考体験記・口コミ確認",
        "url": "",
        "reliability_score": 2,
        "evidence_summary": "社風、選考フロー、面接傾向、働き方の補助ソース。複数サイトで裏取り推奨。",
        "checked_date": CHECKED_DATE,
    }


def main():
    fields = ["company", "score_key", "source_type", "title", "url", "reliability_score", "evidence_summary", "checked_date"]
    rows = []
    with TARGET_CSV.open(newline="", encoding="utf-8") as f:
        for company in csv.DictReader(f):
            rows.extend(source_rows(company))
    with OUTPUT_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} rows: {OUTPUT_CSV}")


if __name__ == "__main__":
    main()

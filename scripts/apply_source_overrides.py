#!/usr/bin/env python3
import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGET_CSV = ROOT / "data" / "target_companies_100.csv"
SOURCES_CSV = ROOT / "data" / "score_evidence_sources.csv"
OVERRIDE_PATTERN = "source_link_overrides_batch*.csv"


def read_rows(path):
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f)), csv.DictReader(path.open(newline="", encoding="utf-8")).fieldnames


def write_rows(path, rows, fields):
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main():
    target_rows, target_fields = read_rows(TARGET_CSV)
    source_rows, source_fields = read_rows(SOURCES_CSV)
    overrides = []
    for path in sorted((ROOT / "data").glob(OVERRIDE_PATTERN)):
        rows, _ = read_rows(path)
        overrides.extend(rows)
    by_company = {row["company"]: row for row in overrides}

    for row in target_rows:
        override = by_company.get(row["company"])
        if not override:
            continue
        row["mypage_url"] = override["recruit_url"]
        row["mypage_2028_status"] = override["recruit_status"]
        row["notes"] = override["recruit_summary"]

    for row in source_rows:
        override = by_company.get(row["company"])
        if not override:
            continue
        if row["source_type"] == "採用ページ" and row["score_key"] == "new_grad_access_score":
            row["title"] = override["recruit_title"]
            row["url"] = override["recruit_url"]
            row["reliability_score"] = "5" if override["recruit_status"] == "確認済み" else "4"
            row["evidence_summary"] = override["recruit_summary"]
        elif row["source_type"] == "IR" and row["score_key"] == "disclosure_score":
            row["title"] = override["ir_title"]
            row["url"] = override["ir_url"]
            row["reliability_score"] = "5"
            row["evidence_summary"] = override["ir_summary"]

    write_rows(TARGET_CSV, target_rows, target_fields)
    write_rows(SOURCES_CSV, source_rows, source_fields)
    print(f"Applied {len(overrides)} source link overrides")


if __name__ == "__main__":
    main()

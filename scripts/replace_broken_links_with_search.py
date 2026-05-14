import csv
import json
from pathlib import Path
from urllib.parse import quote_plus

ROOT = Path(__file__).resolve().parents[1]
TARGETS_CSV = ROOT / "data" / "target_companies_100.csv"
SOURCES_CSV = ROOT / "data" / "score_evidence_sources.csv"
REPORT_JSON = ROOT / "data" / "link_check_report.json"


def read_csv(path):
    with path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader), reader.fieldnames


def write_csv(path, rows, fieldnames):
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def search_url(company, source_type):
    if source_type in {"新卒マイページ", "採用ページ"}:
        query = f"{company} 新卒採用 マイページ"
    elif source_type == "IR":
        query = f"{company} IR 統合報告書 2025"
    else:
        query = f"{company} {source_type} 公式"
    return f"https://www.google.com/search?q={quote_plus(query)}"


def source_replacement(source_type):
    if source_type in {"新卒マイページ", "採用ページ"}:
        return {
            "title": "公式新卒採用情報検索",
            "reliability_score": "2",
            "evidence_summary": "リンク切れ検出のため、企業名と新卒採用キーワードの検索導線に更新。公式ページを確認後、実URLへ差し替え推奨。",
        }
    if source_type == "IR":
        return {
            "title": "IR/統合報告書検索",
            "reliability_score": "2",
            "evidence_summary": "リンク切れ検出のため、企業名とIR/統合報告書キーワードの検索導線に更新。公式IRページを確認後、実URLへ差し替え推奨。",
        }
    return {
        "title": f"{source_type}検索",
        "reliability_score": "2",
        "evidence_summary": "リンク切れ検出のため、検索導線に更新。公式情報を確認後、実URLへ差し替え推奨。",
    }


def main():
    report = json.loads(REPORT_JSON.read_text(encoding="utf-8"))
    broken = [row for row in report if not row.get("ok")]
    broken_targets = {
        (row["company"], row["url"])
        for row in broken
        if row["dataset"] == "target_companies"
    }
    broken_sources = {
        (row["company"], row["source_type"], row["title"], row["url"])
        for row in broken
        if row["dataset"] == "score_evidence_sources"
    }

    target_rows, target_fields = read_csv(TARGETS_CSV)
    target_updates = 0
    for row in target_rows:
        key = (row["company"], row.get("mypage_url", ""))
        if key not in broken_targets:
            continue
        row["mypage_url"] = search_url(row["company"], "新卒マイページ")
        row["mypage_2028_status"] = "要確認"
        row["notes"] = "リンク切れ検出のため、公式新卒採用情報の検索導線に更新。実URL確認後に差し替え推奨"
        target_updates += 1

    source_rows, source_fields = read_csv(SOURCES_CSV)
    source_updates = 0
    for row in source_rows:
        key = (row["company"], row["source_type"], row["title"], row.get("url", ""))
        if key not in broken_sources:
            continue
        replacement = source_replacement(row["source_type"])
        row["title"] = replacement["title"]
        row["url"] = search_url(row["company"], row["source_type"])
        row["reliability_score"] = replacement["reliability_score"]
        row["evidence_summary"] = replacement["evidence_summary"]
        source_updates += 1

    write_csv(TARGETS_CSV, target_rows, target_fields)
    write_csv(SOURCES_CSV, source_rows, source_fields)
    print(f"target_updates={target_updates} source_updates={source_updates} broken={len(broken)}")


if __name__ == "__main__":
    main()

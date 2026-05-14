import csv
import json
import ssl
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
TARGETS_CSV = ROOT / "data" / "target_companies_100.csv"
SOURCES_CSV = ROOT / "data" / "score_evidence_sources.csv"
REPORT_JSON = ROOT / "data" / "link_check_report.json"
REPORT_CSV = ROOT / "data" / "link_check_issues.csv"

TIMEOUT_SECONDS = 12
USER_AGENT = "Mozilla/5.0 (compatible; JobResearchMapLinkChecker/1.0)"


def normalize_url(url):
    url = (url or "").strip()
    if not url:
        return ""
    parsed = urlparse(url)
    if not parsed.scheme:
        return f"https://{url}"
    return url


def read_links():
    links = []
    seen = set()
    with TARGETS_CSV.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            url = normalize_url(row.get("mypage_url"))
            if not url:
                continue
            key = ("target", row["company"], "新卒マイページ", url)
            if key not in seen:
                links.append({
                    "dataset": "target_companies",
                    "company": row["company"],
                    "source_type": "新卒マイページ",
                    "title": "企業マイページ/採用ページ",
                    "url": url,
                })
                seen.add(key)

    with SOURCES_CSV.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            url = normalize_url(row.get("url"))
            if not url:
                continue
            key = ("source", row["company"], row["source_type"], row["title"], url)
            if key not in seen:
                links.append({
                    "dataset": "score_evidence_sources",
                    "company": row["company"],
                    "source_type": row["source_type"],
                    "title": row["title"],
                    "url": url,
                })
                seen.add(key)
    return links


def request_once(url, method):
    req = Request(url, method=method, headers={"User-Agent": USER_AGENT})
    context = ssl.create_default_context()
    with urlopen(req, timeout=TIMEOUT_SECONDS, context=context) as res:
        return {
            "ok": 200 <= res.status < 400,
            "status": res.status,
            "final_url": res.geturl(),
            "reason": "",
        }


def check_link(link):
    url = link["url"]
    try:
        result = request_once(url, "HEAD")
    except HTTPError as e:
        if e.code in (403, 405, 406):
            try:
                result = request_once(url, "GET")
            except HTTPError as get_e:
                result = {
                    "ok": 200 <= get_e.code < 400 or get_e.code in (401, 403),
                    "status": get_e.code,
                    "final_url": get_e.geturl() if hasattr(get_e, "geturl") else url,
                    "reason": f"HTTP {get_e.code}",
                }
            except (URLError, TimeoutError, ssl.SSLError, OSError) as get_e:
                result = {"ok": False, "status": "", "final_url": url, "reason": str(get_e)}
        else:
            result = {
                "ok": 200 <= e.code < 400 or e.code in (401, 403),
                "status": e.code,
                "final_url": e.geturl() if hasattr(e, "geturl") else url,
                "reason": f"HTTP {e.code}",
            }
    except (URLError, TimeoutError, ssl.SSLError, OSError) as e:
        result = {"ok": False, "status": "", "final_url": url, "reason": str(e)}

    return {**link, **result}


def write_reports(results):
    REPORT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    issue_rows = [row for row in results if not row["ok"]]
    fields = ["company", "source_type", "title", "url", "status", "reason", "final_url", "dataset"]
    with REPORT_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in issue_rows:
            writer.writerow({field: row.get(field, "") for field in fields})
    return issue_rows


def main():
    links = read_links()
    results = []
    with ThreadPoolExecutor(max_workers=16) as executor:
        future_map = {executor.submit(check_link, link): link for link in links}
        for future in as_completed(future_map):
            result = future.result()
            results.append(result)
            print(
                f"{len(results):03}/{len(links)} "
                f"{'OK' if result['ok'] else 'NG'} "
                f"{result.get('status', '')} {result['company']} {result['source_type']}",
                flush=True,
            )

    results.sort(key=lambda row: (row["company"], row["source_type"], row["title"]))
    issue_rows = write_reports(results)
    ok_count = sum(1 for row in results if row["ok"])
    print(f"checked={len(results)} ok={ok_count} issues={len(issue_rows)}")
    return 1 if issue_rows else 0


if __name__ == "__main__":
    sys.exit(main())

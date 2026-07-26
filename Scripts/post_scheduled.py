"""Post today's scheduled ZHELEz19 Telegram post, if any and not already posted.

Run from repo root: python3 Scripts/post_scheduled.py [YYYY-MM-DD]
If no date is given, uses today's UTC date. Reads/writes Scripts/posts/schedule.json.
Requires TELEGRAM_BOT_TOKEN in the environment (GitHub Actions secret). Chat is
always the public channel @ZHELEz19 (not a secret, safe to hardcode).

Exit codes: 0 = nothing to do or posted successfully, 1 = today's post exists but
sending failed (so CI shows red and the failure isn't silent, unlike the previous
cloud-routine attempts).
"""
import json
import os
import sys
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

CHAT_ID = "@ZHELEz19"
SCHEDULE_PATH = Path(__file__).resolve().parent / "posts" / "schedule.json"


def telegram_call(method: str, fields: dict) -> dict:
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = urllib.parse.urlencode(fields).encode("utf-8")
    req = urllib.request.Request(url, data=data)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> int:
    today = sys.argv[1] if len(sys.argv) > 1 else datetime.now(timezone.utc).strftime("%Y-%m-%d")
    print(f"[post_scheduled] checking schedule for {today}")

    schedule = json.loads(SCHEDULE_PATH.read_text(encoding="utf-8"))
    entry = next((p for p in schedule["posts"] if p["date"] == today), None)

    if entry is None:
        print(f"[post_scheduled] no entry for {today} — nothing to post today, exiting cleanly")
        return 0

    if entry.get("posted"):
        print(f"[post_scheduled] {today} ({entry['theme']}) already posted (message_id={entry.get('message_id')}) — skipping")
        return 0

    print(f"[post_scheduled] posting {today}: {entry['theme']}")

    try:
        if entry.get("photo_file_id"):
            result = telegram_call("sendPhoto", {
                "chat_id": CHAT_ID,
                "photo": entry["photo_file_id"],
                "caption": entry["caption"],
            })
        else:
            result = telegram_call("sendMessage", {
                "chat_id": CHAT_ID,
                "text": entry["caption"],
            })
    except Exception as exc:  # network error, HTTP error, etc. — fail loudly
        print(f"[post_scheduled] ERROR calling Telegram API: {exc}")
        return 1

    if not result.get("ok"):
        print(f"[post_scheduled] ERROR Telegram API returned failure: {json.dumps(result)}")
        return 1

    message_id = result["result"]["message_id"]
    print(f"[post_scheduled] SUCCESS — message_id={message_id}")

    entry["posted"] = True
    entry["message_id"] = message_id
    entry["posted_at_utc"] = datetime.now(timezone.utc).isoformat()
    SCHEDULE_PATH.write_text(json.dumps(schedule, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())

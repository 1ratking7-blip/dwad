"""Post one real news item from a rotating set of RSS feeds to @ZHELEz19.

Fallback for days with no evergreen entry in Scripts/posts/schedule.json (see
post_scheduled.py + telegram-daily-post.yml, which only runs this when there
was NO entry for today at all — never on top of an evergreen post, to respect
the one-post-per-day rule).

No AI/LLM involved on purpose (no paid API key available) — this is a plain
templated relay of a real, unedited headline + excerpt + link from the source
feed, not an "analysis" or personal take. Honest about what it is rather than
faking an editorial voice it can't actually have.

Run from repo root: python3 Scripts/post_rss_news.py
Requires TELEGRAM_BOT_TOKEN in the environment. Reads/writes
Scripts/posts/rss_seen.json to avoid ever reposting the same article.

Exit codes: 0 = posted or nothing new anywhere (no-op), 1 = a real send failed.
"""
import html
import json
import os
import re
import sys
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

CHAT_ID = "@ZHELEz19"
SEEN_PATH = Path(__file__).resolve().parent / "posts" / "rss_seen.json"
USER_AGENT = "Mozilla/5.0 (compatible; ZHELEZObot/1.0)"

# Rotated by day-of-year so the channel doesn't post the same category two
# days running. Each entry: (key, feed_url, emoji, hashtags).
CATEGORIES = [
    ("crypto", "https://cointelegraph.com/rss", "📰", "#Крипто #ZHELEZO #Новости"),
    ("esports", "https://dotesports.com/feed", "🎮", "#Киберспорт #ZHELEZO #Гейминг"),
    ("football", "https://feeds.bbci.co.uk/sport/football/rss.xml", "⚽", "#Футбол #ZHELEZO #Спорт"),
]

TAG_RE = re.compile(r"<[^>]+>")
IMG_SRC_RE = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.IGNORECASE)


def load_seen() -> set:
    if not SEEN_PATH.exists():
        return set()
    return set(json.loads(SEEN_PATH.read_text(encoding="utf-8")))


def save_seen(seen: set) -> None:
    SEEN_PATH.write_text(json.dumps(sorted(seen), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def fetch_feed(url: str) -> ET.Element:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return ET.fromstring(resp.read())


def clean_text(raw: str, limit: int = 280) -> str:
    text = html.unescape(TAG_RE.sub(" ", raw or ""))
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        text = text[:limit].rsplit(" ", 1)[0] + "…"
    return text


def local_tag(elem: ET.Element) -> str:
    return elem.tag.split("}")[-1]


def find_image(item: ET.Element):
    for child in item:
        tag = local_tag(child)
        if tag == "enclosure" and (child.get("type") or "").startswith("image"):
            return child.get("url")
        if tag == "content" and child.get("url"):  # media:content
            return child.get("url")
    for tag in ("encoded", "description"):
        for child in item:
            if local_tag(child) == tag and child.text:
                m = IMG_SRC_RE.search(child.text)
                if m:
                    return m.group(1)
    return None


def telegram_call(method: str, fields: dict) -> dict:
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = urllib.parse.urlencode(fields).encode("utf-8")
    req = urllib.request.Request(url, data=data)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def pick_article(seen: set):
    """Try today's rotated category first, then the others, so a quiet feed
    on one topic doesn't cause a silent no-op day if another has fresh news."""
    day_index = datetime.now(timezone.utc).timetuple().tm_yday
    ordered = CATEGORIES[day_index % len(CATEGORIES):] + CATEGORIES[:day_index % len(CATEGORIES)]

    for key, feed_url, emoji, hashtags in ordered:
        try:
            root = fetch_feed(feed_url)
        except Exception as exc:
            print(f"[post_rss_news] WARN could not fetch {key} feed ({feed_url}): {exc}")
            continue

        for item in root.findall(".//item"):
            link = (item.findtext("link") or "").strip()
            guid = (item.findtext("guid") or link).strip()
            if not link or guid in seen:
                continue
            title = clean_text(item.findtext("title") or "", limit=200)
            desc = clean_text(item.findtext("description") or "", limit=280)
            image = find_image(item)
            return {"key": key, "emoji": emoji, "hashtags": hashtags, "title": title,
                    "desc": desc, "link": link, "guid": guid, "image": image}
    return None


def main() -> int:
    seen = load_seen()
    article = pick_article(seen)

    if article is None:
        print("[post_rss_news] no unseen article found in any feed — nothing to post, exiting cleanly")
        return 0

    caption_parts = [f"{article['emoji']} {article['title']}"]
    if article["desc"]:
        caption_parts.append(article["desc"])
    caption_parts.append(f"Читать полностью: {article['link']}")
    caption_parts.append(article["hashtags"])
    caption = "\n\n".join(caption_parts)

    print(f"[post_rss_news] posting [{article['key']}]: {article['title']}")

    try:
        if article["image"]:
            result = telegram_call("sendPhoto", {"chat_id": CHAT_ID, "photo": article["image"], "caption": caption})
            if not result.get("ok"):
                # Some external images fail Telegram's fetch — fall back to text-only rather than failing the run.
                print(f"[post_rss_news] sendPhoto failed ({result}), retrying as text")
                result = telegram_call("sendMessage", {"chat_id": CHAT_ID, "text": caption})
        else:
            result = telegram_call("sendMessage", {"chat_id": CHAT_ID, "text": caption})
    except Exception as exc:
        print(f"[post_rss_news] ERROR calling Telegram API: {exc}")
        return 1

    if not result.get("ok"):
        print(f"[post_rss_news] ERROR Telegram API returned failure: {json.dumps(result)}")
        return 1

    print(f"[post_rss_news] SUCCESS — message_id={result['result']['message_id']}")
    seen.add(article["guid"])
    save_seen(seen)
    return 0


if __name__ == "__main__":
    sys.exit(main())

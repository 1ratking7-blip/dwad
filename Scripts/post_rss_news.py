"""Post real news from a rotating set of Russian-language RSS feeds to @ZHELEz19 —
runs alongside whatever is (or isn't) queued in Scripts/posts/schedule.json,
not just as a fallback for empty days. Normally one post per run (today's rotated
category); if another category's freshest item looks genuinely important
(matches IMPORTANT_KEYWORDS), it gets posted too, same run.

No AI/LLM involved on purpose (no paid API key available) — this is a plain
templated relay of a real, unedited headline + excerpt + link from the source
feed, not an "analysis" or personal take. Honest about what it is rather than
faking an editorial voice it can't actually have. "Important" is a dumb
keyword match, not real judgment — good enough to catch obviously big stories
(hacks, records, finals) without pretending to be smarter than it is.

Run from repo root: python3 Scripts/post_rss_news.py
Requires TELEGRAM_BOT_TOKEN in the environment. Reads/writes
Scripts/posts/rss_seen.json so nothing ever reposts.

Exit codes: 0 = everything attempted succeeded (including a quiet no-op day),
1 = at least one real send failed.
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
MAX_POSTS_PER_RUN = 3  # one per category, tops — a safety cap, not a target.

# Each entry: (key, feed_url, emoji, hashtags). Rotated by day-of-year so the
# channel doesn't lead with the same category two days running.
#
# Switched to Russian-language sources 2026-07-29 — the original English feeds
# (Cointelegraph/Dotesports/BBC) got relayed as-is (title/description straight from
# the source, by design), which was wrong for this channel: Данил pointed out real
# English posts going out and asked for Russian. No translation step added (still
# no LLM/API key available in this script's unattended environment, and machine-
# translating headlines automatically risks mangling names/numbers) — simplest
# honest fix is sourcing real Russian-language news instead of translating English
# ones. Verified each feed actually returns valid RSS before switching, not just
# guessed at a URL: ForkLog (crypto, ru-RU), Kanobu/Igromania (gaming — no working
# Russian esports-only RSS found, closest real alternative), Sports.ru (all sports,
# not football-only — same reason, relabeled hashtag accordingly).
CATEGORIES = [
    ("crypto", "https://forklog.com/feed", "📰", "#Крипто #ZHELEZO #Новости"),
    ("gaming", "https://www.igromania.ru/rss/news.xml", "🎮", "#Гейминг #ZHELEZO #Игры"),
    ("sport", "https://www.sports.ru/rss/all_news.xml", "🏆", "#Спорт #ZHELEZO #Новости"),
]

# Deliberately blunt substring match on the source title — no model to actually
# judge importance, so this only catches the obvious cases rather than pretending
# to real editorial judgment. Kept English terms alongside since some Russian
# headlines may still carry English proper nouns.
IMPORTANT_KEYWORDS = [
    "breaking", "hack", "exploit", "breach", "stolen", "billion", "record",
    "all-time high", "banned", "bankrupt", "collapse", "world cup", "major",
    "champion", "final", "dies", "retires", "resigns",
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


def is_important(title: str) -> bool:
    lowered = title.lower()
    return any(kw in lowered for kw in IMPORTANT_KEYWORDS)


def telegram_call(method: str, fields: dict) -> dict:
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = urllib.parse.urlencode(fields).encode("utf-8")
    req = urllib.request.Request(url, data=data)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def freshest_unseen(feed_url: str, key: str, seen: set):
    try:
        root = fetch_feed(feed_url)
    except Exception as exc:
        print(f"[post_rss_news] WARN could not fetch {key} feed ({feed_url}): {exc}")
        return None

    for item in root.findall(".//item"):
        link = (item.findtext("link") or "").strip()
        guid = (item.findtext("guid") or link).strip()
        if not link or guid in seen:
            continue
        title = clean_text(item.findtext("title") or "", limit=200)
        return {"key": key, "title": title, "link": link, "guid": guid,
                "desc": clean_text(item.findtext("description") or "", limit=280),
                "image": find_image(item)}
    return None


def gather_candidates(seen: set):
    """One freshest-unseen candidate per category, in today's rotation order."""
    day_index = datetime.now(timezone.utc).timetuple().tm_yday
    start = day_index % len(CATEGORIES)
    ordered = CATEGORIES[start:] + CATEGORIES[:start]

    candidates = []
    for key, feed_url, emoji, hashtags in ordered:
        found = freshest_unseen(feed_url, key, seen)
        if found:
            found["emoji"] = emoji
            found["hashtags"] = hashtags
            candidates.append(found)
    return candidates


def select_posts(candidates: list) -> list:
    """Today's rotated pick always goes out (guarantees daily variety); any
    OTHER category's candidate also goes out if it looks important."""
    if not candidates:
        return []
    selected = [candidates[0]]
    for c in candidates[1:]:
        if is_important(c["title"]):
            selected.append(c)
    return selected[:MAX_POSTS_PER_RUN]


def build_caption(article: dict) -> str:
    parts = [f"{article['emoji']} {article['title']}"]
    if article["desc"]:
        parts.append(article["desc"])
    parts.append(f"Читать полностью: {article['link']}")
    parts.append(article["hashtags"])
    return "\n\n".join(parts)


def post_one(article: dict) -> bool:
    caption = build_caption(article)
    print(f"[post_rss_news] posting [{article['key']}]: {article['title']}")

    result = None
    if article["image"]:
        try:
            result = telegram_call("sendPhoto", {"chat_id": CHAT_ID, "photo": article["image"], "caption": caption})
            if not result.get("ok"):
                print(f"[post_rss_news] sendPhoto returned failure ({result}), retrying as text")
                result = None
        except Exception as exc:
            # Telegram returns a non-2xx status (e.g. 400 when it can't fetch/decode the image
            # URL) for a lot of real-world RSS images — urllib raises that as an HTTPError
            # instead of an ok:false body, so it never reached the fallback below. Caught here
            # instead, per-call, so a bad image degrades to a text post instead of failing the
            # whole run (found 2026-07-30 via a real Igromania RSS image triggering exactly this).
            print(f"[post_rss_news] sendPhoto raised ({exc}), retrying as text")

    if result is None:
        try:
            result = telegram_call("sendMessage", {"chat_id": CHAT_ID, "text": caption})
        except Exception as exc:
            print(f"[post_rss_news] ERROR calling Telegram API: {exc}")
            return False

    if not result.get("ok"):
        print(f"[post_rss_news] ERROR Telegram API returned failure: {json.dumps(result)}")
        return False

    print(f"[post_rss_news] SUCCESS — message_id={result['result']['message_id']}")
    return True


def main() -> int:
    seen = load_seen()
    candidates = gather_candidates(seen)
    to_post = select_posts(candidates)

    if not to_post:
        print("[post_rss_news] no unseen article found in any feed — nothing to post, exiting cleanly")
        return 0

    any_failure = False
    for article in to_post:
        if post_one(article):
            seen.add(article["guid"])
        else:
            any_failure = True

    save_seen(seen)
    return 1 if any_failure else 0


if __name__ == "__main__":
    sys.exit(main())

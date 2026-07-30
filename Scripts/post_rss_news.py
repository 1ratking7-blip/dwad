"""Post real news from a rotating set of Russian-language RSS feeds to @ZHELEz19 —
runs alongside whatever is (or isn't) queued in Scripts/posts/schedule.json,
not just as a fallback for empty days. Normally one post per run (today's rotated
category); if another category's freshest item looks genuinely important
(matches IMPORTANT_KEYWORDS), it gets posted too, same run.

GPT rewrite + image generation added 2026-07-30 (Данил confirmed a working
OPENAI_API_KEY is available for this automation, so the earlier "no paid API
key" constraint no longer applies). Both are best-effort: any OpenAI failure
(missing key, network error, quota) falls back to the original honest
behaviour — the raw title/description text, or a text-only post if no image
can be produced — never crashes the run. The rewrite is instructed not to add
facts beyond the source title/description; the link and hashtags are always
appended by code, never generated, so those stay guaranteed-real regardless
of what the model does with the wording.

Run from repo root: python3 Scripts/post_rss_news.py
Requires TELEGRAM_BOT_TOKEN in the environment. OPENAI_API_KEY is optional —
without it the script behaves exactly as before (plain relay, RSS image or
text-only). Reads/writes Scripts/posts/rss_seen.json so nothing ever reposts.

Exit codes: 0 = everything attempted succeeded (including a quiet no-op day),
1 = at least one real send failed.
"""
import base64
import html
import json
import os
import re
import sys
import urllib.request
import urllib.parse
import uuid
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


def telegram_send_photo_bytes(photo_bytes: bytes, caption: str) -> dict:
    """sendPhoto for raw bytes (a GPT-generated image) — Telegram's URL-based sendPhoto
    only works for a hosted image, not base64 data, so this needs multipart/form-data
    instead. Pattern matches the working upload in send_post.py."""
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    boundary = uuid.uuid4().hex

    def field(name: str, value: str) -> bytes:
        return (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="{name}"\r\n\r\n'
            f"{value}\r\n"
        ).encode("utf-8")

    photo_header = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="photo"; filename="image.png"\r\n'
        f"Content-Type: image/png\r\n\r\n"
    ).encode("utf-8")

    body = b"".join([
        field("chat_id", CHAT_ID),
        field("caption", caption),
        photo_header,
        photo_bytes,
        f"\r\n--{boundary}--\r\n".encode("utf-8"),
    ])

    url = f"https://api.telegram.org/bot{token}/sendPhoto"
    req = urllib.request.Request(url, data=body)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def openai_text(prompt: str):
    """Best-effort GPT text call — returns None (never raises) on any failure, including
    a missing key, so callers can fall back to the honest plain-template wording."""
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return None
    try:
        req = urllib.request.Request(
            "https://api.openai.com/v1/responses",
            data=json.dumps({
                "model": "gpt-5",
                "input": prompt,
                "reasoning": {"effort": "low"},  # a short rewrite doesn't need deep reasoning
            }).encode("utf-8"),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        for item in data.get("output", []):
            if item.get("type") == "message":
                for c in item.get("content", []):
                    if c.get("type") == "output_text" and c.get("text"):
                        return c["text"].strip()
        return None
    except Exception as exc:
        print(f"[post_rss_news] WARN GPT text rewrite failed, using original wording: {exc}")
        return None


def openai_generate_image_bytes(prompt: str):
    """Best-effort GPT image generation — returns None (never raises) on any failure.

    quality="low" + a 150s timeout, not the original medium/90s — a real run on
    2026-07-30 timed out at 90s (generation legitimately took longer than that on the
    GitHub Actions runner). This is a small illustrative image for a Telegram post, not
    print-quality output, so trading fidelity for reliability here is the right call.
    """
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return None
    try:
        req = urllib.request.Request(
            "https://api.openai.com/v1/images/generations",
            data=json.dumps({
                "model": "gpt-image-2",
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
                "quality": "low",
            }).encode("utf-8"),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=150) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        b64 = (data.get("data") or [{}])[0].get("b64_json")
        return base64.b64decode(b64) if b64 else None
    except Exception as exc:
        print(f"[post_rss_news] WARN GPT image generation failed: {exc}")
        return None


def rewrite_caption_text(article: dict):
    """Asks GPT to paraphrase the real title/description more naturally — explicitly
    forbidden from adding facts, so the honesty guarantee holds even when this succeeds.
    Link and hashtags are never touched by this, only the headline/blurb wording."""
    prompt = (
        "Перепиши эту новость живым, естественным русским языком для короткого поста в "
        "телеграм-канале. Не добавляй фактов, цифр, имён, дат или деталей, которых нет в "
        "исходном тексте — только честный пересказ своими словами, без своих оценок и "
        "комментариев. Без хэштегов и ссылок. 1-3 предложения.\n\n"
        f"Заголовок: {article['title']}\n"
        f"Описание: {article['desc'] or '(нет)'}"
    )
    return openai_text(prompt)


IMAGE_STYLE_BY_CATEGORY = {
    "crypto": "clean minimalist digital/fintech illustration",
    "gaming": "vibrant video game concept-art style illustration",
    "sport": "dynamic sports illustration",
}


def build_image_prompt(article: dict) -> str:
    style = IMAGE_STYLE_BY_CATEGORY.get(article["key"], "clean editorial illustration")
    return f"{style}, depicting: {article['title']}. No text or logos in the image."


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


def build_caption(article: dict, gpt_text=None) -> str:
    if gpt_text:
        parts = [f"{article['emoji']} {gpt_text}"]
    else:
        parts = [f"{article['emoji']} {article['title']}"]
        if article["desc"]:
            parts.append(article["desc"])
    parts.append(f"Читать полностью: {article['link']}")
    parts.append(article["hashtags"])
    return "\n\n".join(parts)


def post_one(article: dict) -> bool:
    gpt_text = rewrite_caption_text(article)
    tag = "GPT-rewritten" if gpt_text else "original wording"
    print(f"[post_rss_news] posting [{article['key']}] ({tag}): {article['title']}")
    caption = build_caption(article, gpt_text)

    result = None
    if article["image"]:
        try:
            result = telegram_call("sendPhoto", {"chat_id": CHAT_ID, "photo": article["image"], "caption": caption})
            if not result.get("ok"):
                print(f"[post_rss_news] sendPhoto returned failure ({result}), trying a generated image")
                result = None
        except Exception as exc:
            # Telegram returns a non-2xx status (e.g. 400 when it can't fetch/decode the image
            # URL) for a lot of real-world RSS images — urllib raises that as an HTTPError
            # instead of an ok:false body, so it never reached the fallback below. Caught here
            # instead, per-call, so a bad image degrades gracefully instead of failing the
            # whole run (found 2026-07-30 via a real Igromania RSS image triggering exactly this).
            print(f"[post_rss_news] sendPhoto raised ({exc}), trying a generated image")

    if result is None:
        image_bytes = openai_generate_image_bytes(build_image_prompt(article))
        if image_bytes:
            try:
                result = telegram_send_photo_bytes(image_bytes, caption)
                if not result.get("ok"):
                    print(f"[post_rss_news] generated-image sendPhoto returned failure ({result}), retrying as text")
                    result = None
            except Exception as exc:
                print(f"[post_rss_news] generated-image sendPhoto raised ({exc}), retrying as text")

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

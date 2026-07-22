import mimetypes
import sys
import urllib.request
import urllib.parse
import uuid
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
env = {}
for line in env_path.read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if line and "=" in line:
        k, v = line.split("=", 1)
        env[k] = v

token = env["TELEGRAM_CHANNEL_BOT_TOKEN"]
chat_id = env["TELEGRAM_CHANNEL_ID"]

text_file = sys.argv[1]
photo_file = sys.argv[2] if len(sys.argv) > 2 else None
text = Path(text_file).read_text(encoding="utf-8")

if photo_file:
    photo_path = Path(photo_file)
    boundary = uuid.uuid4().hex
    mime = mimetypes.guess_type(photo_path.name)[0] or "application/octet-stream"

    def field(name, value):
        return (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="{name}"\r\n\r\n'
            f"{value}\r\n"
        ).encode("utf-8")

    photo_header = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="photo"; filename="{photo_path.name}"\r\n'
        f"Content-Type: {mime}\r\n\r\n"
    ).encode("utf-8")

    body = b"".join([
        field("chat_id", chat_id),
        field("caption", text),
        photo_header,
        photo_path.read_bytes(),
        f"\r\n--{boundary}--\r\n".encode("utf-8"),
    ])

    url = f"https://api.telegram.org/bot{token}/sendPhoto"
    req = urllib.request.Request(url, data=body)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
else:
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": chat_id, "text": text}).encode("utf-8")
    req = urllib.request.Request(url, data=data)

with urllib.request.urlopen(req) as resp:
    print(resp.read().decode("utf-8"))

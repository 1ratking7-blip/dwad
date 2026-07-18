// Minimal robots.txt checker — shared by the Analyzer and Contact Discovery modules so
// neither ever fetches a path a site has explicitly disallowed. Deliberately conservative:
// unparseable/unreachable robots.txt is treated as "allow" (matches how most crawlers behave
// when a site has no robots.txt at all), but any matching Disallow rule blocks the fetch.
const ROBOTS_CACHE = new Map();
const USER_AGENT = 'ZheleoSalesAgentBot/1.0 (+https://www.zhelezo.space; internal lead research, not indexing)';

async function fetchRobots(origin) {
  if (ROBOTS_CACHE.has(origin)) return ROBOTS_CACHE.get(origin);
  let rules = [];
  try {
    const res = await fetch(`${origin}/robots.txt`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) {
      const text = await res.text();
      rules = parseRobots(text);
    }
  } catch {
    // Unreachable robots.txt — treat as no restrictions, same as a site with none published.
  }
  ROBOTS_CACHE.set(origin, rules);
  return rules;
}

function parseRobots(text) {
  const lines = text.split('\n').map((l) => l.trim());
  const disallowed = [];
  let applies = false;
  for (const line of lines) {
    if (/^user-agent:/i.test(line)) {
      const agent = line.split(':')[1]?.trim();
      applies = agent === '*'; // we only respect the wildcard group — good-citizen default
      continue;
    }
    if (applies && /^disallow:/i.test(line)) {
      const path = line.split(':')[1]?.trim();
      if (path) disallowed.push(path);
    }
  }
  return disallowed;
}

export async function isAllowed(url) {
  const u = new URL(url);
  const rules = await fetchRobots(u.origin);
  return !rules.some((rule) => u.pathname.startsWith(rule));
}

export { USER_AGENT };

// File-based persistence for !spin/!leaderboard — a JSON file is enough for a single-server
// community bot at this scale; swap for a real DB only if the server grows past what a flat
// file can serve on every command (see README "When to stop using this").
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'spins.json');

function isoWeekKey(date) {
  // Monday-based ISO week number, e.g. "2026-W29" — used to auto-reset the weekly leaderboard
  // without a separate cron job: any read/write in a new ISO week just starts a fresh count.
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function dateKey(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD, UTC day
}

function load() {
  if (!fs.existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function save(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/** Records today's spin for a user. Returns { alreadySpun } — false the first time today. */
function recordSpin(userId, username, now = new Date()) {
  const data = load();
  const today = dateKey(now);
  const week = isoWeekKey(now);

  const entry = data[userId] || { username, lastSpinDate: null, weekKey: week, weekSpins: 0, totalSpins: 0 };
  entry.username = username; // keep display name fresh

  if (entry.lastSpinDate === today) {
    return { alreadySpun: true };
  }

  if (entry.weekKey !== week) {
    entry.weekKey = week;
    entry.weekSpins = 0;
  }

  entry.lastSpinDate = today;
  entry.weekSpins += 1;
  entry.totalSpins += 1;
  data[userId] = entry;
  save(data);
  return { alreadySpun: false, weekSpins: entry.weekSpins, totalSpins: entry.totalSpins };
}

/** Top N by current-week spin count. Entries from a stale week are treated as 0 for ranking. */
function getLeaderboard(now = new Date(), limit = 10) {
  const data = load();
  const week = isoWeekKey(now);
  return Object.values(data)
    .map((e) => ({ username: e.username, weekSpins: e.weekKey === week ? e.weekSpins : 0, totalSpins: e.totalSpins }))
    .filter((e) => e.weekSpins > 0)
    .sort((a, b) => b.weekSpins - a.weekSpins)
    .slice(0, limit);
}

module.exports = { recordSpin, getLeaderboard, isoWeekKey, dateKey };

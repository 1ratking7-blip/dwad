// Single connection point for the CRM SQLite DB. node:sqlite (built into Node 22+) is used
// instead of better-sqlite3 specifically to avoid a native-binding compile step — this keeps
// `npm install` simple in any environment that already has a modern Node.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../data/sales_agent.db');

let db;

export function getDb() {
  if (db) return db;
  db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA foreign_keys = ON;');
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
  return db;
}

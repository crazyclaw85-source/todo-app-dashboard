import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'todos.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Create todos table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

export default db;

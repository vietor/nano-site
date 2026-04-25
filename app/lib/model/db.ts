import { DatabaseSync } from "node:sqlite";
import crypto from "node:crypto";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "nano.db");

let db: InstanceType<typeof DatabaseSync> | null = null;

const PBKDF2_ITERATIONS = 100000;

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function hashPassword(password: string): string {
  const salt = generateSalt();
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, "sha256").toString("hex");
  return `pbkdf2\$${PBKDF2_ITERATIONS}\$${salt}\$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (stored.startsWith("pbkdf2$")) {
    const [, iterationsStr, salt, hash] = stored.split("$");
    const iterations = parseInt(iterationsStr, 10);
    const derived = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(hash));
  }
  return false;
}

function initTables() {
  if (!db) return;
  db.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);
  const existingUser = db.prepare("SELECT 1 FROM users").get();
  if (!existingUser) {
    db.prepare(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
    ).run("admin", hashPassword("admin123"));
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      url TEXT NOT NULL,
      thumbnail_url TEXT,
      created_at TEXT NOT NULL
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);`);
}

export function getDb(): InstanceType<typeof DatabaseSync> {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL");
    initTables();
  }
  return db;
}

import type { SiteConfig } from '@/app/shared/types';
import { getDb } from './db';

export const defaultConfig: SiteConfig = {
  title: 'Nano Site',
  description: 'A minimal web site',
};

export function loadConfig(): SiteConfig {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM config WHERE key IN ('title', 'description')").all() as { key: string; value: string }[];
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));

  return {
    title: map.title ?? defaultConfig.title,
    description: map.description ?? defaultConfig.description,
  };
}

export function saveConfig(config: SiteConfig): void {
  const db = getDb();
  db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES ('title', ?)").run(config.title);
  db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES ('description', ?)").run(config.description);
}

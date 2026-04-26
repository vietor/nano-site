import type { SiteConfig } from '@/app/shared/types';
import { getDb } from './db';

export const defaultConfig: SiteConfig = {
  title: 'Nano Site',
  description: 'A minimal web site',
  icp_number: '',
};

export function loadConfig(): SiteConfig {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM config WHERE key IN ('title', 'description', 'icp_number')").all() as { key: string; value: string }[];
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));

  return {
    title: map.title ?? defaultConfig.title,
    description: map.description ?? defaultConfig.description,
    icp_number: map.icp_number ?? defaultConfig.icp_number,
  };
}

export function saveConfig(config: SiteConfig): void {
  const db = getDb();
  db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES ('title', ?)").run(config.title);
  db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES ('description', ?)").run(config.description);
  db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES ('icp_number', ?)").run(config.icp_number);
}

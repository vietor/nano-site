import type { MediaType, Media } from '@/app/shared/types';
import { getDb } from './db';
import { PAGE_SIZE } from '../constants';

export function getPagedMedia(page: number = 1, pageSize: number = PAGE_SIZE, type?: string): { media: Media[]; total: number; totalPages: number } {
  const db = getDb();
  const totalRow = type
    ? db.prepare('SELECT COUNT(*) as count FROM media WHERE type = ?').get(type) as { count: number }
    : db.prepare('SELECT COUNT(*) as count FROM media').get() as { count: number };
  const total = totalRow.count;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const rows = type
    ? db.prepare('SELECT id, title, type, url, thumbnail_url as thumbnailUrl, created_at as createdAt FROM media WHERE type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?').all(type, pageSize, offset) as Record<string, unknown>[]
    : db.prepare('SELECT id, title, type, url, thumbnail_url as thumbnailUrl, created_at as createdAt FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?').all(pageSize, offset) as Record<string, unknown>[];
  return {
    media: rows.map(r => ({
      id: r.id as number,
      title: r.title as string,
      type: r.type as MediaType,
      url: r.url as string,
      thumbnailUrl: r.thumbnailUrl as string | undefined,
      createdAt: r.createdAt as string,
    })),
    total,
    totalPages,
  };
}

export function getMediaById(id: number): Media | undefined {
  const db = getDb();
  const row = db.prepare('SELECT id, title, type, url, thumbnail_url as thumbnailUrl, created_at as createdAt FROM media WHERE id = ?').get(id);
  return row as Media | undefined;
}

export function createMedia(title: string, type: MediaType, url: string, thumbnailUrl?: string): Media {
  const db = getDb();
  const now = new Date().toISOString();
  const result = db.prepare('INSERT INTO media (title, type, url, thumbnail_url, created_at) VALUES (?, ?, ?, ?, ?)').run(title, type, url, thumbnailUrl || null, now);
  const id = Number(result.lastInsertRowid);
  return { id, title, type, url, thumbnailUrl, createdAt: now };
}

export function updateMedia(id: number, title: string): Media | undefined {
  const db = getDb();
  const existing = getMediaById(id);
  if (!existing) return undefined;
  db.prepare('UPDATE media SET title = ? WHERE id = ?').run(title, id);
  return { ...existing, title };
}

export function deleteMedia(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM media WHERE id = ?').run(id);
  return result.changes > 0;
}

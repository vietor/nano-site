import type { Post, PostStatus } from '@/app/shared/types';
import { getDb } from './db';
import { PAGE_SIZE } from '../constants';

function mapRow(r: Record<string, unknown>): Post {
  return {
    id: r.id as number,
    title: r.title as string,
    content: r.content as string,
    status: (r.status as PostStatus) || 'published',
    createdAt: r.createdAt as string,
    updatedAt: r.updatedAt as string,
  };
}

export function getPagedPosts(page: number = 1, pageSize: number = PAGE_SIZE, status?: PostStatus): { posts: Post[]; total: number; totalPages: number } {
  const db = getDb();
  const totalRow = status
    ? db.prepare('SELECT COUNT(*) as count FROM posts WHERE status = ?').get(status) as { count: number }
    : db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
  const total = totalRow.count;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const rows = status
    ? db.prepare(`SELECT id, title, content, status, created_at as createdAt, updated_at as updatedAt FROM posts WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(status, pageSize, offset) as Record<string, unknown>[]
    : db.prepare('SELECT id, title, content, status, created_at as createdAt, updated_at as updatedAt FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?').all(pageSize, offset) as Record<string, unknown>[];
  return {
    posts: rows.map(mapRow),
    total,
    totalPages,
  };
}

export function getPagedPublishedPosts(page: number = 1, pageSize: number = PAGE_SIZE): { posts: Post[]; total: number; totalPages: number } {
  return getPagedPosts(page, pageSize, 'published');
}

export function getPostById(id: number): Post | undefined {
  const db = getDb();
  const row = db.prepare('SELECT id, title, content, status, created_at as createdAt, updated_at as updatedAt FROM posts WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) return undefined;
  return mapRow(row);
}

export function createPost(title: string, content: string, status: PostStatus = 'published'): Post {
  const db = getDb();
  const now = new Date().toISOString();
  const result = db.prepare('INSERT INTO posts (title, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(title, content, status, now, now);
  const id = Number(result.lastInsertRowid);
  return { id, title, content, status, createdAt: now, updatedAt: now };
}

export function updatePost(id: number, title: string, content: string, status?: PostStatus): Post | undefined {
  const db = getDb();
  const existing = getPostById(id);
  if (!existing) return undefined;
  if (existing.status === 'published' && status === 'draft') {
    return undefined;
  }
  const newStatus = (existing.status === 'published' || !status) ? 'published' : status;
  const now = new Date().toISOString();
  const createdAt = (status === 'published' && existing.status !== 'published') ? now : existing.createdAt; 
  db.prepare('UPDATE posts SET title = ?, content = ?, status = ?, created_at = ?, updated_at = ? WHERE id = ?').run(title, content, newStatus, createdAt, now, id);
  return { id, title, content, status: newStatus, createdAt: existing.createdAt, updatedAt: now };
}

export function deletePost(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  return result.changes > 0;
}

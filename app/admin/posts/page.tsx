'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import { PAGE_SIZE } from '@/app/lib/constants';
import type { Post, PostsResponse } from '@/app/shared/types';

type StatusFilter = 'all' | 'draft' | 'published';

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const loadPosts = useCallback(() => {
    const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
    fetch(`/api/posts?page=${page}&pageSize=${pageSize}${statusParam}`)
      .then(res => res.json())
      .then((data: PostsResponse) => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      })
      .catch(err => console.error('加载文章失败：', err));
  }, [page, pageSize, statusFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
      setPendingDeleteId(null);
      loadPosts();
    } catch (err) {
      console.error('删除文章失败：', err);
    }
  };

  return (
    <div>
      <div className="wp-admin-header">
        <h1>文章管理</h1>
        <Link prefetch={false} href="/admin/new" className="wp-admin-btn wp-admin-btn-primary">
          + 新建文章
        </Link>
      </div>

      <div className="flex gap-2 mb-4 items-center">
        <label className="text-sm text-[#646970]" htmlFor="status-filter">状态筛选：</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
          className="text-sm border border-[#c3c4c7] rounded-sm px-2 py-1 min-w-[120px]"
        >
          <option value="all">全部</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
      </div>

      {posts.length === 0 ? (
        <div className="wp-empty-state">
          <p>暂无文章</p>
        </div>
      ) : (
        <>
          <table className="wp-list-table">
            <thead>
              <tr>
                <th className="w-auto">标题</th>
                <th className="w-20">状态</th>
                <th className="w-32">创建时间</th>
                <th className="w-32">更新时间</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="font-semibold text-[13px]">{post.title}</div>
                    <div className="row-actions">
                      <Link prefetch={false} href={`/admin/edit/${post.id}`}>编辑</Link>
                      <span>|</span>
                      <button
                        onClick={() => setPendingDeleteId(post.id)}
                        className="delete inline-block bg-none border-none cursor-pointer p-0 text-inherit font-inherit"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="text-[#646970]">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-[#646970]">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="wp-admin-pagination">
            <div className="displaying-num">
              共 <span className="font-medium">{total}</span> 篇
            </div>
            <div className="paging-input">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="button"
              >
                上一页
              </button>
              <span className="text-[#646970] text-sm">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="button"
              >
                下一页
              </button>
            </div>
          </div>
        </>
      )}

      {pendingDeleteId && (
        <ConfirmDialog
          message="确定要删除这篇文章吗？"
          onConfirm={() => handleDelete(pendingDeleteId)}
          onCancel={() => setPendingDeleteId(null)}
          confirmType="danger"
          confirmLabel="删除"
        />
      )}
    </div>
  );
}

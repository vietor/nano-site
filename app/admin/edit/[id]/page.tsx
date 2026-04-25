'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MarkdownEditor } from '@/app/components/MarkdownEditor';
import ConfirmDialog from '@/app/components/ConfirmDialog';

import type { Post } from '@/app/shared/types';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/posts?id=${params.id}`)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then((data: Post) => {
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
          setIsPublished(data.status === 'published');
          setIsLoading(false);
        })
        .catch(() => {
          router.push('/admin/posts');
        });
    }
  }, [params.id, router]);

  const handleSubmit = async (status: 'draft' | 'published') => {
    try {
      await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, title, content, status }),
      });
      router.push('/admin/posts');
    } catch {
      // ignore
    }
  };

  const handlePublish = () => {
    setShowPublishConfirm(false);
    handleSubmit('published');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#646970]">加载中...</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const hasContent = title.trim() !== post.title || content.trim() !== post.content;

  const handleCancel = () => {
    if (hasContent) {
      setShowCancelConfirm(true);
    } else {
      router.push('/admin/posts');
    }
  };

  return (
    <div>
      <div className="wp-admin-header">
        <h1>编辑文章</h1>
      </div>

      <div className="wp-card">
        <div className="wp-card-header">
          <h2>编辑文章</h2>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="输入标题"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-lg font-medium"
          />
        </div>

        <MarkdownEditor value={content} onChange={setContent} />

        <div className="flex gap-2 mt-4">
          <span className="text-sm text-[#646970] mr-1">状态：</span>
          <span className={`text-sm ${post.status === 'published' ? 'text-[#2271b1] font-semibold' : 'text-[#646970]'}`}>
            {post.status === 'published' ? '已发布' : '草稿'}
          </span>
        </div>
      </div>

      <div className="wp-admin-pagination" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
        <div></div>
        <div className="flex gap-2">
          {isPublished ? (
            <>
              <button onClick={() => handleSubmit('published')} className="wp-admin-btn wp-admin-btn-primary">
                保存更改
              </button>
              <button onClick={handleCancel} className="wp-admin-btn wp-admin-btn-secondary">
                取消
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowPublishConfirm(true)} className="wp-admin-btn wp-admin-btn-primary">
                立即发布
              </button>
              <button onClick={() => handleSubmit('draft')} className="wp-admin-btn wp-admin-btn-secondary">
                存草稿
              </button>
              <button onClick={handleCancel} className="wp-admin-btn wp-admin-btn-secondary">
                取消
              </button>
            </>
          )}
        </div>
      </div>

      {showPublishConfirm && (
        <ConfirmDialog
          message="确定要发布这篇文章吗？"
          onConfirm={handlePublish}
          onCancel={() => setShowPublishConfirm(false)}
          confirmLabel="发布"
        />
      )}

      {showCancelConfirm && (
        <ConfirmDialog
          message="确定要取消编辑吗？已修改的内容将不会保存。"
          onConfirm={() => {
            setShowCancelConfirm(false);
            router.push('/admin/posts');
          }}
          onCancel={() => setShowCancelConfirm(false)}
          confirmLabel="确定退出"
          confirmType="danger"
        />
      )}
    </div>
  );
}

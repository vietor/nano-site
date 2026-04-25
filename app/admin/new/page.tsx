"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MarkdownEditor } from "@/app/components/MarkdownEditor";
import ConfirmDialog from "@/app/components/ConfirmDialog";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const router = useRouter();

  const hasContent = title.trim() || content.trim();

  const handleCancel = () => {
    if (hasContent) {
      setShowCancelConfirm(true);
    } else {
      router.push('/admin/posts');
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, status }),
      });
      router.push("/admin/posts");
    } catch {
      // ignore
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPublishConfirm(true);
  };

  const handlePublish = () => {
    setShowPublishConfirm(false);
    handleSubmit("published");
  };

  return (
    <div>
      <div className="wp-admin-header">
        <h1>新建文章</h1>
      </div>

      <form onSubmit={onSubmit}>
        <div className="wp-card">
          <div className="wp-card-header">
            <h2>撰写文章</h2>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="输入标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-medium"
              required
            />
          </div>

          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        <div
          className="wp-admin-pagination"
          style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}
        >
          <div></div>
          <div className="flex gap-2">
            <button type="submit" className="wp-admin-btn wp-admin-btn-primary">
              立即发布
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="wp-admin-btn wp-admin-btn-secondary"
            >
              存草稿
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="wp-admin-btn wp-admin-btn-secondary"
            >
              取消
            </button>
          </div>
        </div>
      </form>

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
          message="确定要取消编辑吗？已输入的内容将不会保存。"
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

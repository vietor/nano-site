"use client";

import Link from "next/link";
import type { SiteConfig } from "@/app/shared/types";
import { MarkdownViewer } from "@/app/shared/md";
import {
  formatDate,
  type HomeTemplateProps,
  type PostTemplateProps,
} from "./shared";

function SiteHeader({ config }: { config: SiteConfig }) {
  return (
    <header className="border-b bg-white">
      <div className="max-w-3xl mx-auto px-4 py-4 justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-900">{config.title}</h1>
        <p className="text-zinc-400 mt-1">{config.description}</p>
      </div>
    </header>
  );
}

function SiteFooter({ config }: { config: SiteConfig }) {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className={`max-w-3xl mx-auto px-4 py-4 text-zinc-500 text-sm ${config.icp_number ? 'flex justify-between' : 'text-center'}`}>
        {config.icp_number ? <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">{config.icp_number}</a> : null}
        <span>© {new Date().getFullYear()} {config.title}</span>
      </div>
    </footer>
  );
}

export default function ClassicHomeTemplate({
  config,
  posts,
  page,
  totalPages,
}: HomeTemplateProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader config={config} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        {posts.length === 0 ? (
          <p className="text-center text-zinc-500 py-12">暂无文章</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200"
              >
                <p className="text-zinc-400 text-xs mb-3">
                  {formatDate(post.createdAt)}
                </p>
                <Link prefetch={false} href={`/post/${post.id}`}>
                  <h2 className="text-xl font-semibold mb-3 hover:text-zinc-700">
                    {post.title}
                  </h2>
                </Link>
                <MarkdownViewer content={post.content} />
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {page > 1 && (
              <Link prefetch={false}
                href={`/?page=${page - 1}`}
                className="px-4 py-2 text-sm border border-zinc-300 rounded hover:bg-zinc-100"
              >
                上一页
              </Link>
            )}
            <span className="text-sm text-zinc-500">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link prefetch={false}
                href={`/?page=${page + 1}`}
                className="px-4 py-2 text-sm border border-zinc-300 rounded hover:bg-zinc-100"
              >
                下一页
              </Link>
            )}
          </div>
        )}
      </main>
      <SiteFooter config={config} />
    </div>
  );
}

export function ClassicPostTemplate({ config, post }: PostTemplateProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader config={config} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Link prefetch={false} href="/" className="text-zinc-600 hover:text-zinc-900 text-sm inline-block">
          返回首页
        </Link>
        {post ? (
          <article className="bg-white rounded-lg p-8 shadow-sm border border-zinc-200 mt-6">
            <p className="text-zinc-400 text-sm mb-4">
              发布于 {formatDate(post.createdAt)}
            </p>
            <h1 className="text-2xl font-semibold mb-4 text-zinc-900">
              {post.title}
            </h1>
            <MarkdownViewer content={post.content} />
          </article>
        ) : (
          <p className="text-center text-zinc-500 mt-12">文章不存在</p>
        )}
      </main>
      <SiteFooter config={config} />
    </div>
  );
}

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
    <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="max-w-3xl mx-auto px-6 py-5">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          {config.title}
        </h1>
        {config.description && (
          <p className="text-sm text-zinc-500 mt-1">{config.description}</p>
        )}
      </div>
    </header>
  );
}

function SiteFooter({ config }: { config: SiteConfig }) {
  return (
    <footer className="border-t border-zinc-200/70 bg-white mt-auto">
      <div
        className={`max-w-3xl mx-auto px-6 py-6 text-zinc-400 text-xs ${config.icp_number ? "flex justify-between" : "text-center"}`}
      >
        {config.icp_number ? (
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-600 transition-colors"
          >
            {config.icp_number}
          </a>
        ) : null}
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
      <main className="max-w-3xl mx-auto px-6 py-10">
        {posts.length === 0 ? (
          <p className="text-center text-zinc-400 py-20">暂无文章</p>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl p-7 shadow-sm border border-zinc-200/80 hover:border-zinc-300 hover:shadow-md transition-all"
              >
                <p className="text-zinc-400 text-xs mb-3">
                  {formatDate(post.createdAt)}
                </p>
                <Link prefetch={false} href={`/post/${post.id}`}>
                  <h2 className="text-lg font-semibold mb-3 text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <div className="text-zinc-600">
                  <MarkdownViewer content={post.content} />
                </div>
              </article>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            {page > 1 && (
              <Link
                prefetch={false}
                href={`/?page=${page - 1}`}
                className="px-4 py-2 text-sm border border-zinc-300 rounded-lg bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
              >
                上一页
              </Link>
            )}
            <span className="text-sm text-zinc-500 tabular-nums">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                prefetch={false}
                href={`/?page=${page + 1}`}
                className="px-4 py-2 text-sm border border-zinc-300 rounded-lg bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
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

export function ClassicPostTemplate({ config, post, adjacent }: PostTemplateProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader config={config} />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link
          prefetch={false}
          href="/"
          className="text-zinc-500 hover:text-zinc-900 text-sm inline-flex items-center gap-1 transition-colors"
        >
          ← 返回首页
        </Link>
        {post ? (
          <article className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-zinc-200/80 mt-6">
            <h1 className="text-3xl font-bold tracking-tight mb-3 text-zinc-900">
              {post.title}
            </h1>
            <p className="text-zinc-400 text-sm mb-8 pb-8 border-b border-zinc-100">
              发布于 {formatDate(post.createdAt)} · {post.views} 次阅读
            </p>
            <MarkdownViewer content={post.content} />
          </article>
        ) : (
          <p className="text-center text-zinc-400 mt-20 mb-20">文章不存在</p>
        )}
        {adjacent && (adjacent.prev || adjacent.next) && (
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="min-w-0">
              {adjacent.prev && (
                <Link
                  prefetch={false}
                  href={`/post/${adjacent.prev.id}`}
                  className="block bg-white rounded-xl p-4 border border-zinc-200/80 hover:border-zinc-400 hover:shadow-sm transition-all"
                >
                  <span className="text-zinc-400 text-xs">上一篇</span>
                  <span className="block text-sm text-zinc-700 truncate mt-1">
                    {adjacent.prev.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="min-w-0 sm:text-right">
              {adjacent.next && (
                <Link
                  prefetch={false}
                  href={`/post/${adjacent.next.id}`}
                  className="block bg-white rounded-xl p-4 border border-zinc-200/80 hover:border-zinc-400 hover:shadow-sm transition-all"
                >
                  <span className="text-zinc-400 text-xs">下一篇</span>
                  <span className="block text-sm text-zinc-700 truncate mt-1">
                    {adjacent.next.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </main>
      <SiteFooter config={config} />
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-zinc-500 text-lg">文章不存在</p>
        <Link href="/" className="text-zinc-600 hover:text-zinc-900 text-sm mt-4 inline-block">
          返回首页
        </Link>
      </div>
    </div>
  );
}

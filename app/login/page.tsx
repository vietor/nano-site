'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/admin');
    } else {
      setError(data.error || '登录失败');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 shadow">
          <h1 className="text-2xl font-semibold text-center mb-6">管理员登录</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-4 bg-transparent dark:border-zinc-700"
              required
            />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-4 bg-transparent dark:border-zinc-700"
              required
            />
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              登录
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link prefetch={false} href="/" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

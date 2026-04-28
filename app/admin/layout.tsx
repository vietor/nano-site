'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import './wordpress.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUsername(data.user.username);
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const isActive = (path: string) => {
    if (path === '/admin/posts' && pathname === '/admin') return true;
    return pathname === path || pathname?.startsWith(path + '/');
  };

  if (!username) {
    return null;
  }

  return (
    <div className="wp-admin">
      <nav className="wp-admin-sidebar">
        <ul className="wp-admin-menu">
          <li>
            <a href="/admin/posts" className={isActive('/admin/posts') ? 'active' : ''}>
              <span className="dashicon">📄</span>
              <span>文章</span>
            </a>
          </li>
          <li>
            <a href="/admin/media" className={isActive('/admin/media') ? 'active' : ''}>
              <span className="dashicon">🖼️</span>
              <span>媒体</span>
            </a>
          </li>
          <li>
            <a href="/admin/settings" className={isActive('/admin/settings') ? 'active' : ''}>
              <span className="dashicon">⚙️</span>
              <span>设置</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="wp-admin-content">
        <div className="wp-admin-bar">
          <span className="wp-admin-bar-title">控制台</span>
          <div className="wp-admin-bar-links">
            <a href="/" target="_blank">查看站点</a>
          </div>
          <div className="wp-admin-bar-right">
            <div
              className="wp-admin-user-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="wp-admin-avatar">{getInitial(username)}</div>
              <span>{username}</span>
            </div>
            {menuOpen && (
              <div className="absolute right-4 top-10 bg-white border border-[#c3c4c7] rounded shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-[#d63638] hover:bg-[#f6f7f7]"
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>

        <main className="wp-admin-wrap">
          {children}
        </main>
      </div>
    </div>
  );
}

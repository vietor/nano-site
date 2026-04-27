'use client';

import { useState, useEffect } from 'react';

import type { SiteConfig } from '@/app/shared/types';

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    const res = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (res.ok) {
      const data = await res.json();
      setConfig(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMessage({ type: 'success', text: '密码修改成功' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: data.error || '密码修改失败' });
      }
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch {
      // ignore
    }
  };

  if (!config) return null;

  return (
    <div>
      <div className="wp-admin-header">
        <h1>网站设置</h1>
      </div>

      <div className="wp-card" style={{ maxWidth: '600px' }}>
        <div className="wp-card-header">
          <h2>常规设置</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#3c434a] mb-2">
              网站标题
            </label>
            <input
              type="text"
              value={config.title}
              onChange={e => setConfig({ ...config, title: e.target.value })}
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#3c434a] mb-2">
              网站描述
            </label>
            <input
              type="text"
              value={config.description}
              onChange={e => setConfig({ ...config, description: e.target.value })}
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#3c434a] mb-2">
              ICP 备案号
            </label>
            <input
              type="text"
              value={config.icp_number}
              onChange={e => setConfig({ ...config, icp_number: e.target.value })}
              className="w-full"
              placeholder="可选"
            />
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" className="wp-admin-btn wp-admin-btn-primary">
              保存设置
            </button>
            {saved && (
              <span className="text-[#00a32a] text-sm">保存成功！</span>
            )}
          </div>
        </form>
      </div>

      <div className="wp-card" style={{ maxWidth: '600px', marginTop: '16px' }}>
        <div className="wp-card-header">
          <h2>修改密码</h2>
        </div>

        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#3c434a] mb-2">
              当前密码
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#3c434a] mb-2">
              新密码
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#3c434a] mb-2">
              确认新密码
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full"
              required
            />
          </div>

          {passwordMessage && (
            <div className={`mb-4 p-3 rounded text-sm ${
              passwordMessage.type === 'success' ? 'bg-[#edfaef] text-[#00a32a]' : 'bg-[#fcf0f1] text-[#d63638]'
            }`}>
              {passwordMessage.text}
            </div>
          )}

          <button type="submit" className="wp-admin-btn wp-admin-btn-primary">
            修改密码
          </button>
        </form>
      </div>
    </div>
  );
}

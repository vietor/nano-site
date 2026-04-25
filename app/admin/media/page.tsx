'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import { PAGE_SIZE } from '@/app/lib/constants';
import type { Media, MediaResponse } from '@/app/shared/types';

type TypeFilter = 'all' | 'image' | 'video' | 'audio' | 'document';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const loadMedia = useCallback(() => {
    const typeParam = typeFilter !== 'all' ? `&type=${typeFilter}` : '';
    fetch(`/api/media?page=${page}&pageSize=${pageSize}${typeParam}`)
      .then(res => res.json())
      .then((data: MediaResponse) => {
        setMedia(data.media);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      })
      .catch(err => console.error('加载媒体文件失败：', err));
  }, [page, pageSize, typeFilter]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const generateImageThumbnail = (file: File): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        const ratio = Math.min(150 / img.width, 150 / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        const x = (150 - width) / 2;
        const y = (150 - height) / 2;
        ctx.drawImage(img, x, y, width, height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
        URL.revokeObjectURL(url);
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const generateVideoThumbnail = (file: File): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      video.preload = 'auto';
      video.currentTime = 1;
      video.muted = true;

      const captureFrame = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        const ratio = Math.min(150 / video.videoWidth, 150 / video.videoHeight);
        const width = video.videoWidth * ratio;
        const height = video.videoHeight * ratio;
        const x = (150 - width) / 2;
        const y = (150 - height) / 2;
        ctx.drawImage(video, x, y, width, height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
        URL.revokeObjectURL(url);
      };

      video.onseeked = captureFrame;
      video.onerror = () => resolve(null);
      video.src = url;
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', uploadTitle || selectedFile.name);

    if (selectedFile.type.startsWith('image/')) {
      const thumbnail = await generateImageThumbnail(selectedFile);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail, `thumb_${selectedFile.name}`);
      }
    } else if (selectedFile.type.startsWith('video/')) {
      const thumbnail = await generateVideoThumbnail(selectedFile);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail, 'thumb.png');
      }
    }

    try {
      await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      setUploadTitle('');
      setSelectedFile(null);
      setFileKey(prev => prev + 1);
      loadMedia();
    } catch (error) {
      console.error('上传失败：', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    try {
      await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      setPendingDeleteId(null);
      loadMedia();
    } catch (err) {
      console.error('删除媒体文件失败：', err);
    }
  };

  const handleEdit = (m: Media) => {
    setEditingId(m.id);
    setEditTitle(m.title);
  };

  const handleUpdate = async (id: number) => {
    try {
      await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: editTitle }),
      });
      setEditingId(null);
      loadMedia();
    } catch (err) {
      console.error('更新媒体文件失败：', err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const renderMediaIcon = (type: string) => {
    if (type === 'image') {
      return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    }
    if (type === 'video') {
      return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
    }
    if (type === 'audio') {
      return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
    }
    return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
  };

  const getTypeLabel = (type: string) => {
    return type === 'image' ? '图片' : type === 'video' ? '视频' : type === 'audio' ? '音频' : '文档';
  };

  return (
    <div>
      <div className="wp-admin-header">
        <h1>媒体管理</h1>
        <label className="wp-admin-btn wp-admin-btn-primary cursor-pointer">
          + 上传媒体
          <input
            key={fileKey}
            type="file"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex gap-2 mb-4 items-center">
        <label className="text-sm text-[#646970]" htmlFor="type-filter">类型筛选：</label>
        <select
          id="type-filter"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as TypeFilter); setPage(1); }}
          className="text-sm border border-[#c3c4c7] rounded-sm px-2 py-1 min-w-[120px]"
        >
          <option value="all">全部</option>
          <option value="image">图片</option>
          <option value="video">视频</option>
          <option value="audio">音频</option>
          <option value="document">文档</option>
        </select>
      </div>

      {selectedFile && (
        <div className="wp-card">
          <div className="wp-card-header">
            <h2>上传媒体</h2>
          </div>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="标题（可选）"
                className="flex-1"
              />
              <span className="text-sm text-[#646970]">{selectedFile.name}</span>
              <button
                type="submit"
                disabled={isUploading}
                className="wp-admin-btn wp-admin-btn-primary"
              >
                {isUploading ? '上传中...' : '确认上传'}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedFile(null); setUploadTitle(''); setFileKey(prev => prev + 1); }}
                className="wp-admin-btn wp-admin-btn-secondary"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {media.length === 0 ? (
        <div className="wp-empty-state">
          <p>暂无媒体文件</p>
        </div>
      ) : (
        <>
          <table className="wp-list-table">
            <thead>
              <tr>
                <th className="w-auto">标题</th>
                <th className="w-24">类型</th>
                <th className="w-32">上传时间</th>
              </tr>
            </thead>
            <tbody>
              {media.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {m.thumbnailUrl ? (
                        <img src={m.thumbnailUrl} alt="" className="wp-media-thumb" />
                      ) : (
                        <div className="wp-media-icon">
                          {renderMediaIcon(m.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {editingId === m.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 text-sm w-full"
                            autoFocus
                          />
                        ) : (
                          <div className="font-semibold text-[13px] truncate">{m.title}</div>
                        )}
                        {editingId === m.id ? (
                          <div className="row-actions" style={{ visibility: 'visible' }}>
                            <button onClick={() => handleUpdate(m.id)} className="bg-none border-none cursor-pointer text-[#2271b1]">保存</button>
                            <span>|</span>
                            <button onClick={handleCancel} className="bg-none border-none cursor-pointer text-[#646970]">取消</button>
                          </div>
                        ) : (
                          <div className="row-actions">
                            <Link prefetch={false} href={m.url} target="_blank">查看</Link>
                            <span>|</span>
                            <button onClick={() => handleEdit(m)} className="bg-none border-none cursor-pointer text-[#2271b1]">编辑</button>
                            <span>|</span>
                            <button onClick={() => setPendingDeleteId(m.id)} className="delete bg-none border-none cursor-pointer text-inherit font-inherit">删除</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="wp-badge">{getTypeLabel(m.type)}</span>
                  </td>
                  <td className="text-[#646970]">
                    {new Date(m.createdAt).toLocaleDateString()}
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
          message="确定要删除这个媒体文件吗？"
          onConfirm={() => handleDelete(pendingDeleteId)}
          onCancel={() => setPendingDeleteId(null)}
          confirmType="danger"
          confirmLabel="删除"
        />
      )}
    </div>
  );
}

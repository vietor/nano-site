'use client';

import React, { type ReactNode, type RefObject, useCallback, useEffect, useState, useRef } from 'react';
import { MarkdownViewer } from '@/app/shared/md';
import type { MediaType } from '@/app/shared/types';

// ─── SVG Icon Components ──────────────────────────────────────────────────────

function IconBold() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2h5a2.5 2.5 0 0 1 1.78 4.25A2.5 2.5 0 0 1 9.5 11H4V2zm2 4h3a.5.5 0 0 0 0-1H6v1zm0 1v4h3a.5.5 0 0 0 0-1H6V7z" />
    </svg>
  );
}

function IconItalic() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 2h4l-1 12H5l1-12zm2 1l-.5 10H8l.5-10z" />
    </svg>
  );
}

function IconStrikethrough() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 8h12v1.5H2V8zm3.5-4h3A2.5 2.5 0 0 1 11 6.2v.6H9V6.5a1 1 0 0 0-1-1H5.5V7h3v1H5.5a2.5 2.5 0 0 1 0-5zm0 8h3a2.5 2.5 0 0 0 2.5-2.5v-.6H11v.3a1 1 0 0 1-1 1H9v1H5.5a2.5 2.5 0 0 1 0-5z" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.5 3L1 8l4.5 5 1-1.2L3 8l3.5-4.8-1-1.2zM10.5 3L15 8l-4.5 5-1-1.2L13 8l-3.5-4.8 1-1.2z" />
    </svg>
  );
}

function IconCodeBlock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3zm1 1v10h12V4H2zm3.5 3L4 9.5l2.5 2.5 1-1L6.5 9.5 7.5 8.5 6.5 8zM10 10.5 11 9.5l-1-1 1-1L12 8l-2 2.5zM6.5 4.5l1-1 1 1-1 1-1-1zm3 7l1-1 1 1-1 1-1-1z" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 4h1v7H3V5H1V4h2zm7 0h1v7H10V5H8V4h2zM4 5H2v1h2V5zm7 0h-2v1h2V5z" />
    </svg>
  );
}

function IconUl() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="2" cy="3.5" r="1.5" />
      <circle cx="2" cy="8" r="1.5" />
      <circle cx="2" cy="12.5" r="1.5" />
      <path d="M6 4h8v1H6V4zm0 4.5h8v1H6v-1zm0 4h8v1H6v-1z" />
    </svg>
  );
}

function IconOl() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <text x="1" y="5.5" fontSize="5" fontWeight="bold" fill="currentColor">1</text>
      <text x="1" y="10" fontSize="5" fontWeight="bold" fill="currentColor">2</text>
      <text x="1" y="14.5" fontSize="5" fontWeight="bold" fill="currentColor">3</text>
      <path d="M6 4h8v1H6V4zm0 4.5h8v1H6v-1zm0 4h8v1H6v-1z" />
    </svg>
  );
}

function IconHr() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 7.5h14v1H1v-1z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.8 11.8a2.5 2.5 0 0 1-3.5 0l-1-1a2.5 2.5 0 0 1 3.5-3.5l.8.8-1 .9-.8-.8a1 1 0 0 0-1.4 1.4l1 1a1 1 0 0 0 1.4 0l2-2a1 1 0 0 0 0-1.4 1 1 0 0 0-1.4 0l-2 2a1 1 0 0 0 .7 1.7 1 1 0 0 0 .7-.3l1-1 1 1-.9 1-1-1zM9.2 4.2a2.5 2.5 0 0 1 3.5 0l1 1a2.5 2.5 0 0 1-3.5 3.5l-.8-.8 1-.9.8.8a1 1 0 0 0 1.4-1.4l-1-1a1 1 0 0 0-1.4 0l-2 2a1 1 0 0 0 0 1.4 1 1 0 0 0 1.4 0l2-2a1 1 0 0 0-.7-1.7 1 1 0 0 0-.7.3l-1 1-1-1 .9-1 1 1z" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 2h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v9.5l3-3 2 2 3-3.5 2 2V3H2zm3.5-1a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
    </svg>
  );
}

function IconAttachment() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M10.5 1.5a4.5 4.5 0 0 0-5.4 7.32L6 10v3.5a1.5 1.5 0 0 0 3 0V9.5a.5.5 0 0 0-1 0v5.5a.5.5 0 0 1-1 0V9.32a3 3 0 0 1 3.8-4.92l.7.7-.7-.7z" />
    </svg>
  );
}

function IconH1() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1.5 3h2v10h-2V3zm4.5 0h5l-.5 6h-1l-.5-3h-.5l-.5 3h-1L6 3zm.75 3.5L10 3h.5l2.75 6.5H11l-.5-2.5h-2L8.5 9.5H7.25z" />
    </svg>
  );
}

function IconH2() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1.5 3h2v10h-2V3zm4 3c0-1.1.9-2 2-2h2.5a2.5 2.5 0 0 1 0 5H9v3h-2V9H7v-2h.5c.3 0 .5-.2.5-.5v-.5zm3 .5h1a.5.5 0 0 0 0-1h-1v1z" />
    </svg>
  );
}

function IconH3() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1.5 3h2v10h-2V3zm4 0h3A2.5 2.5 0 0 1 11 5.5 2.5 2.5 0 0 1 8.5 8H7.5v4h-2V3zm2 5h1a.5.5 0 0 0 0-1h-1v1zm0-1.5h1.5a1 1 0 0 0-1-1H9.5v1z" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dispatchReactInput(ta: HTMLTextAreaElement) {
  ta.focus();
  const event = new Event('input', { bubbles: true });
  const tracker = (ta as unknown as { _valueTracker?: { setValue: (v: string) => void } })._valueTracker;
  if (tracker) {
    const currentValue = ta.value;
    tracker.setValue('');
    tracker.setValue(currentValue);
  }
  ta.dispatchEvent(event);
}

function insertWrap(ta: HTMLTextAreaElement, before: string, after: string) {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.substring(start, end);
  const replacement = before + selected + after;
  const newValue = ta.value.substring(0, start) + replacement + ta.value.substring(end);
  ta.value = newValue;
  ta.selectionStart = start + before.length;
  ta.selectionEnd = start + before.length + selected.length;
  dispatchReactInput(ta);
}

function insertAtStart(ta: HTMLTextAreaElement, prefix: string) {
  const lineStart = ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1;
  const newValue = ta.value.substring(0, lineStart) + prefix + ta.value.substring(lineStart);
  ta.value = newValue;
  ta.selectionStart = ta.selectionEnd = lineStart + prefix.length;
  dispatchReactInput(ta);
}

function insertText(ta: HTMLTextAreaElement, text: string) {
  const start = ta.selectionStart;
  const newValue = ta.value.substring(0, start) + text + ta.value.substring(start);
  ta.value = newValue;
  ta.selectionStart = ta.selectionEnd = start + text.length;
  dispatchReactInput(ta);
}

// ─── Toolbar Button Definition ────────────────────────────────────────────────

interface ToolbarButton {
  icon: ReactNode;
  title: string;
  insert: (textarea: HTMLTextAreaElement) => void;
  modal?: 'image' | 'link' | 'media';
}

function Separator() {
  return <div className="w-px h-5 bg-[#dcdcde] mx-0.5 shrink-0" />;
}

// ─── Modals ───────────────────────────────────────────────────────────────────

interface LinkModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (text: string, url: string) => void;
}

interface MediaItem {
  id: number;
  title: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
}

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInsertImage: (alt: string, url: string) => void;
  onInsertLink: (text: string, url: string) => void;
}

const PAGE_SIZE = 10;

function LinkModal({ open, onClose, onInsert }: LinkModalProps) {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  if (!open) return null;

  const handleInsert = () => {
    onInsert(text || 'text', url || 'https://');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold mb-4">插入链接</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[#3c434a] mb-1">文本</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-[#c3c4c7] rounded px-3 py-2 text-sm"
              placeholder="显示文本"
            />
          </div>
          <div>
            <label className="block text-sm text-[#3c434a] mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-[#c3c4c7] rounded px-3 py-2 text-sm"
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-[#c3c4c7] rounded text-[#3c434a] hover:bg-[#f0f0f0]"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="px-4 py-2 text-sm bg-[#2271b1] text-white rounded hover:bg-[#135e96]"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (alt: string, url: string) => void;
}

function ImageModal({ open, onClose, onInsert }: ImageModalProps) {
  const [alt, setAlt] = useState('');
  const [url, setUrl] = useState('');

  if (!open) return null;

  const handleInsert = () => {
    onInsert(alt || 'alt', url || 'https://');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold mb-4">插入图片</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[#3c434a] mb-1">替代文本</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full border border-[#c3c4c7] rounded px-3 py-2 text-sm"
              placeholder="图片描述"
            />
          </div>
          <div>
            <label className="block text-sm text-[#3c434a] mb-1">图片地址</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-[#c3c4c7] rounded px-3 py-2 text-sm"
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-[#c3c4c7] rounded text-[#3c434a] hover:bg-[#f0f0f0]"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="px-4 py-2 text-sm bg-[#2271b1] text-white rounded hover:bg-[#135e96]"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

function MediaModal({ open, onClose, textareaRef, onInsertImage, onInsertLink }: MediaModalProps) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?page=${p}&pageSize=${PAGE_SIZE}`);
      const data = await res.json();
      setMediaList(data.media);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchMedia(1);
  }, [open, fetchMedia]);

  const handleSelect = (item: MediaItem) => {
    const ta = textareaRef.current;
    if (ta) {
      ta.focus();
    }
    if (item.type === 'image') {
      onInsertImage(item.title, item.url);
    } else {
      onInsertLink(item.title, item.url);
    }
    onClose();
  };

  const typeLabel: Record<string, string> = {
    image: '图片',
    video: '视频',
    audio: '音频',
    document: '文档',
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c3c4c7]">
          <h3 className="text-base font-semibold">插入媒体</h3>
          <button onClick={onClose} className="text-[#3c434a] hover:text-[#135e96] text-lg leading-none">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-center text-sm text-[#3c434a] py-8">加载中...</p>
          ) : mediaList.length === 0 ? (
            <p className="text-center text-sm text-[#3c434a] py-8">暂无媒体文件</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e0e0e0]">
                  <th className="w-16 text-left text-[#3c434a] font-medium px-3 py-2">类型</th>
                  <th className="text-left text-[#3c434a] font-medium px-3 py-2">标题</th>
                </tr>
              </thead>
              <tbody>
                {mediaList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="border-b border-[#e0e0e0] cursor-pointer hover:bg-[#2271b1] hover:text-white"
                  >
                    <td className="px-3 py-2">
                      <span className="text-xs px-1.5 py-0.5 bg-[#f0f0f0] text-[#3c434a] rounded">
                        {typeLabel[item.type] || item.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 truncate">
                      <div className="flex items-center gap-3">
                        {item.type === 'image' ? (
                          <div className="w-10 h-10 bg-[#f0f0f0] rounded overflow-hidden shrink-0">
                            <img src={item.thumbnailUrl || item.url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-[#f0f0f0] rounded flex items-center justify-center text-[#3c434a] shrink-0">
                            {item.type === 'video' ? '🎬' : item.type === 'audio' ? '🎵' : '📄'}
                          </div>
                        )}
                        <span>{item.title}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-3 border-t border-[#c3c4c7]">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchMedia(page - 1)}
              className="px-3 py-1 text-sm border border-[#c3c4c7] rounded disabled:opacity-40 hover:bg-[#f0f0f0]"
            >
              上一页
            </button>
            <span className="text-sm text-[#3c434a]">{page} / {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => fetchMedia(page + 1)}
              className="px-3 py-1 text-sm border border-[#c3c4c7] rounded disabled:opacity-40 hover:bg-[#f0f0f0]"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Toolbar Definition ───────────────────────────────────────────────────────

const toolbarGroups: ToolbarButton[][] = [
  [
    { icon: <IconH1 />, title: '标题 H1', insert: (ta) => insertAtStart(ta, '# ') },
    { icon: <IconH2 />, title: '标题 H2', insert: (ta) => insertAtStart(ta, '## ') },
    { icon: <IconH3 />, title: '标题 H3', insert: (ta) => insertAtStart(ta, '### ') },
  ],
  [
    { icon: <IconBold />, title: '粗体 (Ctrl+B)', insert: (ta) => insertWrap(ta, '**', '**') },
    { icon: <IconItalic />, title: '斜体 (Ctrl+I)', insert: (ta) => insertWrap(ta, '*', '*') },
    { icon: <IconStrikethrough />, title: '删除线', insert: (ta) => insertWrap(ta, '~~', '~~') },
  ],
  [
    { icon: <IconCode />, title: '行内代码', insert: (ta) => insertWrap(ta, '`', '`') },
    { icon: <IconCodeBlock />, title: '代码块', insert: (ta) => insertWrap(ta, '```\n', '\n```') },
  ],
  [
    { icon: <IconQuote />, title: '引用', insert: (ta) => insertAtStart(ta, '> ') },
    { icon: <IconUl />, title: '无序列表', insert: (ta) => insertAtStart(ta, '- ') },
    { icon: <IconOl />, title: '有序列表', insert: (ta) => insertAtStart(ta, '1. ') },
  ],
  [
    { icon: <IconHr />, title: '分割线', insert: (ta) => insertText(ta, '\n---\n') },
  ],
  [
    { icon: <IconImage />, title: '插入图片', insert: () => {}, modal: 'image' },
    { icon: <IconLink />, title: '插入链接', insert: () => {}, modal: 'link' },
    { icon: <IconAttachment />, title: '插入媒体', insert: () => {}, modal: 'media' },
  ],
];

// ─── MarkdownEditor ───────────────────────────────────────────────────────────

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertLink = (text: string, url: string) => {
    const linkMd = `[${text}](${url})`;
    const start = textareaRef.current?.selectionStart ?? 0;
    const end = textareaRef.current?.selectionEnd ?? 0;
    const newValue = value.substring(0, start) + linkMd + value.substring(end);
    onChange(newValue);
  };

  const insertImage = (alt: string, url: string) => {
    const imgMd = `![${alt}](${url})`;
    const start = textareaRef.current?.selectionStart ?? 0;
    const end = textareaRef.current?.selectionEnd ?? 0;
    const newValue = value.substring(0, start) + imgMd + value.substring(end);
    onChange(newValue);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-0 px-2 py-1.5 border border-b-0 border-[#c3c4c7] rounded-t bg-white shadow-sm">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title={showPreview ? '编辑' : '预览'}
            onClick={() => setShowPreview(!showPreview)}
            className={`inline-flex items-center justify-center w-8 h-8 rounded cursor-pointer text-sm select-none transition-colors ${
              showPreview
                ? 'bg-[#2271b1] text-white'
                : 'text-[#50575e] hover:bg-[#f0f0f0] hover:text-[#2271b1] active:bg-[#e0e0e0]'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 3C4.1 3 1.1 5.4 0 8c1.1 2.6 4.1 5 8 5s6.9-2.4 8-5c-1.1-2.6-4.1-5-8-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            </svg>
          </button>
        </div>
        <Separator />
        <div className="flex items-center gap-0.5">
          {toolbarGroups.map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <Separator />}
              {group.map((btn) => (
                <button
                  key={btn.title}
                  type="button"
                  title={btn.title}
                  disabled={showPreview}
                  onClick={() => {
                    if (btn.modal === 'image') { setImageModalOpen(true); return; }
                    if (btn.modal === 'link') { setLinkModalOpen(true); return; }
                    if (btn.modal === 'media') { setMediaModalOpen(true); return; }
                    const ta = textareaRef.current;
                    if (ta) btn.insert(ta);
                  }}
                  className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm select-none transition-colors ${
                    showPreview
                      ? 'text-[#c3c4c7] cursor-not-allowed'
                      : 'text-[#50575e] hover:bg-[#f0f0f0] hover:text-[#2271b1] active:bg-[#e0e0e0] cursor-pointer'
                  }`}
                >
                  {btn.icon}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      {showPreview ? (
        <div className="border border-[#c3c4c7] rounded-b p-4 min-h-[400px] bg-[#f6f7f7]">
          {value ? (
            <MarkdownViewer content={value} />
          ) : (
            <p className="text-[#646970]">暂无内容</p>
          )}
        </div>
      ) : (
        <>
          <MediaModal
            open={mediaModalOpen}
            onClose={() => setMediaModalOpen(false)}
            textareaRef={textareaRef as RefObject<HTMLTextAreaElement | null>}
            onInsertImage={insertImage}
            onInsertLink={insertLink}
          />
          <ImageModal
            open={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            onInsert={insertImage}
          />
          <LinkModal
            open={linkModalOpen}
            onClose={() => setLinkModalOpen(false)}
            onInsert={insertLink}
          />
          <textarea
            ref={textareaRef}
            placeholder="输入内容（支持 Markdown）"
            value={value}
            onChange={e => onChange(e.target.value)}
            onBlur={() => {
              if (textareaRef.current) onChange(textareaRef.current.value);
            }}
            rows={20}
            className="w-full resize-none font-mono text-sm rounded-t-none border-t-0"
          />
        </>
      )}
    </div>
  );
}

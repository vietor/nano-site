import { NextRequest, NextResponse } from 'next/server';
import { getSession, getPagedMedia, getMediaById, createMedia, updateMedia, deleteMedia } from '@/app/lib/model';
import { PAGE_SIZE } from '@/app/lib/constants';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { randomUUID } from 'crypto';

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: '未授权' }, { status: 401 }) };
  }
  return { session };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const media = getMediaById(Number(id));
    if (!media) {
      return NextResponse.json({ error: '媒体文件不存在' }, { status: 404 });
    }
    return NextResponse.json(media);
  }

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || String(PAGE_SIZE));
  const type = searchParams.get('type') as string | undefined;
  const {media, total, totalPages} = getPagedMedia(page, pageSize, type);
  return NextResponse.json({ media, total, totalPages, page, pageSize });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const thumbnail = formData.get('thumbnail') as File;
  const title = formData.get('title') as string;

  if (!file) {
    return NextResponse.json({ error: '文件为必填项' }, { status: 400 });
  }

  const baseName = randomUUID();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateDir = `${year}/${month}`;
  const mediaDir = join(process.cwd(), 'public', 'media', dateDir);
  if (!existsSync(mediaDir)) {
    await mkdir(mediaDir, { recursive: true });
  }

  const fileExtension = file.name.split('.').pop() || '';
  const fileName = `${baseName}.${fileExtension}`;
  const filePath = join(mediaDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(filePath, buffer);

  let thumbnailUrl: string | undefined;
  if (thumbnail) {
    const thumbName = `${baseName}_thumb.png`;
    const thumbPath = join(mediaDir, thumbName);
    const thumbArrayBuffer = await thumbnail.arrayBuffer();
    const thumbBuffer = Buffer.from(thumbArrayBuffer);
    await writeFile(thumbPath, thumbBuffer);
    thumbnailUrl = `/media/${dateDir}/${thumbName}`;
  }

  const url = `/media/${dateDir}/${fileName}`;
  const type = file.type.startsWith('audio/')
    ? 'audio'
    : file.type.startsWith('video/')
      ? 'video'
      : file.type.startsWith('application/') || ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'].includes('.' + fileExtension.toLowerCase())
        ? 'document'
        : 'image';

  const media = createMedia(title || file.name, type, url, thumbnailUrl);
  return NextResponse.json(media, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = await request.json();
  const { id, title } = body;

  if (!id || !title) {
    return NextResponse.json({ error: 'ID 和标题为必填项' }, { status: 400 });
  }

  const media = updateMedia(Number(id), title);
  if (!media) {
    return NextResponse.json({ error: '媒体文件不存在' }, { status: 404 });
  }

  return NextResponse.json(media);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const media = getMediaById(Number(id));
  if (!media) {
    return NextResponse.json({ error: '媒体文件不存在' }, { status: 404 });
  }

  const mediaDir = join(process.cwd(), 'public', 'media');
  const filePath = resolve(join(process.cwd(), 'public', media.url.replace(/^\//, '')));
  if (!filePath.startsWith(mediaDir)) {
    return NextResponse.json({ error: '无效的文件路径' }, { status: 400 });
  }
  if (existsSync(filePath)) {
    await unlink(filePath);
  }

  if (media.thumbnailUrl) {
    const thumbPath = resolve(join(process.cwd(), 'public', media.thumbnailUrl.replace(/^\//, '')));
    if (!thumbPath.startsWith(mediaDir)) {
      return NextResponse.json({ error: '无效的缩略图路径' }, { status: 400 });
    }
    if (existsSync(thumbPath)) {
      await unlink(thumbPath);
    }
  }

  deleteMedia(Number(id));
  return NextResponse.json({ success: true });
}

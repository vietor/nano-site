import { NextRequest, NextResponse } from 'next/server';
import { getSession, getPagedPosts, getPagedPublishedPosts, getPostById, createPost, updatePost, deletePost } from '@/app/lib/model';
import { PAGE_SIZE } from '@/app/lib/constants';
import { PostStatus } from '@/app/shared/types';

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
  const isAdmin = await getSession();

  if (id) {
    const post = getPostById(Number(id));
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }
    if (post.status === 'draft' && !isAdmin) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }
    return NextResponse.json(post);
  }

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || String(PAGE_SIZE));
  const status = searchParams.get('status') as PostStatus;

  if (isAdmin) {
    const { posts, total, totalPages } = getPagedPosts(page, pageSize, status);
    return NextResponse.json({ posts, total, totalPages, page, pageSize });
  }

  const { posts, total, totalPages } = getPagedPublishedPosts(page, pageSize);
  return NextResponse.json({ posts, total, totalPages, page, pageSize });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = await request.json();
  const { title, content, status } = body;

  if (!title || !content) {
    return NextResponse.json({ error: '标题和内容均为必填项' }, { status: 400 });
  }

  const postStatus = (status === 'draft') ? 'draft' : 'published';
  const post = createPost(title, content, postStatus);
  return NextResponse.json(post, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = await request.json();
  const { id, title, content, status } = body;

  if (!id || !title || !content) {
    return NextResponse.json({ error: 'ID、标题和内容均为必填项' }, { status: 400 });
  }

  const postStatus = (status === 'draft' || status === 'published') ? status : undefined;
  const post = updatePost(Number(id), title, content, postStatus);
  if (!post) {
    return NextResponse.json({ error: '文章不存在或无法将已发布文章转为草稿' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID 为必填项' }, { status: 400 });
  }

  const deleted = deletePost(Number(id));
  if (!deleted) {
    return NextResponse.json({ error: '文章不存在' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

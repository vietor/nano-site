import { NextRequest, NextResponse } from 'next/server';
import { getSession, loadConfig, saveConfig } from '@/app/lib/model';
import type { SiteConfig } from '@/app/shared/types';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }
  const config = loadConfig();
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description } = body as SiteConfig;

  if (!title || !description) {
    return NextResponse.json({ error: '无效的配置' }, { status: 400 });
  }

  saveConfig({ title, description });
  return NextResponse.json({ title, description });
}

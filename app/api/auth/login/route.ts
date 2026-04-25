import { NextRequest, NextResponse } from 'next/server';
import { validateUser, signSession } from '@/app/lib/model';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: '用户名和密码为必填项' }, { status: 400 });
  }

  const valid = validateUser(username, password);
  if (!valid) {
    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  }

  const sessionValue = JSON.stringify({
    username,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });
  const sessionCookie = signSession(sessionValue);

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
}

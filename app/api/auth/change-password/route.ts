import { NextRequest, NextResponse } from "next/server";
import { getSession, updatePassword, validateUser } from "@/app/lib/model";

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await request.json();
  const { currentPassword, newPassword, confirmPassword } = body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json(
      { error: "所有字段均为必填项" },
      { status: 400 },
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: "两次输入的新密码不一致" },
      { status: 400 },
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "密码至少需要6个字符" },
      { status: 400 },
    );
  }

  const isValid = validateUser(session.username, currentPassword);
  if (!isValid) {
    return NextResponse.json(
      { error: "当前密码错误" },
      { status: 400 },
    );
  }

  const updated = updatePassword(session.username, newPassword);
  if (!updated) {
    return NextResponse.json(
      { error: "密码更新失败" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

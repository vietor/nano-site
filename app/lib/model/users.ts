import { getDb, hashPassword, verifyPassword } from "./db";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

import type { User } from '@/app/shared/types';

export function validateUser(username: string, password: string): boolean {
  const db = getDb();
  const user = db
    .prepare("SELECT password_hash FROM users WHERE username = ?")
    .get(username) as { password_hash: string } | undefined;
  if (!user) return false;
  return verifyPassword(password, user.password_hash);
}

export function updatePassword(username: string, newPassword: string): boolean {
  const db = getDb();
  const result = db
    .prepare("UPDATE users SET password_hash = ? WHERE username = ?")
    .run(hashPassword(newPassword), username);
  return result.changes > 0;
}

export async function getSession(): Promise<{ username: string } | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    if (!sessionCookie) return null;
    const { value, signature } = parseSignedCookie(sessionCookie);
    if (!value || !signature) return null;
    if (!verifySessionSignature(value, signature)) return null;
    const session = JSON.parse(value);
    if (new Date(session.expires) < new Date()) return null;
    return { username: session.username };
  } catch {
    return null;
  }
}

function getSessionSecret(): string {
  const envSecret = process.env.SESSION_SECRET;
  if (envSecret) return envSecret;
  const secretPath = path.join(process.cwd(), "data", ".session-secret");
  try {
    return fs.readFileSync(secretPath, "utf-8");
  } catch {
    const secret = crypto.randomBytes(32).toString("hex");
    fs.mkdirSync(path.dirname(secretPath), { recursive: true });
    fs.writeFileSync(secretPath, secret, "utf-8");
    return secret;
  }
}

export function signSession(value: string): string {
  const secret = getSessionSecret();
  const signature = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${signature}`;
}

export function parseSignedCookie(cookie: string): { value: string; signature: string } {
  const lastDot = cookie.lastIndexOf(".");
  if (lastDot === -1) return { value: "", signature: "" };
  return { value: cookie.slice(0, lastDot), signature: cookie.slice(lastDot + 1) };
}

function verifySessionSignature(value: string, signature: string): boolean {
  const secret = getSessionSecret();
  const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

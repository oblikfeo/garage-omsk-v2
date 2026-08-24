import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "garage_admin";

const SESSION_MS = 12 * 60 * 60 * 1000;

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** Admin is unreachable until a password is configured on the server. */
export function adminConfigured(): boolean {
  return adminPassword().length > 0;
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || `garage-session:${adminPassword()}`;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function createSessionToken(): string {
  const expiresAt = String(Date.now() + SESSION_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (!safeEqual(signature, sign(expiresAt))) return false;
  return Number(expiresAt) > Date.now();
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function startSession(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

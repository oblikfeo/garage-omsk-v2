"use server";

import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  adminConfigured,
  checkPassword,
  endSession,
  isAuthed,
  startSession,
} from "@/lib/admin-auth";
import { defaultContent, normalizeContent, saveContent } from "@/lib/content";

export type LoginState = { error?: string };
export type SaveState = { ok: boolean; error?: string; savedAt?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!adminConfigured()) {
    return { error: "На сервере не задан ADMIN_PASSWORD — вход невозможен." };
  }

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Неверный пароль." };
  }

  await startSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/** Revalidating the root layout refreshes every public page at once. */
function refreshPublicSite(): void {
  revalidatePath("/", "layout");
}

export async function saveContentAction(raw: unknown): Promise<SaveState> {
  if (!(await isAuthed())) {
    return { ok: false, error: "Сессия истекла — войдите заново." };
  }

  try {
    await saveContent(normalizeContent(raw));
    refreshPublicSite();
    return { ok: true, savedAt: new Date().toISOString() };
  } catch (error) {
    return {
      ok: false,
      error: `Не удалось записать файл контента: ${(error as Error).message}`,
    };
  }
}

export async function resetContentAction(): Promise<SaveState> {
  if (!(await isAuthed())) {
    return { ok: false, error: "Сессия истекла — войдите заново." };
  }

  try {
    await saveContent(defaultContent);
    refreshPublicSite();
    return { ok: true, savedAt: new Date().toISOString() };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

const ALLOWED_IMAGES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export type UploadState = { ok: boolean; url?: string; error?: string };

export async function uploadImageAction(formData: FormData): Promise<UploadState> {
  if (!(await isAuthed())) {
    return { ok: false, error: "Сессия истекла — войдите заново." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Файл не выбран." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Файл больше 8 МБ." };
  }

  const ext = ALLOWED_IMAGES[file.type];
  if (!ext) {
    return { ok: false, error: "Поддерживаются только JPG, PNG и WebP." };
  }

  try {
    const dir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });

    const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
    await fs.writeFile(
      path.join(dir, name),
      Buffer.from(await file.arrayBuffer())
    );

    return { ok: true, url: `/uploads/${name}` };
  } catch (error) {
    return { ok: false, error: `Загрузка не удалась: ${(error as Error).message}` };
  }
}

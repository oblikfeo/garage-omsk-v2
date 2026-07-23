const fallback = "https://garage-omsk.example";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL;

  if (!url) {
    return fallback;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url.replace(/\/$/, "");
  }

  return `https://${url.replace(/\/$/, "")}`;
}

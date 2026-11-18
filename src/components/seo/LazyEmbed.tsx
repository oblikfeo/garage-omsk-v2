"use client";

import { Map, Play } from "lucide-react";
import { useState } from "react";

/** Third-party iframe (map, video) that loads only after a click. */
export default function LazyEmbed({
  src,
  title,
  kind = "video",
  label,
  className = "aspect-video",
}: {
  src: string;
  title: string;
  kind?: "video" | "map";
  label?: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const Icon = kind === "map" ? Map : Play;

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-graphite-deep ${className}`}>
      {active ? (
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-blueprint text-offwhite transition-colors hover:bg-white/5"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-graphite-deep shadow-glow">
            <Icon className="h-6 w-6" />
          </span>
          <span className="text-sm font-semibold">{label ?? (kind === "map" ? "Показать карту" : "Смотреть видео")}</span>
        </button>
      )}
    </div>
  );
}

/** YouTube / Rutube / VK Video page URL → embeddable URL. Unknown URLs pass through. */
export function videoEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  const rutube = url.match(/rutube\.ru\/video\/([\w]+)/);
  if (rutube) return `https://rutube.ru/play/embed/${rutube[1]}?autoplay=1`;
  const vk = url.match(/vk(?:video)?\.(?:com|ru)\/video(-?\d+)_(\d+)/);
  if (vk) return `https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}&autoplay=1`;
  return url;
}

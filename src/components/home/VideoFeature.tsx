"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // 视频是否已激活（自动或手动）。激活后挂载 iframe 并自动播放。
  const [activated, setActivated] = useState(false);
  // 封面图回退（maxresdefault 在少数视频上不存在，回退到 hqdefault）
  const [thumbSrc, setThumbSrc] = useState(
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  );

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // 激活后使用的嵌入地址：自动播放 + 静音 + 循环（playlist 参数与 videoId 一致才能 loop）
  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  // IntersectionObserver：视频进入视口时自动激活（静音自动播放受浏览器允许）
  useEffect(() => {
    if (activated || typeof IntersectionObserver === "undefined") return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivated(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activated]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {activated ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label={`Play ${title}`}
            className="absolute inset-0 flex items-center justify-center focus:outline-none"
          >
            {/* 封面缩略图 */}
            <img
              src={thumbSrc}
              alt={title}
              loading="lazy"
              onError={() =>
                setThumbSrc(
                  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                )
              }
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* 渐变遮罩，让播放按钮更突出 */}
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
            {/* 播放按钮 */}
            <span className="relative z-10 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg shadow-black/40 transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 md:h-9 md:w-9 fill-current" />
            </span>
            {/* 视频标题 */}
            <span className="absolute bottom-4 left-4 right-4 z-10 text-left text-sm md:text-base font-semibold text-white drop-shadow">
              {title}
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "../utils/helpers";

/**
 * Premium custom video player for Noorvi Journal posts.
 * — lazy (preload="metadata" + poster)
 * — pauses automatically when scrolled off-screen
 * — never autoplays with audio
 * — preserves 16:9 / 9:16 ratios without distortion (object-contain)
 */
export default function VideoPlayer({
  src,
  poster,
  ratio = "16/9",
  title,
  className,
}: {
  src: string;
  poster?: string;
  ratio?: "16/9" | "9/16";
  title?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const [fs, setFs] = useState(false);

  /* Pause when out of viewport */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || failed) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !v.paused) v.pause();
      },
      { threshold: 0.12 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [failed, src]);

  useEffect(() => {
    const fn = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => setFailed(true));
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFs = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrapRef.current?.requestFullscreen?.().catch(() => setFailed(true));
  };

  const fmt = (s: number) => {
    if (!isFinite(s) || s <= 0) return "0:00";
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${m}:${String(ss).padStart(2, "0")}`;
  };

  return (
    <div
      ref={wrapRef}
      className={cn(
        "group/vp relative overflow-hidden bg-espresso",
        ratio === "9/16" ? "aspect-[9/16]" : "aspect-video",
        className
      )}
    >
      {failed ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="font-display text-4xl text-gold">✦</span>
          <p className="font-display text-2xl text-ivory italic">This video is taking a breather.</p>
          <p className="max-w-xs text-xs leading-relaxed text-ivory/60">
            Check your connection — or catch it on our Instagram @noorvi__fashion_
          </p>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster || undefined}
          preload="metadata"
          playsInline
          muted={muted}
          aria-label={title ?? "Noorvi fashion video"}
          className="h-full w-full object-contain"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onError={() => setFailed(true)}
        />
      )}

      {/* Centre play button while paused */}
      {!failed && !playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Play video${title ? `: ${title}` : ""}`}
          className="absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/60 bg-espresso/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-gold hover:bg-gold/90"
        >
          <Play className="ml-1 h-8 w-8 text-ivory" fill="currentColor" />
        </button>
      )}

      {/* Control bar */}
      {!failed && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-espresso/95 via-espresso/60 to-transparent px-4 pt-8 pb-3 transition-opacity duration-300",
            playing ? "opacity-100 md:opacity-0 md:group-hover/vp:opacity-100 md:focus-within:opacity-100" : "opacity-100"
          )}
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ivory transition-colors hover:text-gold"
          >
            {playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="ml-0.5 h-5 w-5" fill="currentColor" />}
          </button>
          <span className="w-10 shrink-0 text-[11px] font-medium tracking-wide text-ivory/85 tabular-nums">
            {fmt(time)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            aria-label="Seek video"
            onChange={(e) => {
              const v = videoRef.current;
              if (!v) return;
              v.currentTime = Number(e.target.value);
              setTime(v.currentTime);
            }}
            className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-ivory/25 accent-gold"
          />
          <span className="hidden w-10 shrink-0 text-right text-[11px] font-medium tracking-wide text-ivory/60 tabular-nums sm:block">
            {fmt(duration)}
          </span>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ivory transition-colors hover:text-gold"
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={toggleFs}
            aria-label={fs ? "Exit fullscreen" : "Fullscreen"}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-ivory transition-colors hover:text-gold sm:flex"
          >
            {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}

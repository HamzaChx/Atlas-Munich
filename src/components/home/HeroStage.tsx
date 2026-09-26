"use client";

import * as React from "react";
import Image from "next/image";

/* The homepage film stage: a silent loop cut from hero_into.mp4 so its last
   frame dissolves into its first (public/hero/hero-loop.mp4, audio removed).

   The poster is a real <Image preload>, not the <video poster> attribute, so
   it is optimised, preloaded and counts as the LCP element. The video sits on
   top at opacity 0 and only fades in once frames are actually playing, which
   means reduced-motion readers, data savers and failed loads all simply keep
   the still.

   This owns the whole stage rather than just the media layer because the
   copy rises and drifts with transforms, and a transformed ancestor would
   become the containing block of an absolutely positioned video. Media and
   copy stay siblings here. */

const SRC = "/hero/hero-loop.mp4";
const POSTER = "/hero/hero-poster.jpg";

interface HeroStageProps {
  children: React.ReactNode;
  /** Short line set beside the control, bottom right on desktop. */
  caption: React.ReactNode;
  playLabel: string;
  pauseLabel: string;
}

export function HeroStage({ children, caption, playLabel, pauseLabel }: HeroStageProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const ringRef = React.useRef<SVGCircleElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  /* A choice the reader made with the button outranks every automatic rule
     below: once they pause, scrolling back into view must not restart it. */
  const userPaused = React.useRef(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React does not reliably serialise `muted`, and browsers only allow
    // autoplay on muted media, so set the property itself.
    video.muted = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;
    if (reduceMotion || saveData) userPaused.current = true;

    const tryPlay = () => {
      if (userPaused.current) return;
      video.play().catch(() => {
        /* Autoplay refused (low-power mode, policy): the poster stays up and
           the button offers a manual start. */
      });
    };

    // Off-screen, the film only costs battery.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  // Progress ring on the control, written straight to the DOM each frame so
  // the loop never re-renders React.
  React.useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      const ring = ringRef.current;
      if (video && ring && video.duration) {
        ring.style.strokeDashoffset = String(1 - video.currentTime / video.duration);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const label = playing ? pauseLabel : playLabel;

  return (
    <div className="hero-stage relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-zinc-950">
      <div className="hero-media absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src={POSTER}
          alt=""
          fill
          preload
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => {
            setPlaying(true);
            setVisible(true);
          }}
          onPause={() => setPlaying(false)}
        >
          <source src={SRC} type="video/mp4" />
        </video>
        {/* One flat wash in the film's own lamplit brown rather than grey
            black, so it deepens the room instead of dimming it. Measured over
            every frame of the loop: at 46%, cream body copy holds 4.5:1 and
            the gold line 5:1 on the brightest frames. */}
        <div className="absolute inset-0 bg-[oklch(0.2_0.03_55/0.46)]" />
      </div>

      <div className="hero-copy mx-auto grid w-full max-w-[1280px] gap-8 px-5 pb-28 pt-32 sm:px-6 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 lg:px-8 lg:pb-24 2xl:max-w-[96rem] 2xl:px-12">
        <div className="min-w-0">{children}</div>

        <div className="rise rise-4 flex items-center justify-between gap-4 border-t border-hero-cream/15 pt-5 lg:justify-end lg:border-0 lg:pt-0">
          <p className="text-sm font-medium tracking-[0.01em] text-hero-cream/75">{caption}</p>
          <button
            type="button"
            onClick={toggle}
            aria-label={label}
            title={label}
            className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-hero-cream/10 text-hero-cream ring-1 ring-hero-cream/25 transition-colors duration-200 hover:bg-hero-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold"
          >
            <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle
                ref={ringRef}
                cx="24"
                cy="24"
                r="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
                className={`transition-opacity duration-300 ${playing ? "opacity-90" : "opacity-0"}`}
              />
            </svg>
            {playing ? (
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <rect x="3" y="2" width="3.5" height="12" rx="1" />
                <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <path d="M4 2.6v10.8a1 1 0 0 0 1.5.86l8.6-5.4a1 1 0 0 0 0-1.72L5.5 1.74A1 1 0 0 0 4 2.6Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

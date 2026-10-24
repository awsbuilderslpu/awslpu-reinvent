"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const elements = hero.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      id="overview"
      className="relative isolate flex h-svh min-h-170 max-h-275 items-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 -z-30">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        >
          <source src="/videos/website_loop_forever.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 -z-20 bg-black/35" />

      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/45 to-transparent" />

      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-transparent to-black/25" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_85%,rgba(255,0,212,0.2),transparent_45%),radial-gradient(ellipse_at_90%_65%,rgba(108,0,255,0.16),transparent_40%)]" />

      <div className="mx-auto w-full max-w-[1600px] px-6 pb-10 pt-32 sm:px-10 sm:pt-36 lg:px-16">
        <div className="max-w-5xl">
          <p
            data-reveal
            className="reveal mb-5 text-sm font-medium text-white/85 sm:text-base"
          >
            AWS Student Builder Group{" "}
            <span className="text-[#FF00D4]">·</span> LPU
          </p>

          <h1
            data-reveal
            className="reveal reveal-delay-1 text-[clamp(4.5rem,13vw,12rem)] font-light leading-[0.76] tracking-[-0.09em] text-white"
          >
            re<span className="text-[#FF2D87]">:</span>
            <br />
            Invent
          </h1>

          <div data-reveal className="reveal reveal-delay-2 mt-9 max-w-xl">
            <p className="text-sm font-light leading-7 text-white/90 sm:text-base sm:leading-8">
              Five days of technology, ideas, and building what's next.
              Join developers, students, and innovators at Lovely
              Professional University.
            </p>

            <p className="mt-4 text-sm text-white/70">
              November 30 to December 4, 2026
            </p>
          </div>

          <div data-reveal className="reveal reveal-delay-3 mt-8">
            <Link
              href="#register"
              className="group inline-flex min-h-14 items-center gap-8 border border-[#FF00D4]/70 bg-linear-to-r from-[#FF00D4]/20 via-[#C000FF]/15 to-[#6C00FF]/20 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:border-[#FF2D87] hover:from-[#FF00D4]/35 hover:via-[#C000FF]/25 hover:to-[#6C00FF]/35"
            >
              Explore the festival
              <span className="text-base text-[#FF2D87] transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
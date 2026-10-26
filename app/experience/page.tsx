"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

const experiences = [
  {
    number: "01",
    title: "WATCH.",
    label: "THE BIG PICTURE",
    description:
      "Follow the keynotes, announcements, and conversations shaping the future of AWS and cloud technology.",
  },
  {
    number: "02",
    title: "DISCOVER.",
    label: "WHAT'S NEXT",
    description:
      "Explore emerging technologies, new services, and ideas that could change the way you build.",
  },
  {
    number: "03",
    title: "DISCUSS.",
    label: "IDEAS IN MOTION",
    description:
      "Exchange perspectives, ask questions, and explore the latest developments alongside fellow builders.",
  },
  {
    number: "04",
    title: "CONNECT.",
    label: "YOUR PEOPLE",
    description:
      "Meet fellow developers, share experiences, and become part of a community that loves building.",
  },
];

const journey = [
  ["30 NOV", "THE BEGINNING"],
  ["01 DEC", "NEW PERSPECTIVES"],
  ["02 DEC", "IDEAS & POSSIBILITIES"],
  ["03 DEC", "BEYOND THE ANNOUNCEMENTS"],
  ["04 DEC", "WHAT COMES NEXT"],
];

export default function ExperiencePage() {
  const [videoBlend, setVideoBlend] = useState(0);

  useEffect(() => {
    const transitionScene = document.querySelector<HTMLElement>(
      '[data-video-scene="second"]',
    );

    if (!transitionScene) return;

    let ticking = false;

    const updateBlend = () => {
      const rect = transitionScene.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.2;

      const progress = Math.max(
        0,
        Math.min(1, (start - rect.top) / (start - end)),
      );

      setVideoBlend(progress);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(updateBlend);
    };

    updateBlend();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateBlend);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateBlend);
    };
  }, []);

  return (
    <main className="relative isolate min-h-screen overflow-clip bg-[#050505] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ opacity: 1 - videoBlend }}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/website_loop_forever.mp4" type="video/mp4" />
        </video>

        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ opacity: videoBlend }}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/about_neon_waves.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,0,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.35),transparent_35%,rgba(5,5,5,0.45))]" />
      </div>

      <section
        data-video-scene="first"
        className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-8 pt-32 sm:px-10 md:px-16 md:pb-12 lg:px-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.55),transparent_90%)]" />

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end">
          <p className="mb-8 flex items-center gap-3 text-xs tracking-[0.22em] text-white/70 sm:text-sm">
            <span className="h-px w-8 bg-[#FF00D4]" />
            THE EXPERIENCE
          </p>

          <h1 className="text-[clamp(4rem,12vw,11rem)] font-extrabold leading-[0.78] tracking-[-0.09em]">
            NOT JUST
            <br />A <span className="text-[#FF00D4]">WATCH</span>
            <br />
            PARTY.
          </h1>

          <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg md:text-xl">
              Five days of cloud innovation, fresh perspectives, and people
              ready to explore what&apos;s next.
            </p>

            <Link
              href="#the-experience"
              className="group inline-flex w-fit shrink-0 items-center gap-4 text-xs font-semibold tracking-[0.12em] transition-colors hover:text-[#FF2D87] sm:text-sm"
            >
              EXPLORE THE EXPERIENCE
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-all group-hover:border-[#FF00D4] group-hover:bg-[#FF00D4]/10">
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </span>
            </Link>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-white/20 pt-5 text-xs tracking-[0.12em] text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <span>AWS STUDENT BUILDER GROUP · LPU</span>
            <span>30 NOV — 04 DEC 2026</span>
            <span>PHAGWARA, PUNJAB</span>
          </div>
        </div>
      </section>

      <section
        id="the-experience"
        className="relative z-10 scroll-mt-20 px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.35),rgba(5,5,5,0.08))]" />

        <div className="relative mx-auto max-w-[1600px]">
          <div className="mb-16 grid gap-8 md:mb-20 md:grid-cols-[1fr_0.65fr] md:items-end">
            <div>
              <p className="mb-8 text-xs tracking-[0.2em] text-[#FF2D87] sm:text-sm">
                FOUR WAYS TO EXPERIENCE IT
              </p>

              <h2 className="text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.85] tracking-[-0.08em]">
                TAKE IT
                <br />
                <span className="text-white/40">ALL IN.</span>
              </h2>
            </div>

            <p className="max-w-lg text-base leading-8 text-white/70 sm:text-lg">
              Follow the latest developments, discover something new, and
              share the experience with people who are just as curious as you
              are.
            </p>
          </div>

          <div className="border-t border-white/25">
            {experiences.map((experience) => (
              <article
                key={experience.number}
                className="group grid gap-5 border-b border-white/25 py-9 md:grid-cols-[70px_1fr_1fr] md:items-center md:gap-8 md:py-12"
              >
                <span className="text-sm tracking-widest text-[#FF2D87]">
                  {experience.number}
                </span>

                <div>
                  <p className="mb-3 text-[10px] tracking-[0.2em] text-white/55 sm:text-xs">
                    {experience.label}
                  </p>

                  <h3 className="text-3xl font-bold tracking-[-0.065em] transition-colors group-hover:text-[#FF00D4] sm:text-4xl md:text-5xl">
                    {experience.title}
                  </h3>
                </div>

                <p className="max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                  {experience.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        data-video-scene="second"
        className="relative z-10 overflow-hidden px-6 py-24 sm:px-10 md:px-16 md:py-32 lg:px-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.3),rgba(5,5,5,0.1))]" />

        <div className="relative mx-auto max-w-[1600px]">
          <p className="mb-8 text-xs tracking-[0.2em] text-[#FF2D87] sm:text-sm">
            ONE COMMUNITY. FIVE DAYS.
          </p>

          <h2 className="text-[clamp(3.5rem,8vw,7.5rem)] font-bold leading-[0.84] tracking-[-0.08em]">
            EVERY DAY
            <br />
            <span className="text-white/40">BRINGS A</span>
            <br />
            NEW PERSPECTIVE.
          </h2>

          <p className="mt-8 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
            Five days to follow the conversation, explore new ideas, and
            discover what the future of cloud technology might hold.
          </p>

          <div className="mt-16 border-t border-white/25">
            {journey.map(([date, title], index) => (
              <div
                key={date}
                className="grid grid-cols-[40px_1fr] gap-4 border-b border-white/25 py-6 sm:grid-cols-[64px_140px_1fr] sm:items-center sm:gap-8 sm:py-8"
              >
                <span className="text-xs tracking-widest text-[#FF2D87] sm:text-sm">
                  0{index + 1}
                </span>

                <span className="text-sm text-white/65 sm:text-base">
                  {date}
                </span>

                <h3 className="text-lg font-semibold tracking-tight sm:text-2xl">
                  {title}
                </h3>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs leading-6 text-white/55">
            These are thematic labels for the five-day journey, not a confirmed
            session agenda. Check the schedule for published activities.
          </p>

          <Link
            href="/schedule"
            className="group mt-10 inline-flex items-center gap-3 text-sm font-semibold transition-colors hover:text-[#FF2D87]"
          >
            VIEW THE SCHEDULE
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden px-6 py-24 sm:px-10 md:px-16 md:py-32 lg:px-24">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.3),rgba(5,5,5,0.1))]" />

        <div className="relative mx-auto w-full max-w-[1600px]">
          <p className="mb-8 flex items-center gap-3 text-xs tracking-[0.2em] text-[#FF2D87] sm:text-sm">
            <span className="h-px w-8 bg-[#FF00D4]" />
            THE PEOPLE MAKE IT
          </p>

          <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.085em]">
            BETTER
            <br />
            <span className="text-[#FF00D4]">TOGETHER.</span>
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_0.7fr] md:items-end md:gap-16">
            <p className="max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl md:text-2xl">
              Hosted by AWS Student Builder Group at Lovely Professional
              University, this watch party brings the student developer
              community together around a shared curiosity for technology.
            </p>

            <div className="border-t border-white/30 pt-6">
              <p className="text-sm font-semibold tracking-wide">
                AWS STUDENT BUILDER GROUP
              </p>

              <p className="mt-2 text-sm text-white/65">
                Lovely Professional University
              </p>

              <p className="mt-6 text-xs leading-6 text-white/55">
                This is an independently organized community watch party,
                not an official AWS re:Invent event or an endorsement by AWS.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-t border-white/15 px-6 py-28 sm:px-10 md:px-16 md:py-40 lg:px-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(108,0,255,0.18),transparent_60%)]" />

        <div className="relative mx-auto max-w-[1400px] text-center">
          <p className="mb-8 text-xs tracking-[0.2em] text-[#FF2D87] sm:text-sm">
            YOUR NEXT CHAPTER
          </p>

          <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.085em]">
            STAY
            <br />
            <span className="text-[#FF00D4]">CURIOUS.</span>
          </h2>

          <p className="mx-auto mt-9 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
            Follow the ideas. Meet the community. Discover what you&apos;ll
            build next.
          </p>

          <Link
            href="/schedule"
            className="group mt-10 inline-flex items-center gap-4 bg-[#FF00D4] px-7 py-4 text-sm font-semibold text-black transition-colors hover:bg-[#FF2D87]"
          >
            EXPLORE THE SCHEDULE
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#050505]/40 to-transparent" />
    </main>
  );
}
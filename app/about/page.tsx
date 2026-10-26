import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

const experiences = [
  {
    number: "01",
    title: "Discover.",
    description:
      "Explore the announcements, ideas, and innovations shaping the future of cloud computing.",
  },
  {
    number: "02",
    title: "Experiment.",
    description:
      "Take inspiration beyond the screen. Find new technologies to explore and new things to build.",
  },
  {
    number: "03",
    title: "Connect.",
    description:
      "Meet people who share your curiosity, exchange ideas, and become part of something bigger.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <section className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden px-6 pb-8 pt-32 sm:px-10 md:min-h-screen md:px-16 md:pb-12 lg:px-24">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover"
        >
          <source
            src="/videos/about_neon_waves.mp4"
            type="video/mp4"
          />
        </video>

        <div className="pointer-events-none absolute inset-0 -z-20 bg-black/45" />

        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0.45)_55%,rgba(5,5,5,0.12)_100%)]" />

        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(0deg,#050505_0%,rgba(5,5,5,0.1)_35%,rgba(5,5,5,0.12)_75%,#050505_100%)]" />

        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,0,255,0.10),transparent_55%)]" />

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-[#FF00D4]" />
            <span className="text-xs tracking-[0.22em] text-white/70 sm:text-sm">
              THE STORY
            </span>
          </div>

          <h1 className="max-w-[1200px] text-[clamp(4rem,11.5vw,10.5rem)] font-extrabold leading-[0.78] tracking-[-0.085em]">
            BUILT BY
            <br />
            THE <span className="text-[#FF00D4]">CURIOUS.</span>
          </h1>

          <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg md:text-xl">
              Five days of cloud innovation, fresh perspectives, and people
              who want to build what comes next.
            </p>

            <Link
              href="#story"
              className="group inline-flex w-fit shrink-0 items-center gap-4 text-xs font-semibold tracking-[0.12em] transition-colors hover:text-[#FF2D87] sm:text-sm"
            >
              THIS IS OUR STORY
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-all group-hover:border-[#FF00D4] group-hover:bg-[#FF00D4]/10">
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </span>
            </Link>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-white/20 pt-5 text-xs tracking-[0.12em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <span>AWS STUDENT BUILDER GROUP · LPU</span>
            <span>30 NOV - 04 DEC 2026</span>
            <span>PHAGWARA, PUNJAB</span>
          </div>
        </div>
      </section>

      <section
        id="story"
        className="relative scroll-mt-20 px-6 py-28 sm:px-10 md:px-16 md:py-40 lg:px-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,0,255,0.10),transparent_55%)]" />

        <div className="relative mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="mb-8 text-xs tracking-[0.2em] text-[#FF2D87] sm:text-sm">
              A COMMUNITY, NOT JUST AN EVENT.
            </p>

            <h2 className="max-w-3xl text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.88] tracking-[-0.075em]">
              BIG IDEAS.
              <br />
              <span className="text-white/35">SHARED</span>
              <br />
              ENERGY.
            </h2>
          </div>

          <div className="flex flex-col justify-end lg:pb-2">
            <p className="text-lg leading-relaxed text-white/75 sm:text-xl sm:leading-9">
              Technology moves fast. The best way to keep up is to learn,
              explore, and build together.
            </p>

            <p className="mt-6 text-base leading-8 text-white/50 sm:text-lg">
              The re:Invent Watch Party brings the student developer community
              together to follow AWS announcements, explore emerging
              technologies, exchange ideas, and find inspiration for what to
              build next.
            </p>

            <p className="mt-6 text-base leading-8 text-white/50 sm:text-lg">
              Whether you&apos;re already working in the cloud or taking your
              first steps, there&apos;s room to be curious, ask questions, and
              discover something new.
            </p>

            <div className="mt-10 border-l-2 border-[#FF00D4] py-2 pl-5">
              <p className="text-lg font-medium tracking-tight text-white sm:text-xl">
                Come for the ideas.
                <br />
                Stay for the people.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/10 px-6 py-24 sm:px-10 md:px-16 md:py-32 lg:px-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(255,0,212,0.06),transparent_45%)]" />

        <div className="relative mx-auto max-w-[1600px]">
          <div className="mb-16 md:mb-20">
            <p className="mb-7 text-xs tracking-[0.2em] text-[#FF2D87] sm:text-sm">
              WHAT BRINGS US TOGETHER
            </p>

            <h2 className="max-w-4xl text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.88] tracking-[-0.075em]">
              WATCH IT.
              <br />
              <span className="text-white/35">QUESTION IT.</span>
              <br />
              BUILD ON IT.
            </h2>
          </div>

          <div className="border-t border-white/15">
            {experiences.map((experience) => (
              <div
                key={experience.number}
                className="group grid gap-5 border-b border-white/15 py-8 md:grid-cols-[80px_1fr_1fr] md:items-center md:gap-8 md:py-10"
              >
                <span className="text-sm tracking-widest text-[#FF2D87]">
                  {experience.number}
                </span>

                <h3 className="text-3xl font-bold tracking-[-0.06em] transition-colors group-hover:text-[#FF00D4] sm:text-4xl md:text-5xl">
                  {experience.title}
                </h3>

                <p className="max-w-xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
                  {experience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_50%,rgba(108,0,255,0.12),transparent_50%)]" />

        <div className="relative mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <p className="mb-8 text-xs tracking-[0.2em] text-[#FF2D87] sm:text-sm">
              THE PEOPLE BEHIND IT
            </p>

            <h2 className="text-[clamp(3.5rem,8vw,5.5rem)] font-extrabold leading-[0.82] tracking-[-0.085em]">
              COMMUNITY
              <br />
              <span className="text-[#FF00D4]">FIRST.</span>
            </h2>
          </div>

          <div>
            <p className="text-xl leading-relaxed text-white/75 sm:text-2xl sm:leading-10">
              Created by builders, for builders. The re:Invent Watch Party is
              hosted by AWS Student Builder Group at Lovely Professional
              University.
            </p>

            <div className="mt-10 flex items-center gap-5 border-t border-white/15 pt-7">

              <div>
                <p className="text-base font-semibold sm:text-lg">
                  AWS Student Builder Group
                </p>
                <p className="mt-1 text-sm text-white/45">
                  Lovely Professional University
                </p>
              </div>
            </div>

            <p className="mt-8 max-w-xl text-xs leading-6 text-white/35">
              This is an independently organized community watch party. It is
              not an official AWS re:Invent event and is not endorsed by AWS.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 px-6 py-28 sm:px-10 md:px-16 md:py-40 lg:px-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(108,0,255,0.16),transparent_60%)]" />

        <div className="relative mx-auto max-w-[1400px] text-center">
          <p className="mb-8 text-xs tracking-[0.2em] text-[#FF2D87] sm:text-sm">
            30 NOV - 04 DEC 2026
          </p>

          <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.085em]">
            THE NEXT
            <br />
            <span className="text-[#FF00D4]">CHAPTER</span>
            <br />
            STARTS HERE.
          </h2>

          <p className="mx-auto mt-9 max-w-lg text-base leading-7 text-white/50 sm:text-lg">
            Five days. New perspectives. One community of people ready to
            explore what&apos;s next.
          </p>

          <Link
            href="/schedule"
            className="group mt-10 inline-flex items-center gap-4 bg-[#FF00D4] px-7 py-4 text-sm font-semibold text-black transition-colors hover:bg-[#FF2D87]"
          >
            EXPLORE THE SCHEDULE
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
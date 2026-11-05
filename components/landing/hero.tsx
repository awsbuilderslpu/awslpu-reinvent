import Link from "next/link";

export function Hero() {
  return (
    <section
      id="overview"
      className="relative isolate flex min-h-170 h-svh max-h-275 items-center overflow-hidden bg-black text-white max-sm:min-h-155"
    >
      <div className="absolute inset-0 -z-30">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover object-[58%_center] sm:object-center"
        >
          <source src="/videos/website_loop_forever.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 -z-20 bg-black/35" />

      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-transparent to-black/30" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_85%,rgba(255,0,212,0.16),transparent_45%),radial-gradient(ellipse_at_90%_65%,rgba(108,0,255,0.12),transparent_40%)]" />

      <div className="mx-auto w-full max-w-[1600px] px-5 pb-12 pt-24 sm:px-10 sm:pb-10 sm:pt-32 lg:px-16">
        <div className="max-w-5xl">
          <p
            data-reveal
            suppressHydrationWarning
            className="reveal mb-5 text-sm font-medium text-white/85 sm:text-base"
          >
            AWS Student Builder Group{" "}
            <span className="text-[#FF00D4]">·</span> LPU
          </p>

          <h1
            data-reveal
            suppressHydrationWarning
            className="reveal reveal-delay-1 text-[clamp(4rem,17vw,7rem)] font-light leading-[0.82] tracking-[-0.085em] sm:text-[clamp(5rem,13vw,12rem)] sm:leading-[0.76]"
          >
            re<span className="text-[#FF2D87]">:</span>
            <br />
            Invent
          </h1>

          <div
            data-reveal
            suppressHydrationWarning
            className="reveal reveal-delay-2 mt-7 max-w-xl sm:mt-9"
          >
            <p className="max-w-lg text-sm font-light leading-6 text-white/90 sm:text-base sm:leading-8">
              Five days of technology, ideas, and building what's next. Join
              developers, students, and innovators at Lovely Professional
              University.
            </p>

            <p className="mt-3 text-sm text-white/70 sm:mt-4">
              November 30 to December 4, 2026
            </p>
          </div>

          <div
            data-reveal
            suppressHydrationWarning
            className="reveal reveal-delay-3 mt-7 sm:mt-8"
          >
            <Link
              href="/tickets"
              className="group inline-flex min-h-12 items-center gap-6 border border-[#FF00D4]/70 bg-linear-to-r from-[#FF00D4]/20 via-[#C000FF]/15 to-[#6C00FF]/20 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-[#FF2D87] hover:from-[#FF00D4]/35 hover:via-[#C000FF]/25 hover:to-[#6C00FF]/35 sm:min-h-14 sm:gap-8 sm:px-6 sm:py-4"
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
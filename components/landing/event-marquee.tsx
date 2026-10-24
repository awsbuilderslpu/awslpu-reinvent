"use client";

const items = [
  "RE:INVENT FEST 2026",
  "NOV 30 - DEC 04, 2026",
  "LOVELY PROFESSIONAL UNIVERSITY",
  "AWS STUDENT BUILDER GROUP · LPU",
];

export function EventMarquee() {
  return (
    <section
      aria-label="Event details"
      className="relative overflow-hidden border-y border-[#FF00D4]/20 bg-black py-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(108,0,255,0.08),transparent_35%,rgba(255,0,212,0.08))]" />

      <div className="relative flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-8 px-8 sm:gap-12 sm:px-12"
              >
                <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] text-white/75 sm:text-xs">
                  {item}
                </span>

                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#FF00D4] shadow-[0_0_10px_rgba(255,0,212,0.7)]"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
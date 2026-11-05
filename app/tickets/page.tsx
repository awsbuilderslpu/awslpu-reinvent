"use client";

export default function TicketsPage() {
  return (
    <main className="relative min-h-[90svh] flex flex-col justify-center overflow-hidden bg-[#050505] text-white">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,0,255,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_65%,rgba(255,0,212,0.10),transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-20 pt-32 sm:px-10 sm:pt-36 lg:px-16">
        <div className="max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#FF00D4]" />
            <span className="text-xs tracking-[0.22em] text-white/70 sm:text-sm">
              PASSES & REGISTRATION
            </span>
          </div>

          <h1 className="text-[clamp(3.5rem,8.5vw,8rem)] font-extrabold leading-[0.84] tracking-[-0.085em]">
            PASSES WILL BE
            <br />
            <span className="text-[#FF00D4]">AVAILABLE</span>
            <br />
            SOON.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Official registration and passes will be available soon.
          </p>

          <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs tracking-[0.12em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <span>AWS STUDENT BUILDER GROUP · LPU</span>
            <span>30 NOV — 04 DEC 2026</span>
            <span>PHAGWARA, PUNJAB</span>
          </div>
        </div>
      </div>
    </main>
  );
}

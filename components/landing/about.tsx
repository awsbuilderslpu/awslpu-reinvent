export function About() {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-[#050505] px-5 py-14 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,0,255,0.10),transparent_55%)]"
      />

      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-12 sm:gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <div className="min-w-0">
            <p className="reveal mb-6 text-sm font-medium text-white/60 sm:mb-8">
              A new chapter in campus technology
            </p>

            <h2 className="reveal reveal-delay-1 text-[clamp(3.5rem,15vw,5.5rem)] font-light leading-[0.88] tracking-[-0.075em] sm:text-[clamp(4.5rem,9vw,8rem)]">
              Imagine.
              <br />
              Build.
              <br />
              <span className="bg-linear-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">
                Re:Invent.
              </span>
            </h2>

            <p className="reveal reveal-delay-2 mt-7 max-w-xl text-[15px] font-light leading-7 text-white/65 sm:mt-10 sm:text-lg sm:leading-9">
              Five days dedicated to the people who turn curiosity into
              creation. Re:Invent Fest 2026 brings developers, students,
              and innovators together to explore technology, exchange ideas,
              and build what comes next at Lovely Professional University.
            </p>

            <div className="reveal reveal-delay-3 mt-7 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
              <span className="h-px w-8 shrink-0 bg-linear-to-r from-[#FF00D4] to-[#6C00FF] sm:w-12" />
              <span className="text-sm leading-6 text-white/75">
                November 30 to December 4, 2026
              </span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-end">
            <div className="reveal border-t border-white/15 pt-6 sm:pt-8">
              <span className="text-sm font-medium text-[#FF2D87]">
                The community behind the festival
              </span>

              <h3 className="mt-5 text-3xl font-light leading-tight tracking-[-0.04em] sm:mt-6 sm:text-4xl sm:tracking-tight">
                AWS Student
                <br />
                Builder Group
                <span className="text-[#FF00D4]"> · LPU</span>
              </h3>

              <p className="mt-5 text-[15px] font-light leading-7 text-white/60 sm:mt-6 sm:text-base sm:leading-8">
                We are a student-led technology community at Lovely
                Professional University, bringing aspiring builders together
                through hands-on learning, technical sessions, collaborative
                projects, and community events.
              </p>

              <p className="mt-4 text-[15px] font-light leading-7 text-white/60 sm:mt-5 sm:text-base sm:leading-8">
                Our goal is simple: help students move beyond tutorials,
                experiment with emerging technologies, and turn what they
                learn into things they can actually build.
              </p>
            </div>

            <div className="mt-8 border-t border-white/15 pt-5 sm:mt-12 sm:pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-white/45">
                  Built by the community
                </span>

                <span className="bg-linear-to-r from-[#FF2D87] to-[#8B5CFF] bg-clip-text text-sm font-medium text-transparent">
                  Made for builders.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
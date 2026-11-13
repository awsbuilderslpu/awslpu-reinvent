const sponsors = [
  { name: "Title Partner", tier: "TITLE" },
  { name: "Technology Partner", tier: "TECHNOLOGY" },
  { name: "Community Partner", tier: "COMMUNITY" },
];

export function SponsorsPartners() {
  return (
    <section
      id="partners"
      className="relative isolate overflow-hidden bg-[#050505] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(108,0,255,0.10),transparent_55%)]"
      />

      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-light tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Sponsors <span className="text-[#FF00D4]">&</span>
              <br />
              Partners.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/55 sm:text-base">
            The organizations and communities helping bring builders together
            and make new possibilities happen.
          </p>
        </div>

        <div className="mt-12 grid border-t border-white/15 sm:mt-16 sm:grid-cols-3">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.tier}
              className={`group relative flex min-h-36 flex-col justify-between border-b border-white/15 px-5 py-6 transition-all duration-300 hover:bg-white/[0.03] hover:shadow-[inset_0_0_24px_rgba(255,0,212,0.06)] sm:min-h-44 sm:px-7 sm:py-8 ${
                index !== 0 ? "sm:border-l" : ""
              }`}
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 group-hover:text-[#FF2D87] transition-colors">
                {sponsor.tier}
              </span>

              <div className="flex items-center justify-between gap-4 mt-6">
                <span className="text-lg font-light text-white/75 transition-colors duration-300 group-hover:text-white sm:text-xl">
                  {sponsor.name}
                </span>

                <span className="text-[#FF2D87] transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

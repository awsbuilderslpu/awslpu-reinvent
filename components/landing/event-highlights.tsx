const highlights = [
  {
    number: "01",
    title: "HEAR",
    description: "Fresh perspectives. Industry insights. New ideas.",
    color: "#FF00D4",
  },
  {
    number: "02",
    title: "BUILD",
    description: "Hands-on experiences. Real technology. Practical learning.",
    color: "#8B5CFF",
  },
  {
    number: "03",
    title: "CONNECT",
    description: "Meet builders. Exchange ideas. Find your community.",
    color: "#FF2D87",
  },
];

export function EventHighlights() {
  return (
    <section
      id="highlights"
      className="relative overflow-hidden bg-[#050505] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-light tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Experience{" "}
              <span className="bg-linear-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">
                more.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-white/50 sm:text-right">
            Discover new ideas, experiment with technology, and meet the
            people building what comes next.
          </p>
        </div>

        <div className="grid border-y border-white/15 md:grid-cols-3">
          {highlights.map((item, index) => (
            <article
              key={item.number}
              className={`group relative isolate overflow-hidden px-5 py-7 sm:px-7 sm:py-9 lg:px-9 lg:py-10 ${
                index !== 0 ? "border-t border-white/15 md:border-l md:border-t-0" : ""
              }`}
            >
              <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(ellipse at 80% 20%, ${item.color}20, transparent 65%)`,
                }}
              />

              <div className="mb-7 flex items-center justify-between">
                <span
                  className="text-xs"
                  style={{ color: item.color }}
                >
                  / {item.number}
                </span>

                <span
                  className="h-2 w-2 rotate-45"
                  style={{ backgroundColor: item.color }}
                />
              </div>

              <h3
                className="text-5xl font-light tracking-[-0.07em] transition-transform duration-300 group-hover:translate-x-1 sm:text-6xl lg:text-7xl"
                style={{ color: item.color }}
              >
                {item.title}
              </h3>

              <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
                {item.description}
              </p>

              <div
                className="mt-7 h-px w-10 transition-all duration-500 group-hover:w-full"
                style={{
                  background: `linear-gradient(to right, ${item.color}, transparent)`,
                }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
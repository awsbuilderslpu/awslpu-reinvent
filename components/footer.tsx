import Link from "next/link";

const links = [
  { label: "Overview", href: "#overview" },
  { label: "About", href: "#about" },
  { label: "Highlights", href: "#highlights" },
  { label: "Partners", href: "#partners" },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[#050505] px-6 pt-16 pb-8 text-white sm:px-10 sm:pt-20 lg:px-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(108,0,255,0.10),transparent_55%)]"
      />

      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-12 pb-16 md:flex-row md:items-end">
          <div>
            <Link
              href="#overview"
              className="inline-block text-5xl font-light tracking-[-0.08em] sm:text-7xl"
            >
              re<span className="text-[#FF00D4]">:</span>Invent
              <span className="text-white/40">.</span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/50 sm:text-base">
              Five days of technology, ideas, and building what comes next.
              <br />
              November 30 to December 4, 2026.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-7 gap-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/55 transition-colors duration-200 hover:text-[#FF2D87]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Organized by{" "}
            <span className="text-white/70">
              AWS Student Builder Group · LPU
            </span>
          </p>

          <p>
            © 2026 AWS SBG LPU. All rights reserved.
          </p>
        </div>

        <p className="mt-5 max-w-3xl text-[11px] leading-5 text-white/30">
          AWS re:Invent Watch & Build Party hosted by the AWS Student Builder Group at Lovely Professional University is an official community event recognized and listed on the AWS Builder network.
  
        </p>
      </div>
    </footer>
  );
}

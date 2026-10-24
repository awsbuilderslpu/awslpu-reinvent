import Link from "next/link";

const navLinks = [
  { label: "EXPERIENCE", href: "#experience" },
  { label: "AGENDA", href: "#agenda" },
  { label: "SPEAKERS", href: "#speakers" },
  { label: "ABOUT", href: "#about" },
];

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-22 max-w-[1600px] items-center justify-between border-b border-white/8 px-6 sm:px-10 lg:px-16"
      >
        <Link
          href="/"
          aria-label="Re:Invent Fest 2026 home"
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex flex-col leading-none">
            <span className="mb-1 text-[9px] font-medium uppercase tracking-[0.28em] text-white/55">
              AWS Student Builder Group
            </span>

            <span className="text-[26px] font-light tracking-[-0.065em] text-white sm:text-[30px]">
              re<span className="text-[#e83cff]">:</span>Invent
            </span>
          </span>

          <span className="mt-4 hidden border-l border-white/20 pl-3 text-[9px] font-medium uppercase leading-relaxed tracking-[0.2em] text-white/55 sm:block">
            FEST
            <br />
            2026
          </span>
        </Link>

        <div className="hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] font-medium tracking-[0.17em] text-white/65 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="#register"
          className="group relative inline-flex h-10 items-center justify-center overflow-hidden border border-white/25 px-5 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition-all duration-300 hover:border-[#ec35ff] hover:shadow-[0_0_24px_rgba(221,45,255,0.22)] sm:px-6"
        >
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-[#702cff] to-[#ed28bc] transition-transform duration-300 group-hover:translate-x-0" />

          <span className="relative flex items-center gap-3">
            Register
            <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
              ↗
            </span>
          </span>
        </Link>
      </nav>
    </header>
  );
}
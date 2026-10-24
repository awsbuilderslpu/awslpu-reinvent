import Link from "next/link";

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Agenda", href: "#agenda" },
  { label: "Speakers", href: "#speakers" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-white">
            AWS
          </span>

          <span className="h-6 w-px bg-white/30" />

          <span className="text-sm font-medium tracking-wide text-white/90">
            re:Invent Fest
          </span>
        </Link>

        <div className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/75 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="#register"
            className="border border-[#ff9900] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#ff9900] hover:text-black"
          >
            Register now
          </Link>
        </div>
      </nav>
    </header>
  );
}
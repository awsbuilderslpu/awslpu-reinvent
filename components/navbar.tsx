"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "EXPERIENCE", href: "/experience" },
  { label: "AGENDA", href: "#agenda" },
  { label: "SPEAKERS", href: "#speakers" },
  { label: "ABOUT", href: "/about" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex h-18 max-w-[1600px] items-center justify-between border-b border-white/8 px-5 sm:h-22 sm:px-10 lg:px-16"
      >
        <Link
          href="/"
          aria-label="Re:Invent Fest 2026 home"
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex flex-col leading-none">
            <span className="mb-1 text-[8px] font-medium uppercase tracking-[0.2em] text-white/55 sm:text-[9px] sm:tracking-[0.28em]">
              AWS Student Builder Group
            </span>

            <span className="text-[24px] font-light tracking-[-0.065em] text-white sm:text-[30px]">
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

        <div className="flex items-center gap-3">
          <Link
            href="#register"
            onClick={() => setMenuOpen(false)}
            className="group relative inline-flex h-9 items-center justify-center overflow-hidden border border-white/25 px-3.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-[#ec35ff] hover:shadow-[0_0_24px_rgba(221,45,255,0.22)] sm:h-10 sm:px-6 sm:text-[10px] sm:tracking-[0.17em]"
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-[#702cff] to-[#ed28bc] transition-transform duration-300 group-hover:translate-x-0" />

            <span className="relative flex items-center gap-2 sm:gap-3">
              Register
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </span>
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-[70] flex size-9 items-center justify-center border border-white/20 text-white transition-colors hover:border-[#e83cff] xl:hidden"
          >
            <span className="flex w-4 flex-col gap-[5px]">
              <span
                className={`h-px w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`fixed right-0 top-0 z-[65] flex h-dvh w-[min(82vw,360px)] flex-col border-l border-white/10 bg-[#08060c]/75 shadow-[-20px_0_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-transform duration-300 ease-out xl:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            Navigation
          </span>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
            className="flex size-9 items-center justify-center border border-white/15 text-xl text-white/80 transition-colors hover:border-[#FF00D4] hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 flex-col px-6 pt-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between border-b border-white/10 py-5 text-sm font-medium tracking-[0.12em] text-white/70 transition-colors hover:text-white"
            >
              <span>{link.label}</span>
              <span className="text-xs text-[#FF2D87] transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          ))}

          <Link
            href="#register"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="mt-8 flex h-12 items-center justify-between border border-[#FF00D4]/50 bg-linear-to-r from-[#FF00D4]/15 to-[#6C00FF]/15 px-4 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition-colors hover:border-[#FF2D87]"
          >
            Register for the festival
            <span className="text-[#FF2D87]">↗</span>
          </Link>
        </div>

        <div className="border-t border-white/10 px-6 py-6">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
            AWS Student Builder Group · LPU
          </p>
          <p className="mt-2 text-xs text-white/55">
            November 30 to December 4, 2026
          </p>
        </div>
      </aside>
    </header>
  );
}
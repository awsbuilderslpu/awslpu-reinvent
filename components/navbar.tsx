"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "EXPERIENCE", href: "/experience" },
  { label: "SCHEDULE", href: "/schedule" },
  { label: "TICKETS", href: "/tickets" },
  { label: "ABOUT", href: "/about" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { loading, authenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
          : "bg-[#050505]/40 backdrop-blur-md border-b border-white/[0.05]"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex h-18 max-w-[1600px] items-center justify-between px-5 sm:h-22 sm:px-10 lg:px-16"
      >
        <Link
          href="/"
          aria-label="Re:Invent Fest 2026 home"
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-3 transition-transform duration-200 active:scale-95"
        >
          <span className="flex flex-col leading-none">
            <span className="mb-1 text-[8px] font-medium uppercase tracking-[0.2em] text-white/55 sm:text-[9px] sm:tracking-[0.28em]">
              AWS Student Builder Group
            </span>

            <span className="text-[24px] font-light tracking-[-0.065em] text-white sm:text-[30px]">
              re<span className="text-[#e83cff]">:</span>Invent
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 xl:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-[11px] font-medium tracking-[0.18em] transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1.5 inset-x-0 h-[2px] bg-linear-to-r from-[#FF00D4] to-[#8B5CFF] shadow-[0_0_10px_#FF00D4]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tickets"
            className="hidden h-9 items-center justify-center border border-[#FF00D4]/70 bg-linear-to-r from-[#FF00D4]/20 to-[#8B5CFF]/20 px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF2D87] hover:shadow-[0_0_24px_rgba(255,0,212,0.3)] active:translate-y-0 md:inline-flex lg:h-10 lg:px-5 lg:text-[10px]"
          >
            Get Tickets
          </Link>

          {!loading && (
            authenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center justify-center border border-white/25 px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ec35ff] hover:shadow-[0_0_24px_rgba(221,45,255,0.22)] sm:h-10 sm:px-6 sm:text-[10px] sm:tracking-[0.17em]"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55 transition-colors hover:text-white sm:block cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth?mode=login"
                onClick={() => setMenuOpen(false)}
                className="group relative inline-flex h-9 items-center justify-center overflow-hidden border border-white/25 px-3.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-[#ec35ff] hover:shadow-[0_0_24px_rgba(221,45,255,0.22)] sm:h-10 sm:px-6 sm:text-[10px] sm:tracking-[0.17em]"
              >
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-[#702cff] to-[#ed28bc] transition-transform duration-300 group-hover:translate-x-0" />

                <span className="relative flex items-center gap-2 sm:gap-3">
                  Login
                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </span>
              </Link>
            )
          )}

          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-[70] flex size-11 items-center justify-center border border-white/20 text-white transition-colors hover:border-[#e83cff] xl:hidden cursor-pointer"
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
        className={`fixed inset-0 z-[60] bg-black/65 backdrop-blur-[4px] transition-opacity duration-300 xl:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`fixed right-0 top-0 z-[65] flex h-dvh w-[min(88vw,360px)] flex-col border-l border-white/10 bg-[#08060c]/98 shadow-[-20px_0_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-transform duration-300 ease-out xl:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <div className="flex flex-col">
            <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/50">
              AWS SBG · LPU
            </span>
            <span className="text-sm font-light tracking-tight text-white">
              re<span className="text-[#FF00D4]">:</span>Invent
            </span>
          </div>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
            className="flex size-11 items-center justify-center border border-white/15 text-2xl text-white/80 transition-colors hover:border-[#FF00D4] hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 flex-col px-6 pt-4 pb-8 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className={`group flex items-center justify-between border-b border-white/10 py-4 text-sm font-medium tracking-[0.14em] transition-colors ${
                  isActive
                    ? "text-[#FF00D4] font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF00D4] shadow-[0_0_8px_#FF00D4]" />
                  )}
                  {link.label}
                </span>
                <span className="text-xs text-[#FF2D87] transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </Link>
            );
          })}

          <Link
            href="/tickets"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="mt-6 flex h-12 items-center justify-between border border-[#FF00D4]/70 bg-linear-to-r from-[#FF00D4]/20 to-[#8B5CFF]/20 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all hover:border-[#FF2D87] hover:shadow-[0_0_24px_rgba(255,0,212,0.3)]"
          >
            Get Tickets
            <span className="text-[#FF2D87]">↗</span>
          </Link>

          {!loading && (
            authenticated ? (
              <>
                <Link
                  href="/dashboard"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 flex h-12 items-center justify-between border border-white/20 bg-white/[0.04] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-[#FF2D87]"
                >
                  Dashboard
                  <span className="text-[#FF2D87]">↗</span>
                </Link>

                <button
                  type="button"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={handleLogout}
                  className="mt-4 flex h-11 items-center justify-between border border-white/15 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:border-white/40 hover:text-white cursor-pointer"
                >
                  Logout
                  <span>→</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth?mode=login"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className="mt-4 flex h-12 items-center justify-between border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white"
              >
                Login
                <span className="text-[#FF2D87]">↗</span>
              </Link>
            )
          )}
        </div>
      </aside>
    </header>
  );
}

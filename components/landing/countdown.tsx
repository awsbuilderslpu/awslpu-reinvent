"use client";

import { useSyncExternalStore } from "react";

/**
 * Event start: 30 November 2026, midnight IST (UTC+05:30).
 * Update this single constant to change the target date everywhere.
 */
const EVENT_DATE_ISO = "2026-11-30T00:00:00+05:30";
const EVENT_EPOCH_MS = new Date(EVENT_DATE_ISO).getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(): TimeLeft | null {
  const diff = EVENT_EPOCH_MS - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* ------------------------------------------------------------------ */
/*  Tick store – avoids synchronous setState inside useEffect          */
/* ------------------------------------------------------------------ */

let tickListeners: Array<() => void> = [];
let tickSnapshot: TimeLeft | null = computeTimeLeft();
let tickInterval: ReturnType<typeof setInterval> | undefined;

function startTick() {
  if (tickInterval) return;
  tickInterval = setInterval(() => {
    tickSnapshot = computeTimeLeft();
    tickListeners.forEach((l) => l());
  }, 1_000);
}

function subscribeTick(listener: () => void) {
  tickListeners.push(listener);
  startTick();
  return () => {
    tickListeners = tickListeners.filter((l) => l !== listener);
    if (tickListeners.length === 0 && tickInterval) {
      clearInterval(tickInterval);
      tickInterval = undefined;
    }
  };
}

function getTickSnapshot() {
  return tickSnapshot;
}

/** Server snapshot returns `null` so the initial render shows zeros,
 *  avoiding a hydration mismatch. */
function getServerSnapshot(): TimeLeft | null {
  return null;
}

/* ------------------------------------------------------------------ */
/*  Animated digit                                                     */
/* ------------------------------------------------------------------ */

/*
 * Uses a changing `key` to remount the <span> whenever the value
 * changes, which replays the CSS animation. Zero refs, zero state,
 * zero effects — lint-clean under React 19.
 */
function AnimatedDigit({ value }: { value: number }) {
  const formatted = String(value).padStart(2, "0");

  return (
    <span
      key={`${formatted}-${value}`}
      className="inline-block countdown-flip"
    >
      {formatted}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Single countdown unit card                                         */
/* ------------------------------------------------------------------ */

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="group relative flex flex-col items-center">
      {/* Card */}
      <div className="relative isolate flex h-24 w-full items-center justify-center overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:border-[#FF00D4]/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,0,212,0.08)] sm:h-28 md:h-32">
        {/* Subtle ambient glow — top edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF00D4]/25 to-transparent"
        />

        {/* Number */}
        <span className="text-[2.75rem] font-light leading-none tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
          <AnimatedDigit value={value} />
        </span>

        {/* Bottom corner accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-r border-[#FF00D4]/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>

      {/* Label */}
      <span className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40 sm:mt-4 sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Separator diamond between units (desktop only)                     */
/* ------------------------------------------------------------------ */

function Separator() {
  return (
    <div
      aria-hidden="true"
      className="hidden items-center self-start pt-12 md:flex md:pt-14"
    >
      <span className="h-1 w-1 rotate-45 bg-[#FF00D4]/50 shadow-[0_0_6px_rgba(255,0,212,0.5)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main countdown section                                             */
/* ------------------------------------------------------------------ */

export function Countdown() {
  /*
   * useSyncExternalStore subscribes to the tick store. The server
   * snapshot returns `null` so SSR renders zeroed-out placeholders,
   * avoiding hydration mismatches. On the client the snapshot is
   * replaced with live values on the first tick.
   */
  const timeLeft = useSyncExternalStore(
    subscribeTick,
    getTickSnapshot,
    getServerSnapshot,
  );

  /*
   * `timeLeft` is `null` in two cases:
   *   1. Server-side render (server snapshot is always null).
   *   2. Client-side when the event has already started.
   * We show the "event has begun" banner only on the client (case 2).
   * `typeof window !== "undefined"` is constant per environment so it
   * does not cause hydration issues — the server always takes the
   * false branch and renders the countdown grid with zeros.
   */
  const isClient = typeof window !== "undefined";
  const eventStarted = isClient && timeLeft === null;

  return (
    <section
      id="countdown"
      className="relative isolate overflow-hidden bg-[#050505] px-5 py-16 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-24"
    >
      {/* Ambient background radials */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,0,212,0.07),transparent_55%),radial-gradient(ellipse_at_80%_100%,rgba(108,0,255,0.06),transparent_50%)]"
      />

      <div className="mx-auto max-w-[1600px]">
        {/* ---- Header text ---- */}
        <div className="mb-10 text-center sm:mb-14">
          <p
            data-reveal
            suppressHydrationWarning
            className="reveal mb-5 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-[#FF00D4] sm:mb-6"
          >
            <span
              aria-hidden="true"
              className="hidden h-px w-8 bg-gradient-to-r from-transparent to-[#FF00D4]/60 sm:inline-block"
            />
            The countdown begins
            <span
              aria-hidden="true"
              className="hidden h-px w-8 bg-gradient-to-l from-transparent to-[#FF00D4]/60 sm:inline-block"
            />
          </p>

          <h2
            data-reveal
            suppressHydrationWarning
            className="reveal reveal-delay-1 text-4xl font-light tracking-[-0.06em] sm:text-5xl lg:text-6xl"
          >
            Something big is{" "}
            <span className="bg-gradient-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">
              coming.
            </span>
          </h2>

          <p
            data-reveal
            suppressHydrationWarning
            className="reveal reveal-delay-2 mx-auto mt-5 max-w-lg text-sm leading-7 text-white/50 sm:mt-6 sm:text-base"
          >
            Get ready for an unforgettable experience at AWS re:Invent LPU
            2026.
          </p>
        </div>

        {/* ---- Countdown grid / event-started state ---- */}
        {eventStarted ? (
          <div
            data-reveal
            suppressHydrationWarning
            className="reveal reveal-delay-3 flex flex-col items-center justify-center border border-[#FF00D4]/30 bg-[#FF00D4]/[0.04] py-14 text-center sm:py-18"
          >
            <span className="live-indicator text-xs font-medium uppercase tracking-[0.2em] text-[#FF00D4]">
              Live now
            </span>
            <h3 className="mt-4 text-3xl font-light tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              The event has begun
            </h3>
          </div>
        ) : (
          <div
            data-reveal
            suppressHydrationWarning
            className="reveal reveal-delay-3"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:flex md:items-start md:justify-center md:gap-0">
              <div className="min-w-0 flex-1 md:max-w-40 lg:max-w-48">
                <CountdownUnit
                  value={timeLeft?.days ?? 0}
                  label="Days"
                />
              </div>

              <Separator />

              <div className="min-w-0 flex-1 md:mx-4 md:max-w-40 lg:mx-5 lg:max-w-48">
                <CountdownUnit
                  value={timeLeft?.hours ?? 0}
                  label="Hours"
                />
              </div>

              <Separator />

              <div className="min-w-0 flex-1 md:mx-4 md:max-w-40 lg:mx-5 lg:max-w-48">
                <CountdownUnit
                  value={timeLeft?.minutes ?? 0}
                  label="Minutes"
                />
              </div>

              <Separator />

              <div className="min-w-0 flex-1 md:max-w-40 lg:max-w-48">
                <CountdownUnit
                  value={timeLeft?.seconds ?? 0}
                  label="Seconds"
                />
              </div>
            </div>

            {/* Thin decorative line under cards */}
            <div
              aria-hidden="true"
              className="mx-auto mt-8 h-px max-w-sm bg-gradient-to-r from-transparent via-[#FF00D4]/20 to-transparent sm:mt-10 sm:max-w-md"
            />
          </div>
        )}
      </div>
    </section>
  );
}

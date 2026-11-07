"use client"

import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"

const tiers = [
  {
    name: "Student Pass (Early Bird)",
    price: "₹499",
    tagline: "For ambitious students & builders",
    badge: "Popular",
    features: [
      "Full 5-Day Access (Nov 30 – Dec 4)",
      "Access to all Keynotes & Tech Tracks",
      "Official Festival Swag Pack",
      "Certificate of Participation",
      "Access to Builders Networking Hub"
    ],
    highlight: false
  },
  {
    name: "Builder Pass",
    price: "₹999",
    tagline: "Hands-on labs & hackathon entry",
    badge: "Most Recommended",
    features: [
      "Everything in Student Pass",
      "Hands-on Lab Cloud Environment",
      "48-Hour Builders Hackathon Entry",
      "Priority Workshop Seating",
      "Daily Lunch & Networking High Tea",
      "Exclusive Builder Kit & T-Shirt"
    ],
    highlight: true
  },
  {
    name: "All-Access VIP Pass",
    price: "₹2,499",
    tagline: "The executive & VIP experience",
    badge: "Limited (250 Seats)",
    features: [
      "Everything in Builder Pass",
      "Front-Row Keynote Reserved Seating",
      "Speaker & VIP Lounge Access",
      "Private Networking Dinner",
      "1-on-1 Career Mentorship Session",
      "AWS Certification Prep Bundle"
    ],
    highlight: false
  }
]

export function TicketTeaser() {
  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(108,0,255,0.1),transparent_60%)]" />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#FF00D4]" />
              <span className="text-xs uppercase tracking-[0.22em] text-[#FF00D4]">
                Passes & Registration
              </span>
            </div>

            <h2 className="text-4xl font-light tracking-[-0.06em] sm:text-6xl">
              Claim your{" "}
              <span className="bg-gradient-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">
                spot.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm text-white/50 sm:text-right">
            Seats are strictly capped to ensure premium hands-on lab experiences and venue comfort.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between border p-8 transition-all duration-300 ${
                tier.highlight
                  ? "border-[#FF00D4] bg-linear-to-b from-[#FF00D4]/10 via-white/[0.02] to-transparent shadow-[0_0_40px_rgba(255,0,212,0.15)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/30"
              }`}
            >
              {tier.badge && (
                <span
                  className={`absolute right-6 top-6 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold ${
                    tier.highlight
                      ? "bg-[#FF00D4] text-white"
                      : "border border-white/20 bg-white/5 text-white/70"
                  }`}
                >
                  {tier.badge}
                </span>
              )}

              <div>
                <h3 className="text-2xl font-light tracking-tight">{tier.name}</h3>
                <p className="mt-1 text-xs text-white/45">{tier.tagline}</p>

                <div className="my-8 flex items-baseline gap-2">
                  <span className="text-5xl font-extralight tracking-tight text-white">
                    {tier.price}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-white/40">
                    / 5 Days
                  </span>
                </div>

                <ul className="space-y-3.5 border-t border-white/10 pt-6">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-xs text-white/75">
                      <Check className="h-4 w-4 shrink-0 text-[#FF00D4]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/tickets"
                className={`mt-10 flex h-12 items-center justify-between px-6 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                  tier.highlight
                    ? "bg-linear-to-r from-[#FF00D4] to-[#702cff] text-white shadow-[0_0_24px_rgba(255,0,212,0.3)] hover:opacity-95"
                    : "border border-white/25 text-white hover:border-[#FF2D87] hover:bg-white/[0.04]"
                }`}
              >
                <span>Select Pass</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

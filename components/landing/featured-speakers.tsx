"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { LinkedinIcon } from "@/components/icons"
import type { Speaker } from "@/types/schedule"

export function FeaturedSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        const res = await fetch("/api/speakers")
        if (res.ok) {
          const data = await res.json()
          setSpeakers(Array.isArray(data) ? data : [])
        }
      } catch {
        setSpeakers([])
      } finally {
        setLoading(false)
      }
    }
    fetchSpeakers()
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(255,0,212,0.07),transparent_50%)]" />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#FF2D87]" />
              <span className="text-xs uppercase tracking-[0.22em] text-[#FF2D87]">
                Visionaries & Builders
              </span>
            </div>

            <h2 className="text-4xl font-light tracking-[-0.06em] sm:text-6xl">
              Learn from the{" "}
              <span className="bg-gradient-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">
                masters.
              </span>
            </h2>
          </div>

          <Link
            href="/schedule#speakers"
            className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 transition-colors hover:text-[#FF2D87]"
          >
            Meet All Speakers
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#FF2D87]" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse border border-white/5 bg-white/[0.02]"
              />
            ))}
          </div>
        ) : speakers.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center border border-white/10 bg-white/[0.01] py-16 text-center">
            <span className="text-xs uppercase tracking-widest text-[#FF00D4]">
              Speaker Lineup
            </span>
            <h3 className="mt-2 text-xl font-light text-white">
              Announcements Coming Soon
            </h3>
            <p className="mt-2 max-w-md text-xs text-white/50">
              Leading engineers, cloud architects, researchers, and community heroes will take the stage. Full speaker roster will be revealed shortly.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.slice(0, 4).map((spk) => (
              <article
                key={spk.id}
                className="group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-[#FF00D4]/70 hover:shadow-[0_0_30px_rgba(255,0,212,0.12)]"
              >
                <div>
                  <div className="relative aspect-square w-full overflow-hidden rounded-md border border-white/10 bg-white/[0.05]">
                    {spk.profile_picture ? (
                      <img
                        src={spk.profile_picture}
                        alt={spk.full_name}
                        className="h-full w-full object-cover grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/5 text-2xl font-light text-white/40">
                        {spk.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  <div className="mt-5">
                    {spk.company && (
                      <span className="text-[10px] uppercase tracking-wider text-[#FF00D4]">
                        {spk.company}
                      </span>
                    )}
                    <h3 className="mt-1 text-xl font-medium tracking-tight text-white group-hover:text-[#FF2D87] transition-colors">
                      {spk.full_name}
                    </h3>
                    <p className="mt-1 text-xs text-white/55">{spk.designation}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-[10px] text-white/40 tracking-wide line-clamp-1">
                    {spk.topics?.join(" · ") || "Keynote Session"}
                  </span>
                  {spk.socials?.linkedin ? (
                    <a
                      href={spk.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${spk.full_name} LinkedIn`}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

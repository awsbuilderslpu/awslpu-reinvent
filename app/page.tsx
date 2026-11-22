import { Hero } from "@/components/landing/hero";
import { EventMarquee } from "@/components/landing/event-marquee";
import { Countdown } from "@/components/landing/countdown";
import { About } from "@/components/landing/about";
import { ScheduleTeaser } from "@/components/landing/schedule-teaser";
import { FeaturedSpeakers } from "@/components/landing/featured-speakers";
import { EventHighlights } from "@/components/landing/event-highlights";
import { SponsorsPartners } from "@/components/landing/SponsorsPartners";
import { eventJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape "<" as the JSON unicode sequence (backslash + u003c) so the
          // payload can never close the <script> tag.
          __html: JSON.stringify(eventJsonLd).replace(/</g, String.fromCharCode(92) + "u003c"),
        }}
      />
      <Hero />
      <EventMarquee />
      <Countdown />
      <About />
      <ScheduleTeaser />
      <FeaturedSpeakers />
      <EventHighlights />
      <SponsorsPartners />
    </main>
  );
}

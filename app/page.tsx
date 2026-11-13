import { Hero } from "@/components/landing/hero";
import { EventMarquee } from "@/components/landing/event-marquee";
import { About } from "@/components/landing/about";
import { ScheduleTeaser } from "@/components/landing/schedule-teaser";
import { FeaturedSpeakers } from "@/components/landing/featured-speakers";
import { EventHighlights } from "@/components/landing/event-highlights";
import { SponsorsPartners } from "@/components/landing/SponsorsPartners";

export default function Home() {
  return (
    <main>
      <Hero />
      <EventMarquee />
      <About />
      <ScheduleTeaser />
      <FeaturedSpeakers />
      <EventHighlights />
      <SponsorsPartners />
    </main>
  );
}

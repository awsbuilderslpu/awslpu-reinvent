import { Hero } from "@/components/landing/hero";
import { EventMarquee } from "@/components/landing/event-marquee";
import { About } from "@/components/landing/about";
import { EventHighlights } from "@/components/landing/event-highlights";
import { SponsorsPartners } from "@/components/landing/SponsorsPartners";

export default function Home() {
  return (
    <main>
      <Hero />
      <EventMarquee />
      <About />
      <EventHighlights />
      <SponsorsPartners />
    </main>
  );
}
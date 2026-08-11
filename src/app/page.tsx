import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { TickerBar } from "@/components/ui/TickerBar";
import { GearShowcaseSection } from "@/components/sections/GearShowcaseSection";
import { BentoFeatures } from "@/components/sections/BentoFeatures";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-[#09090b] text-white">
      <Navbar />
      <HeroSection />
      <TickerBar />
      <GearShowcaseSection />
      <BentoFeatures />
      <Footer />
    </main>
  );
}

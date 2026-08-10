import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { GearShowcaseSection } from "@/components/sections/GearShowcaseSection";
import { BentoFeatures } from "@/components/sections/BentoFeatures";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0b] text-white">
      <Navbar />
      <HeroSection />
      <GearShowcaseSection />
      <BentoFeatures />
      <Footer />
    </main>
  );
}

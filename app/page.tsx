import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Projects } from "@/components/sections/Projects";
import { LeadershipSection } from "@/components/sections/LeadershipSection";
import { Certifications } from "@/components/sections/Certifications";
import { Languages } from "@/components/sections/Languages";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />

      <main className="relative">
        <Hero />

        <div className="space-y-0">
          <Skills />
          <Experience />
          <Education />
          <Projects />
          <LeadershipSection />
          <Certifications />
          <Languages />
          <Contact />
        </div>
      </main>

      <Footer />
    </div>
  );
}
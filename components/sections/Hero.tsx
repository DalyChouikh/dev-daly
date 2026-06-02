import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { LinkedIn } from "@/components/ui/icons/LinkedIn";
import { GitHub } from "@/components/ui/icons/GitHub";
import { getProfile } from "@/lib/data";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function Hero() {
  const profile = getProfile();

  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] items-center px-6 pt-24 md:px-8"
    >
      {/* Subtle background glow on right side */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-125 w-125 -translate-y-1/2 rounded-full bg-primary/4 blur-[120px]" />

      <div className="mx-auto flex w-full container-max flex-col items-center gap-12 md:flex-row md:gap-16">
        {/* Left Content */}
        <div className="flex flex-1 flex-col items-start">
          <AnimatedSection>
            <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-on-surface md:text-6xl lg:text-[72px]">
              I&apos;m a{" "}
              <span className="text-on-surface">Software</span>{" "}
              <span className="text-primary">&amp;</span>
              <br />
              <span className="text-primary">AI Engineer</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant">
              {profile.tagline}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-transform duration-200 hover:scale-[1.02]"
              >
                Contact Me
                <ArrowRight size={16} />
              </Link>

              <Link
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 font-semibold text-on-surface transition-all duration-200 hover:border-primary/40 hover:text-primary"
              >
                View Resume
                <Download size={16} />
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="mt-10 flex gap-8">
              {profile.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-bold text-on-surface md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-on-surface-variant">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Right Side - Avatar Slot + Socials */}
        <div className="relative flex flex-1 items-center justify-center">
          {/* Floating Social Icons */}
          <div className="absolute right-0 top-0 flex flex-col gap-3 md:right-4">
            <FloatingSocialLink
              href={profile.socialLinks.linkedin}
              icon={<LinkedIn className="h-4.5 w-4.5" />}
              label="LinkedIn"
            />
            <FloatingSocialLink
              href={profile.socialLinks.github}
              icon={<GitHub className="h-4.5 w-4.5" />}
              label="GitHub"
            />
          </div>

          {/* Avatar placeholder */}
          <AnimatedSection delay={0.2}>
            <div className="relative h-70 w-70 md:h-87.5 md:w-87.5">
              <div className="absolute inset-0 rounded-full bg-surface-container-high/50 backdrop-blur-[20px]" />
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                <span className="text-sm font-mono">Avatar placeholder</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Scroll Down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <span className="text-sm text-on-surface-variant">Scroll Down</span>
        <div className="mt-1 text-center text-on-surface-variant">v</div>
      </div>
    </section>
  );
}

function FloatingSocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/3 text-on-surface-variant backdrop-blur-2xl transition-all duration-300 hover:border-primary/40 hover:text-primary"
    >
      {icon}
    </Link>
  );
}
import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Projects } from "@/components/sections/Projects";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { PortfolioMotion } from "@/components/ui/PortfolioMotion";
import {
  getProfile,
  getProjects,
  getExperience,
  getSkills,
  getEducation,
  getLeadership,
  getCertifications,
  getLanguages,
  getSiteConfig,
} from "@/lib/data";
import {
  getPortfolioSectionOrder,
  partitionProjects,
  type PublicSectionId,
} from "@/lib/portfolio";
import "./portfolio.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Composes validated content on the server with small interactive islands. */
export default function HomePage() {
  const profile = getProfile();
  const site = getSiteConfig();
  const { featured, archive } = partitionProjects(
    getProjects(),
    site.featuredProjectIds,
  );
  const sections: Record<PublicSectionId, ReactNode> = {
    hero: <Hero profile={profile} />,
    work: <SelectedWork projects={featured} />,
    experience: <Experience entries={getExperience()} />,
    skills: <Skills categories={getSkills()} />,
    education: <Education entries={getEducation()} />,
    projects: (
      <Projects projects={archive} githubUrl={profile.socialLinks.github} />
    ),
    about: (
      <About
        profile={profile}
        leadership={getLeadership()}
        certifications={getCertifications()}
        languages={getLanguages()}
      />
    ),
    contact: <Contact profile={profile} resumeUrl={site.resumeUrl} />,
  };
  return (
    <div className="portfolio-shell olive" id="top">
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <Navbar
        items={site.navItems}
        resumeUrl={site.resumeUrl}
        name={profile.displayName ?? profile.name}
      />
      <main id="main-content">
        {getPortfolioSectionOrder(site.sectionOrder).map((id) => (
          <Fragment key={id}>{sections[id]}</Fragment>
        ))}
      </main>
      <Footer profile={profile} />
      <PortfolioMotion />
    </div>
  );
}

import type { NavItem } from "@/lib/types";
import { PUBLIC_SECTION_IDS } from "@/lib/portfolio";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { MobileNav } from "@/components/layout/MobileNav";
import { ExternalLink } from "@/components/ui/PortfolioPrimitives";

const mobileLabels = {
  hero: "Home",
  work: "Selected work",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
  projects: "Other projects",
  about: "About & community",
  contact: "Contact",
} as const;

/** Navigation receives content from the server instead of loading it in the browser. */
export function Navbar({
  items,
  resumeUrl,
  name,
}: {
  items: readonly NavItem[];
  resumeUrl: string;
  name: string;
}) {
  const mobileItems = PUBLIC_SECTION_IDS.filter((id) => id !== "hero").map(
    (id) => ({
      id,
      label: items.find((item) => item.id === id)?.label ?? mobileLabels[id],
    }),
  );
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label={name + ", back to top"}>
        <BrandLogo label={name} />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {items
          .filter((item) => PUBLIC_SECTION_IDS.some((id) => id === item.id))
          .map((item) => (
            <a key={item.id} href={"#" + item.id}>
              {item.label}
            </a>
          ))}
        <ExternalLink className="resume-link" href={resumeUrl}>
          Résumé
        </ExternalLink>
      </nav>
      <MobileNav items={mobileItems} resumeUrl={resumeUrl} />
    </header>
  );
}

import type { Certification, Language, Leadership, Profile } from "@/lib/types";
import { ExternalLink } from "@/components/ui/PortfolioPrimitives";
import { LeadershipSection } from "@/components/sections/LeadershipSection";
import { Certifications } from "@/components/sections/Certifications";
import { Languages } from "@/components/sections/Languages";

type AboutProps = {
  profile: Profile;
  leadership: readonly Leadership[];
  certifications: readonly Certification[];
  languages: readonly Language[];
};

/** Biography and community proof share the approved editorial composition. */
export function About({
  profile,
  leadership,
  certifications,
  languages,
}: AboutProps) {
  const paragraphs = profile.bio?.length ? profile.bio : [profile.summary];
  return (
    <section className="about section" id="about">
      <div className="about-intro" data-reveal="about">
        <h2>
          Engineer.
          <br />
          Community builder.
        </h2>
        <div>
          {paragraphs.map((paragraph, index) => (
            <p className={index === 0 ? "about-lead" : undefined} key={index}>
              {paragraph}
            </p>
          ))}
          <div className="project-links">
            <ExternalLink href={profile.socialLinks.linkedin}>
              LinkedIn
            </ExternalLink>
            <ExternalLink href={profile.socialLinks.github}>
              GitHub
            </ExternalLink>
          </div>
        </div>
      </div>
      <LeadershipSection entries={leadership} />
      <div className="extra-columns">
        <Certifications entries={certifications} />
        <Languages entries={languages} />
      </div>
    </section>
  );
}

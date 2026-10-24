import type { Profile } from "@/lib/types";
import { ExternalLink } from "@/components/ui/PortfolioPrimitives";
import { ContactForm } from "@/components/sections/ContactForm";

/** Server-rendered contact details surround a small submission island. */
export function Contact({
  profile,
  resumeUrl,
}: {
  profile: Profile;
  resumeUrl: string;
}) {
  return (
    <section className="contact section" id="contact">
      <div className="contact-copy" data-reveal="contact">
        <h2>
          Let’s build
          <br />
          something useful.
        </h2>
        <p>
          Have a role, a project, or an interesting engineering problem? Tell me
          about it.
        </p>
        <a className="email" href={"mailto:" + profile.email}>
          {profile.email}
        </a>
        <div className="contact-meta">
          <p>{profile.location}</p>
          <a href={"tel:" + profile.phone.replace(/[^\d+]/g, "")}>
            {profile.phone}
          </a>
        </div>
        <div className="project-links">
          <ExternalLink href={profile.socialLinks.linkedin}>
            LinkedIn
          </ExternalLink>
          <ExternalLink href={profile.socialLinks.github}>GitHub</ExternalLink>
          <ExternalLink href={resumeUrl}>Résumé</ExternalLink>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}

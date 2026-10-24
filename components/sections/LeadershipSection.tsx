import type { Leadership } from "@/lib/types";
import { BulletList, ExternalLink } from "@/components/ui/PortfolioPrimitives";

/** Community work stays connected to the engineering projects it produced. */
export function LeadershipSection({
  entries,
}: {
  entries: readonly Leadership[];
}) {
  return (
    <div id="leadership">
      {entries.map((entry) => (
        <article className="community" key={entry.id} data-reveal="community">
          <div>
            <p className="date">Community · {entry.dateRange}</p>
            <h3>
              {entry.organization.replace(
                "Google Developer Groups on Campus - ",
                "GDG on Campus ",
              )}
            </h3>
          </div>
          <div>
            <h4>{entry.role}</h4>
            <BulletList items={entry.bullets} />
            <ExternalLink href={entry.organizationUrl}>
              Visit the community
            </ExternalLink>
          </div>
        </article>
      ))}
    </div>
  );
}

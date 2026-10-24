import type { Certification } from "@/lib/types";
import { ExternalLink } from "@/components/ui/PortfolioPrimitives";

/** Links directly to the existing certificate evidence. */
export function Certifications({
  entries,
}: {
  entries: readonly Certification[];
}) {
  return (
    <section className="certificates" id="certifications">
      <h3>Certifications</h3>
      {entries.map((entry) => (
        <p key={entry.url}>
          <ExternalLink href={entry.url}>{entry.name}</ExternalLink>
        </p>
      ))}
    </section>
  );
}

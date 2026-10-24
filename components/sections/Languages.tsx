import type { Language } from "@/lib/types";

/** Spoken languages retain the owner's published proficiency descriptions. */
export function Languages({ entries }: { entries: readonly Language[] }) {
  return (
    <section className="languages" id="languages">
      <h3>Languages</h3>
      <dl>
        {entries.map((entry) => (
          <div key={entry.name}>
            <dt>{entry.name}</dt>
            <dd>{entry.proficiency}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

import type { Profile } from "@/lib/types";

/** The approved name-led opening, with editable introduction copy. */
export function Hero({ profile }: { profile: Profile }) {
  const [first, ...rest] = (profile.displayName ?? profile.name).split(" ");
  return (
    <section className="hero olive-hero" id="hero">
      <h1>
        <span>{first}</span>
        <span>{rest.join(" ")}</span>
      </h1>
      <div className="hero-bottom">
        <p>{profile.introduction ?? profile.tagline}</p>
        <a className="button" href="#work">
          Explore my work <span aria-hidden="true">↘</span>
        </a>
      </div>
    </section>
  );
}

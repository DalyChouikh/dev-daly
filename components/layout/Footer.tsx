import type { Profile } from "@/lib/types";
import { BrandLogo } from "@/components/brand/BrandLogo";

/** A compact close repeats the selected identity and a route to the top. */
export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="footer">
      <a className="brand" href="#top" aria-label="Back to top">
        <BrandLogo label={profile.displayName ?? profile.name} />
      </a>
      <p>
        {profile.name} · {profile.title}
      </p>
      <a href="#top">
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </footer>
  );
}

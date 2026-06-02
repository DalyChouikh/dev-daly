import Link from "next/link";
import { Globe } from "lucide-react";
import { LinkedIn } from "@/components/ui/icons/LinkedIn";
import { GitHub } from "@/components/ui/icons/GitHub";
import { getProfile } from "@/lib/data";

export function Footer() {
  const profile = getProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-surface-container-low/50 py-8">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-8">
        <p className="text-sm text-on-surface-variant">
          {year} {profile.name}. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <SocialLink
            href={profile.socialLinks.linkedin}
            icon={<LinkedIn className="h-[18px] w-[18px]" />}
            label="LinkedIn"
          />
          <SocialLink
            href={profile.socialLinks.github}
            icon={<GitHub className="h-[18px] w-[18px]" />}
            label="GitHub"
          />
          <SocialLink
            href={profile.socialLinks.portfolio}
            icon={<Globe size={18} />}
            label="Portfolio"
          />
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
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
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/3 text-on-surface-variant transition-all duration-300 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
    >
      {icon}
    </Link>
  );
}
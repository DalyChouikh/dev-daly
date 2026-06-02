"use client";

import Link from "next/link";
import {
  User,
  Code,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Users,
  Award,
  Globe,
  Settings,
  Plus,
} from "lucide-react";
import { GitHub } from "@/components/ui/icons/GitHub";

const sections = [
  { id: "profile", label: "Profile", icon: <User size={20} />, count: null },
  { id: "experience", label: "Experience", icon: <Briefcase size={20} />, count: 3 },
  { id: "education", label: "Education", icon: <GraduationCap size={20} />, count: 2 },
  { id: "projects", label: "Projects", icon: <FolderOpen size={20} />, count: 4 },
  { id: "skills", label: "Skills", icon: <Code size={20} />, count: 7 },
  { id: "leadership", label: "Leadership", icon: <Users size={20} />, count: 1 },
  { id: "certifications", label: "Certifications", icon: <Award size={20} />, count: 2 },
  { id: "languages", label: "Languages", icon: <Globe size={20} />, count: 3 },
  { id: "site", label: "Site Config", icon: <Settings size={20} />, count: null },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-on-surface">
        Dashboard
      </h1>
      <p className="mt-2 text-on-surface-variant">
        Manage your portfolio content.
      </p>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          href="/admin/projects"
          icon={<Plus size={20} />}
          label="Add Project"
          description="Manually add a new project"
        />
        <QuickActionCard
          href="/admin/projects/draft"
          icon={<GitHub className="h-[20px] w-[20px]" />}
          label="GitHub Draft"
          description="Auto-generate from GitHub repo"
          primary
        />
      </div>

      {/* Section Grid */}
      <div className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold text-on-surface">
          Content Sections
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  label,
  description,
  primary = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-4 rounded-default border p-5 transition-all duration-300",
        primary
          ? "border-primary/30 bg-primary/5 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          primary ? "bg-primary/20 text-primary" : "bg-white/10 text-on-surface-variant",
        ].join(" ")}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-on-surface">{label}</h3>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
    </Link>
  );
}

function SectionCard({
  section,
}: {
  section: { id: string; label: string; icon: React.ReactNode; count: number | null };
}) {
  return (
    <Link
      href={`/admin/${section.id}`}
      className="flex items-center justify-between rounded-default border border-white/10 bg-white/[0.03] p-5 backdrop-blur-[20px] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-on-surface-variant">
          {section.icon}
        </div>
        <div>
          <h3 className="font-semibold text-on-surface">{section.label}</h3>
          {section.count !== null && (
            <p className="text-xs text-on-surface-variant">
              {section.count} {section.count === 1 ? "entry" : "entries"}
            </p>
          )}
        </div>
      </div>
      <div className="text-sm text-primary">Edit →</div>
    </Link>
  );
}
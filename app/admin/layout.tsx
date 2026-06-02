"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Code,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Users,
  Award,
  Globe,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";


const navSections = [
  { id: "profile", label: "Profile", icon: <User size={18} /> },
  { id: "experience", label: "Experience", icon: <Briefcase size={18} /> },
  { id: "education", label: "Education", icon: <GraduationCap size={18} /> },
  { id: "projects", label: "Projects", icon: <FolderOpen size={18} /> },
  { id: "skills", label: "Skills", icon: <Code size={18} /> },
  { id: "leadership", label: "Leadership", icon: <Users size={18} /> },
  { id: "certifications", label: "Certifications", icon: <Award size={18} /> },
  { id: "languages", label: "Languages", icon: <Globe size={18} /> },
  { id: "site", label: "Site Config", icon: <Settings size={18} /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  const isActive = (id: string) => pathname === `/admin/${id}`;

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface md:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={[
          "fixed left-0 top-0 z-40 h-full w-64 border-r border-white/10 bg-surface-container-low/80 backdrop-blur-[20px] transition-transform duration-300 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col p-6">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/admin" className="text-xl font-bold text-primary">
              Daly Admin
            </Link>
            <p className="mt-1 text-xs text-on-surface-variant">
              Content Management
            </p>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            <NavItem
              href="/admin"
              icon={<Home size={18} />}
              label="Dashboard"
              active={pathname === "/admin"}
            />

            <div className="my-4 border-t border-white/10" />

            {navSections.map((section) => (
              <NavItem
                key={section.id}
                href={`/admin/${section.id}`}
                icon={section.icon}
                label={section.label}
                active={isActive(section.id)}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="space-y-2 pt-4">
            <div className="border-t border-white/10" />
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-white/5 hover:text-on-surface"
            >
              <Globe size={16} />
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-white/5 hover:text-error"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        <div className="p-6 md:p-8">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
      ].join(" ")}
    >
      {icon}
      {label}
    </Link>
  );
}
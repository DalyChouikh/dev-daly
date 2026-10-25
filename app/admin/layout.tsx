"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Home, LogOut, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ADMIN_SECTIONS } from "@/lib/admin-navigation";
import "./admin.css";

function AdminWorkspace({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const pendingLogout = useRef(false);

  useEffect(() => {
    if (!open) return;
    sidebar.current?.querySelector<HTMLElement>("a")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1100px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const controls = sidebar.current?.querySelectorAll<HTMLElement>(
          "a, button:not([disabled])",
        );
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  async function logout() {
    if (pendingLogout.current) return;
    pendingLogout.current = true;
    setLoggingOut(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth", { method: "DELETE" });
      if (!response.ok) throw new Error("Logout failed");
      window.location.assign(
        new URL("/admin/login", window.location.origin).href,
      );
    } catch {
      setError("Couldn’t log out. Please try again.");
      pendingLogout.current = false;
      setLoggingOut(false);
    }
  }

  return (
    <div className="admin-shell">
      <a className="admin-skip-link" href="#admin-content">
        Skip to content
      </a>
      <header className="admin-mobile-bar">
        <Link href="/admin" aria-label="Daly administration">
          <BrandLogo />
        </Link>
        <button
          ref={menuButton}
          className="admin-icon-button"
          type="button"
          aria-label={open ? "Close admin navigation" : "Open admin navigation"}
          aria-controls="admin-sidebar"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      <aside
        className="admin-sidebar"
        id="admin-sidebar"
        data-open={open}
        ref={sidebar}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label="Administration menu"
      >
        <div className="admin-sidebar-brand">
          <Link href="/admin" aria-label="Daly administration">
            <BrandLogo />
          </Link>
          <p>Portfolio workspace</p>
        </div>
        <nav aria-label="Admin navigation">
          <Link
            href="/admin"
            aria-current={pathname === "/admin" ? "page" : undefined}
          >
            <Home size={17} aria-hidden="true" />
            Dashboard
          </Link>
          <p className="admin-nav-label">Content</p>
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.id}
              href={"/admin/" + section.id}
              aria-current={
                pathname === "/admin/" + section.id ||
                (section.id === "projects" &&
                  pathname.startsWith("/admin/projects/"))
                  ? "page"
                  : undefined
              }
            >
              {section.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link href="/">
            View portfolio
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button onClick={logout} disabled={loggingOut} type="button">
            <LogOut size={16} aria-hidden="true" />
            {loggingOut ? "Logging out…" : "Logout"}
          </button>
          {error ? (
            <p role="alert" className="admin-feedback admin-feedback--error">
              {error}
            </p>
          ) : null}
        </div>
      </aside>
      {open ? (
        <button
          className="admin-scrim"
          onClick={() => setOpen(false)}
          type="button"
          aria-label="Close admin navigation"
          tabIndex={-1}
        />
      ) : null}
      <main className="admin-canvas" id="admin-content" inert={open}>
        {children}
      </main>
    </div>
  );
}

/** Keeps the login composition independent from authenticated workspace controls. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login")
    return <div className="admin-shell admin-shell--login">{children}</div>;
  return <AdminWorkspace key={pathname}>{children}</AdminWorkspace>;
}

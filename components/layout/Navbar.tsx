"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getNavItems } from "@/lib/constants";
import type { NavItem } from "@/lib/types";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = getNavItems();

  return (
    <nav className="fixed left-0 right-0 top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-[1280px] md:left-1/2 md:right-auto md:-translate-x-1/2">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-surface-container/80 px-4 py-2.5 backdrop-blur-[40px] md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-primary text-xl font-bold tracking-tight">
            Daly
          </span>
          <span className="text-primary text-xl font-bold">.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item: NavItem) => (
            <NavLink key={item.id} item={item} />
          ))}
        </div>

        {/* View Resume Button */}
        <Link
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition-transform duration-200 hover:scale-[1.02] md:inline-flex"
        >
          View Resume
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-full p-2 text-on-surface md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-2 rounded-2xl border border-white/10 bg-surface-container/95 p-4 backdrop-blur-[40px] md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item: NavItem) => (
              <NavLink key={item.id} item={item} mobile onClick={() => setIsOpen(false)} />
            ))}
            <Link
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-on-primary"
            >
              View Resume
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  item,
  mobile = false,
  onClick,
}: {
  item: NavItem;
  mobile?: boolean;
  onClick?: () => void;
}) {
  const href = item.id === "hero" ? "/" : `#${item.id}`;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "text-sm font-medium transition-colors duration-200",
        item.id === "hero"
          ? "text-primary"
          : "text-on-surface-variant hover:text-on-surface",
        mobile
          ? "rounded-lg px-3 py-2 hover:bg-white/5"
          : "rounded-full px-3 py-1.5",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {item.label}
    </Link>
  );
}
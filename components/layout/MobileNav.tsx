"use client";

import { useRef, type KeyboardEvent } from "react";
import type { NavItem } from "@/lib/types";

/** Native disclosure navigation remains usable before hydration. */
export function MobileNav({
  items,
  resumeUrl,
}: {
  items: readonly NavItem[];
  resumeUrl: string;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);

  function closeMenu() {
    if (menu.current) menu.current.open = false;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key === "Escape" && menu.current?.open) {
      closeMenu();
      summary.current?.focus();
    }
  }

  return (
    <details className="mobile-menu" ref={menu} onKeyDown={handleKeyDown}>
      <summary ref={summary}>
        Menu <span aria-hidden="true">+</span>
      </summary>
      <nav aria-label="Mobile navigation">
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
          Résumé <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </details>
  );
}

import type { ReactNode } from "react";
import { normalizeContentText } from "@/lib/portfolio";

/** Shared external-link behavior for portfolio proof and contact destinations. */
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

/** Keeps section titles and supporting copy on the approved editorial grid. */
export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading" data-reveal="heading">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

/** Renders published prose without PDF line-break artifacts. */
export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{normalizeContentText(item)}</li>
      ))}
    </ul>
  );
}

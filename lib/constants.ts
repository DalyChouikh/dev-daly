import type { SectionName, NavItem } from "./types";
import { getSiteConfig } from "./data";

/** Stardust design tokens derived from DESIGN.md */
export const COLORS = {
  surface: "#101415",
  surfaceDim: "#101415",
  surfaceBright: "#363a3b",
  surfaceContainerLowest: "#0b0f10",
  surfaceContainerLow: "#191c1e",
  surfaceContainer: "#1d2022",
  surfaceContainerHigh: "#272a2c",
  surfaceContainerHighest: "#323537",
  onSurface: "#e0e3e5",
  onSurfaceVariant: "#bccbb9",
  inverseSurface: "#e0e3e5",
  inverseOnSurface: "#2d3133",
  outline: "#869585",
  outlineVariant: "#3d4a3d",
  primary: "#4be277",
  primaryContainer: "#22c55e",
  onPrimary: "#003915",
  secondary: "#bec6e0",
  onSecondary: "#283044",
  tertiary: "#bac8e1",
  error: "#ffb4ab",
} as const;

/** Spacing constants from DESIGN.md */
export const SPACING = {
  unit: 4,
  containerMax: 1280,
  gutter: 24,
  sectionPaddingLg: 120,
  sectionPaddingSm: 64,
} as const;

/** Border radii from DESIGN.md */
export const RADIUS = {
  sm: "0.25rem",
  default: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
} as const;

/** Glassmorphism presets from DESIGN.md */
export const GLASS = {
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropBlur: "20px",
  },
  cardHover: {
    border: "1px solid rgba(34, 197, 94, 0.4)",
    glow: "0px 0px 30px rgba(34, 197, 94, 0.15)",
  },
  floating: {
    backdropBlur: "40px",
  },
} as const;

/** Font family names (loaded in layout.tsx via next/font) */
export const FONTS = {
  display: "var(--font-display)",
  body: "var(--font-body)",
  mono: "var(--font-mono)",
} as const;

/** Navigation items derived from site config */
export function getNavItems(): NavItem[] {
  const config = getSiteConfig();
  return config.navItems;
}

/** All available section names in display order */
export const SECTION_NAMES: SectionName[] = [
  "hero",
  "about",
  "skills",
  "experience",
  "education",
  "projects",
  "leadership",
  "certifications",
  "languages",
  "contact",
];

/** Section labels for display */
export const SECTION_LABELS: Record<SectionName, string> = {
  hero: "Home",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  leadership: "Leadership",
  certifications: "Certifications",
  languages: "Languages",
  contact: "Contact",
};
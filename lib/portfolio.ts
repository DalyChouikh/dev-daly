import { compareDesc, isValid, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Experience, Project } from "@/lib/types";

export const PUBLIC_SECTION_IDS = ["hero", "work", "experience", "skills", "education", "projects", "about", "contact"] as const;
export type PublicSectionId = typeof PUBLIC_SECTION_IDS[number];

/** Separates selected work from the remaining engineering archive. */
export function partitionProjects(projects: readonly Project[], featuredIds: readonly string[]): { featured: Project[]; archive: Project[] } {
  const selectedIndexes = new Set<number>();
  const featured: Project[] = [];

  if (featuredIds.length > 0) {
    for (const id of new Set(featuredIds)) {
      const index = projects.findIndex((entry) => entry.id === id);
      if (index >= 0) {
        selectedIndexes.add(index);
        featured.push(projects[index]);
      }
    }
  } else {
    projects.forEach((entry, index) => {
      if (entry.featured) {
        selectedIndexes.add(index);
        featured.push(entry);
      }
    });
  }

  const archive = projects
    .map((entry, index) => ({ entry, index, year: /^\d{4}$/u.test(entry.year) ? Number(entry.year) : Number.NEGATIVE_INFINITY }))
    .filter(({ index }) => !selectedIndexes.has(index))
    .sort((a, b) => a.year === b.year ? a.index - b.index : b.year - a.year)
    .map(({ entry }) => entry);

  return { featured, archive };
}

/** Orders professional roles without mutating published content. */
export function sortExperience(entries: readonly Experience[]): Experience[] {
  return entries
    .map((entry, index) => {
      const dateRange = normalizeContentText(entry.dateRange);
      const startText = dateRange.split(/\s*[-–—]\s*/u)[0].replace(/^Sept\b/iu, "Sep");
      const start = parse(startText, "MMMM yyyy", new Date(0), { locale: enUS });

      return { entry, index, start: isValid(start) ? start : null, ongoing: /\bPresent$/iu.test(dateRange) };
    })
    .sort((a, b) => {
      if (!a.start) return b.start ? 1 : a.index - b.index;
      if (!b.start) return -1;
      if (a.ongoing !== b.ongoing) return a.ongoing ? -1 : 1;
      return compareDesc(a.start, b.start) || a.index - b.index;
    })
    .map(({ entry }) => entry);
}

/** Normalizes extracted PDF text for public prose. */
export function normalizeContentText(value: string): string {
  return value.replace(/(\p{L})-[\t ]*\r?\n[\t ]*(?=\p{L})/gu, "$1").replace(/\s+/gu, " ").trim();
}

/** Resolves legacy publishing configuration into supported public sections. */
export function getPortfolioSectionOrder(configured: readonly string[]): PublicSectionId[] {
  const supported = new Set<string>(PUBLIC_SECTION_IDS);
  const requested = configured.filter((id): id is PublicSectionId => supported.has(id));
  return [...new Set([...requested, ...PUBLIC_SECTION_IDS])];
}

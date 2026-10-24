import { describe, expect, test } from "bun:test";
import projects from "@/data/projects.json";
import profile from "@/data/profile.json";
import site from "@/data/site.json";
import {
  getPortfolioSectionOrder,
  normalizeContentText,
  partitionProjects,
  PUBLIC_SECTION_IDS,
  sortExperience,
} from "@/lib/portfolio";
import { AdminSaveRequestSchema, DraftProjectSchema, ProfileSchema, ProjectSchema, SiteConfigSchema } from "@/lib/types";
import type { Experience, Project } from "@/lib/types";

const legacyProject = DraftProjectSchema.parse(projects[0]);
const image = {
  type: "image",
  src: "/images/projects/within-board.png",
  alt: "Within task board with its AI copilot panel open",
  width: 1440,
  height: 560,
} as const;
const video = {
  type: "video",
  src: "/media/projects/tapnshow-launch.mp4",
  poster: "/images/projects/tapnshow-poster.jpg",
  alt: "TapNShow meeting invitation and attendance walkthrough",
  width: 1920,
  height: 1080,
} as const;

function project(id: string, year: string, featured = false): Project {
  return { ...legacyProject, id, year, featured };
}

function role(id: string, dateRange: string): Experience {
  return { id, dateRange, company: id, companyUrl: "", title: "Engineer", location: "Sousse", bullets: [] };
}

describe("featured work and project archive", () => {
  test("uses configured order, ignores repeated or missing IDs, and preserves every other project", () => {
    const entries = Object.freeze([
      project("older", "2024"),
      project("flagged", "2025", true),
      project("within", "2025"),
      project("newer", "2026"),
      project("tapnshow", "2026"),
      project("same-year", "2025"),
    ]);
    const result = partitionProjects(entries, ["tapnshow", "missing", "within", "tapnshow"]);

    expect(result.featured.map(({ id }) => id)).toEqual(["tapnshow", "within"]);
    expect(result.archive.map(({ id }) => id)).toEqual(["newer", "flagged", "same-year", "older"]);
    expect(entries.map(({ id }) => id)).toEqual(["older", "flagged", "within", "newer", "tapnshow", "same-year"]);
  });

  test("uses optional featured flags only when configuration is empty", () => {
    const entries = [project("archive", "2026"), project("second", "2025", true), project("first", "2026", true)];
    expect(partitionProjects(entries, []).featured.map(({ id }) => id)).toEqual(["second", "first"]);
    expect(partitionProjects(entries, ["missing"]).featured).toEqual([]);
    expect(partitionProjects(entries, ["missing"]).archive).toHaveLength(entries.length);
  });

  test("keeps unselected duplicate entries and stable undated archive entries", () => {
    const duplicate = project("selected", "2024");
    const entries = [project("undated-a", ""), project("selected", "2026"), duplicate, project("undated-b", "TBD")];
    const result = partitionProjects(entries, ["selected"]);
    expect(result.featured).toEqual([entries[1]]);
    expect(result.archive).toEqual([duplicate, entries[0], entries[3]]);
  });
});

describe("career ordering", () => {
  test("places ongoing roles first, then completed and future roles by newest start month", () => {
    const entries = Object.freeze([
      role("old", "Feb 2024 — June 2024"),
      role("newer-ongoing", "Sept 2024 — Present"),
      role("last-summer", "July 2025 — Aug 2025"),
      role("latest", "July 2026 — Aug 2026"),
      role("future", "January 2030 — March 2030"),
      role("older-ongoing", "November 2022 — present"),
    ]);
    expect(sortExperience(entries).map(({ id }) => id)).toEqual([
      "newer-ongoing", "older-ongoing", "future", "latest", "last-summer", "old",
    ]);
    expect(entries[0].id).toBe("old");
  });

  test("parses abbreviated, full, and Sept month names with stable equal-date roles", () => {
    const entries = [
      role("july", "July 2025 – Aug 2025"),
      role("sept", "Sept 2025 - Dec 2025"),
      role("september", "September 2025 — December 2025"),
      role("october", "Oct 2025 — Nov 2025"),
    ];
    expect(sortExperience(entries).map(({ id }) => id)).toEqual(["october", "sept", "september", "july"]);
  });

  test("keeps invalid dates stable at the end instead of treating them as current", () => {
    const entries = [role("invalid-ongoing", "TBD — Present"), role("invalid", "Not a date"), role("valid", "May 2024 — June 2024"), role("invalid-month", "Smarch 2099 — Present")];
    expect(sortExperience(entries).map(({ id }) => id)).toEqual(["valid", "invalid-ongoing", "invalid", "invalid-month"]);
  });
});

describe("public section order", () => {
  test("supports the approved order when no configuration is present", () => {
    expect(getPortfolioSectionOrder([])).toEqual(["hero", "work", "experience", "skills", "education", "projects", "about", "contact"]);
    expect(getPortfolioSectionOrder([])).toEqual([...PUBLIC_SECTION_IDS]);
  });

  test("keeps supported configured sections once and appends missing required sections", () => {
    const configured = Object.freeze(["projects", "leadership", "work", "projects", "languages", "certifications", "made-up"]);
    expect(getPortfolioSectionOrder(configured)).toEqual(["projects", "work", "hero", "experience", "skills", "education", "about", "contact"]);
    expect(configured).toHaveLength(7);
  });
});

describe("content text normalization", () => {
  test("repairs words split across PDF lines and collapses prose whitespace", () => {
    expect(normalizeContentText("  Google OAuth, cus-\ntomizable QR codes,\r\nand link\t analytics.  ")).toBe("Google OAuth, customizable QR codes, and link analytics.");
    expect(normalizeContentText("initiated\nTapNShow for meeting coordination")).toBe("initiated TapNShow for meeting coordination");
  });

  test("preserves intentional in-line hyphens and punctuation", () => {
    expect(normalizeContentText("Built multi-tenant, real-time tools — with 15+ projects.")).toBe("Built multi-tenant, real-time tools — with 15+ projects.");
    expect(normalizeContentText("\n \t")).toBe("");
  });
});

describe("project presentation contracts", () => {
  test("preserves optional presentation data through the admin publishing schema", () => {
    const project = { ...legacyProject, displayTitle: "Within", category: "AI & productivity", engineeringIntro: "A task board with an AI copilot.", featured: true, media: video, gallery: [image] };
    const result = AdminSaveRequestSchema.parse({ section: "projects", data: [project] });

    expect(result.data).toEqual([project]);
  });

  test("accepts legacy projects and generated drafts without presentation metadata", () => {
    expect(ProjectSchema.parse(legacyProject)).toEqual(legacyProject);
    expect(DraftProjectSchema.parse(legacyProject)).toEqual(legacyProject);
  });

  test("keeps image media without requiring a video poster", () => {
    const project = { ...legacyProject, media: image };
    expect(ProjectSchema.parse(project)).toEqual(project);
  });

  test("requires a poster before publishing a video", () => {
    const { poster, ...withoutPoster } = video;
    expect(poster).toBeTruthy();
    expect(ProjectSchema.safeParse({ ...legacyProject, media: withoutPoster }).success).toBe(false);
  });

  test.each([0, -1, 2.5])("rejects invalid intrinsic media dimensions: %s", (dimension) => {
    expect(ProjectSchema.safeParse({ ...legacyProject, media: { ...image, width: dimension } }).success).toBe(false);
    expect(ProjectSchema.safeParse({ ...legacyProject, media: { ...video, height: dimension } }).success).toBe(false);
  });

  test("limits project galleries to validated images", () => {
    expect(ProjectSchema.safeParse({ ...legacyProject, gallery: [video] }).success).toBe(false);
  });

  test.each([
    "https://cdn.example.com/project.png",
    "javascript:alert(1)",
    "//cdn.example.com/project.png",
    "images/project.png",
    "/images/../private.png",
    "/images/./project.png",
    "/images/%2e%2e/private.png",
    "/images/%2E%2E%2Fprivate.png",
    "/images/%252e%252e/private.png",
    "/images\\project.png",
    "/images/%5cproject.png",
    "/images/project.png?download=1",
    "/images/project.png#preview",
    "/images/project.png%3fdownload=1",
  ])("rejects unsafe public media paths: %s", (src) => {
    expect(ProjectSchema.safeParse({ ...legacyProject, media: { ...image, src } }).success).toBe(false);
    expect(ProjectSchema.safeParse({ ...legacyProject, media: { ...video, poster: src } }).success).toBe(false);
    expect(ProjectSchema.safeParse({ ...legacyProject, gallery: [{ ...image, src }] }).success).toBe(false);
  });

  test("defaults legacy site configuration to featured flags", () => {
    const { sectionOrder, theme, resumeUrl, navItems } = site;
    const result = SiteConfigSchema.parse({ sectionOrder, theme, resumeUrl, navItems });
    expect(result).toEqual({ sectionOrder, theme, resumeUrl, navItems, featuredProjectIds: [] });
  });
});

describe("editable profile presentation", () => {
  test("keeps approved display copy when publishing profile data", () => {
    const content = { ...profile, displayName: "Daly Chouikh", introduction: "Software & AI engineer in Tunisia.", bio: ["A software and AI engineer based in Monastir, Tunisia."] };
    expect(AdminSaveRequestSchema.parse({ section: "profile", data: content }).data).toEqual(content);
  });

  test("keeps the legacy profile payload valid without display copy", () => {
    const legacyProfile = { ...profile, displayName: undefined, introduction: undefined, bio: undefined };
    expect(ProfileSchema.parse(legacyProfile)).toEqual(legacyProfile);
  });
});

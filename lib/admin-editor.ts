import type {
  Certification,
  DraftProject,
  Education,
  Experience,
  JsonArray,
  JsonValue,
  Language,
  Leadership,
  NavItem,
  ProjectImage,
  SkillCategory,
  Stat,
} from "@/lib/types";

/** Creates an independent item with the required shape, including for empty collections. */
export function createEditorItem(path: string): JsonValue {
  switch (path.replace(/\[\d+\]/gu, "[]")) {
    case "projects":
      return {
        id: "",
        title: "",
        tagline: "",
        techStack: [],
        year: "",
        githubUrl: "",
        liveUrl: "",
        bullets: [],
      } satisfies DraftProject;
    case "experience":
      return {
        id: "",
        company: "",
        companyUrl: "",
        title: "",
        location: "",
        dateRange: "",
        bullets: [],
      } satisfies Experience;
    case "education":
      return {
        id: "",
        institution: "",
        location: "",
        degree: "",
        dateRange: "",
        coursework: [],
      } satisfies Education;
    case "skills":
      return { category: "", icon: "code", items: [] } satisfies SkillCategory;
    case "leadership":
      return {
        id: "",
        organization: "",
        organizationUrl: "",
        role: "",
        location: "",
        dateRange: "",
        bullets: [],
      } satisfies Leadership;
    case "certifications":
      return { name: "", url: "" } satisfies Certification;
    case "languages":
      return { name: "", proficiency: "" } satisfies Language;
    case "profile.stats":
      return { value: "", label: "" } satisfies Stat;
    case "site.navItems":
      return { id: "", label: "" } satisfies NavItem;
    case "projects[].gallery":
      return {
        type: "image",
        src: "",
        alt: "",
        width: 1,
        height: 1,
      } satisfies ProjectImage;
    default:
      return "";
  }
}

/** Encodes binary files with browser APIs without a Node Buffer or an unbounded spread. */
export function encodeFileBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  }
  return btoa(binary);
}

/** Publishes a draft once while retaining existing editorial and media fields. */
export function mergeProjectDraft(
  projects: JsonArray,
  draft: DraftProject,
): JsonArray {
  let matched = false;
  const updated = projects.map((project) => {
    if (
      project &&
      typeof project === "object" &&
      !Array.isArray(project) &&
      project.id === draft.id
    ) {
      matched = true;
      return { ...project, ...draft };
    }
    return project;
  });
  return matched ? updated : [...updated, { ...draft }];
}

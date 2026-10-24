import { z } from "zod";

const HttpUrlSchema = z.url({ protocol: /^https?$/ });

function isPublicAssetPath(value: string): boolean {
  let path = value;

  // Decode repeatedly so encoded separators cannot conceal traversal from publishing validation.
  while (true) {
    if (!path.startsWith("/") || path.length < 2 || path.includes("//") || /[\\?#\s]/u.test(path)) return false;
    if (path.split("/").some((segment) => segment === "." || segment === "..")) return false;
    if (!path.includes("%")) return true;

    try {
      const decoded = decodeURIComponent(path);
      if (decoded === path) return true;
      path = decoded;
    } catch {
      return false;
    }
  }
}

/** A rooted asset served from public/, without URL schemes, traversal, queries, or fragments. */
export const PublicAssetPathSchema = z.string().refine(isPublicAssetPath, "Must be a rooted public asset path");

const ProjectMediaFields = {
  src: PublicAssetPathSchema,
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
};

/** Image dimensions preserve the layout before deferred media loads. */
export const ProjectImageSchema = z.object({ type: z.literal("image"), ...ProjectMediaFields });
export type ProjectImage = z.infer<typeof ProjectImageSchema>;

/** Native video always has a local poster for the initial, paused presentation. */
export const ProjectVideoSchema = z.object({
  type: z.literal("video"),
  ...ProjectMediaFields,
  poster: PublicAssetPathSchema,
});
export type ProjectVideo = z.infer<typeof ProjectVideoSchema>;

export const ProjectMediaSchema = z.discriminatedUnion("type", [ProjectImageSchema, ProjectVideoSchema]);
export type ProjectMedia = z.infer<typeof ProjectMediaSchema>;

/** Social links configuration */
export const SocialLinksSchema = z.object({
  linkedin: HttpUrlSchema,
  github: HttpUrlSchema,
  portfolio: HttpUrlSchema.or(z.literal("")),
});
export type SocialLinks = z.infer<typeof SocialLinksSchema>;

/** Stat displayed on the hero section */
export const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});
export type Stat = z.infer<typeof StatSchema>;

/** Profile data loaded from profile.json */
export const ProfileSchema = z.object({
  name: z.string(),
  displayName: z.string().optional(),
  introduction: z.string().optional(),
  bio: z.array(z.string()).optional(),
  title: z.string(),
  tagline: z.string(),
  summary: z.string(),
  email: z.email(),
  phone: z.string(),
  location: z.string(),
  socialLinks: SocialLinksSchema,
  avatarUrl: z.string().refine((val) => val.startsWith("/") || val.startsWith("http"), {
    message: "Must be a local path (/) or a URL",
  }),
  resumeUrl: z.string().refine((val) => val.startsWith("/") || val.startsWith("http"), {
    message: "Must be a local path (/) or a URL",
  }),
  stats: z.array(StatSchema),
});
export type Profile = z.infer<typeof ProfileSchema>;

/** Single work experience entry */
export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  companyUrl: HttpUrlSchema.or(z.literal("")),
  title: z.string(),
  location: z.string(),
  dateRange: z.string(),
  bullets: z.array(z.string()),
});
export type Experience = z.infer<typeof ExperienceSchema>;

/** Single education entry */
export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  location: z.string(),
  degree: z.string(),
  dateRange: z.string(),
  coursework: z.array(z.string()),
});
export type Education = z.infer<typeof EducationSchema>;

/** Single project entry */
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  displayTitle: z.string().optional(),
  category: z.string().optional(),
  engineeringIntro: z.string().optional(),
  featured: z.boolean().optional(),
  media: ProjectMediaSchema.optional(),
  gallery: z.array(ProjectImageSchema).optional(),
  tagline: z.string(),
  techStack: z.array(z.string()),
  year: z.string(),
  githubUrl: HttpUrlSchema,
  liveUrl: HttpUrlSchema.or(z.literal("")),
  bullets: z.array(z.string()),
});
export type Project = z.infer<typeof ProjectSchema>;

/** Skill category with icon */
export const SkillCategorySchema = z.object({
  category: z.string(),
  icon: z.string(),
  items: z.array(z.string()),
});
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

/** Certification with link */
export const CertificationSchema = z.object({
  name: z.string(),
  url: HttpUrlSchema,
});
export type Certification = z.infer<typeof CertificationSchema>;

/** Language proficiency */
export const LanguageSchema = z.object({
  name: z.string(),
  proficiency: z.string(),
});
export type Language = z.infer<typeof LanguageSchema>;

/** Single leadership entry */
export const LeadershipSchema = z.object({
  id: z.string(),
  organization: z.string(),
  organizationUrl: HttpUrlSchema,
  role: z.string(),
  location: z.string(),
  dateRange: z.string(),
  bullets: z.array(z.string()),
});
export type Leadership = z.infer<typeof LeadershipSchema>;

/** Navigation item */
export const NavItemSchema = z.object({
  id: z.string(),
  label: z.string(),
});
export type NavItem = z.infer<typeof NavItemSchema>;

/** Site configuration */
export const SiteConfigSchema = z.object({
  sectionOrder: z.array(z.string()),
  featuredProjectIds: z.array(z.string()).default([]),
  theme: z.string(),
  resumeUrl: z.string().refine((val) => val.startsWith("/") || val.startsWith("http"), {
    message: "Must be a local path (/) or a URL",
  }),
  navItems: z.array(NavItemSchema),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

/** Contact form submission */
export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
export type ContactForm = z.infer<typeof ContactFormSchema>;

/** GitHub draft request */
export const GitHubDraftRequestSchema = z.object({
  repoUrl: HttpUrlSchema.refine((value) => new URL(value).hostname === "github.com", "Must be a github.com repository URL"),
});
export type GitHubDraftRequest = z.infer<typeof GitHubDraftRequestSchema>;

/** AI enhance request */
export const AIEnhanceRequestSchema = z.object({
  originalTitle: z.string(),
  projectName: z.string(),
  description: z.string(),
  readmeContent: z.string(),
  techStack: z.array(z.string()),
});
export type AIEnhanceRequest = z.infer<typeof AIEnhanceRequestSchema>;

/** AI enhance response */
export const AIEnhanceResponseSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  techStack: z.array(z.string()),
  bullets: z.array(z.string()),
  enhancedDescription: z.string(),
});
export type AIEnhanceResponse = z.infer<typeof AIEnhanceResponseSchema>;

/** GitHub repo metadata from API */
export const RepoMetadataSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazersCount: z.number(),
  topics: z.array(z.string()),
  homepage: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type RepoMetadata = z.infer<typeof RepoMetadataSchema>;

/** Draft project generated from GitHub URL */
export const DraftProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  techStack: z.array(z.string()),
  year: z.string(),
  githubUrl: HttpUrlSchema,
  liveUrl: HttpUrlSchema.or(z.literal("")),
  bullets: z.array(z.string()),
});
export type DraftProject = z.infer<typeof DraftProjectSchema>;

/** Recursive JSON value type hierarchy — replaces unsafe `unknown` in generic editors */
export type JsonPrimitive = string | number | boolean | null;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = Array<JsonValue>;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/** Sections that the admin panel may read and publish. */
export const AdminSectionSchema = z.enum([
  "profile", "experience", "education", "projects", "skills",
  "leadership", "certifications", "languages", "site",
]);

/** Uses the rendering schemas so invalid content cannot break the next deployment. */
export const AdminSaveRequestSchema = z.discriminatedUnion("section", [
  z.object({ section: z.literal("profile"), data: ProfileSchema }),
  z.object({ section: z.literal("experience"), data: ExperienceSchema.array() }),
  z.object({ section: z.literal("education"), data: EducationSchema.array() }),
  z.object({ section: z.literal("projects"), data: ProjectSchema.array() }),
  z.object({ section: z.literal("skills"), data: SkillCategorySchema.array() }),
  z.object({ section: z.literal("leadership"), data: LeadershipSchema.array() }),
  z.object({ section: z.literal("certifications"), data: CertificationSchema.array() }),
  z.object({ section: z.literal("languages"), data: LanguageSchema.array() }),
  z.object({ section: z.literal("site"), data: SiteConfigSchema }),
]).and(z.object({ sha: z.string().regex(/^[a-f0-9]{40}$/).optional() }));

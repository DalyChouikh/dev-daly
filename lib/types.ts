import { z } from "zod";

/** Social links configuration */
export const SocialLinksSchema = z.object({
  linkedin: z.url(),
  github: z.url(),
  portfolio: z.url(),
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
  companyUrl: z.string().refine((val) => val === "" || val.startsWith("http"), {
    message: "Must be empty or a valid URL",
  }),
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
  tagline: z.string(),
  techStack: z.array(z.string()),
  year: z.string(),
  githubUrl: z.url(),
  liveUrl: z.url().or(z.literal("")),
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
  url: z.url(),
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
  organizationUrl: z.url(),
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
  theme: z.string(),
  resumeUrl: z.string().refine((val) => val.startsWith("/") || val.startsWith("http"), {
    message: "Must be a local path (/) or a URL",
  }),
  navItems: z.array(NavItemSchema),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

/** Section name union type derived from sectionOrder */
export type SectionName =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "leadership"
  | "certifications"
  | "languages"
  | "contact";

/** Contact form submission */
export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
export type ContactForm = z.infer<typeof ContactFormSchema>;

/** GitHub draft request */
export const GitHubDraftRequestSchema = z.object({
  repoUrl: z.url("Invalid GitHub URL"),
});
export type GitHubDraftRequest = z.infer<typeof GitHubDraftRequestSchema>;

/** AI enhance request */
export const AIEnhanceRequestSchema = z.object({
  projectName: z.string(),
  description: z.string(),
  readmeContent: z.string(),
  techStack: z.array(z.string()),
});
export type AIEnhanceRequest = z.infer<typeof AIEnhanceRequestSchema>;

/** AI enhance response */
export const AIEnhanceResponseSchema = z.object({
  tagline: z.string(),
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
  githubUrl: z.url(),
  liveUrl: z.url().or(z.literal("")),
  bullets: z.array(z.string()),
});
export type DraftProject = z.infer<typeof DraftProjectSchema>;
import { cache } from "react";
import profileData from "@/data/profile.json";
import experienceData from "@/data/experience.json";
import educationData from "@/data/education.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import certificationsData from "@/data/certifications.json";
import languagesData from "@/data/languages.json";
import leadershipData from "@/data/leadership.json";
import siteConfigData from "@/data/site.json";
import {
  ProfileSchema,
  type Profile,
  ExperienceSchema,
  type Experience,
  EducationSchema,
  type Education,
  ProjectSchema,
  type Project,
  SkillCategorySchema,
  type SkillCategory,
  CertificationSchema,
  type Certification,
  LanguageSchema,
  type Language,
  LeadershipSchema,
  type Leadership,
  SiteConfigSchema,
  type SiteConfig,
} from "./types";

/**
 * Validates and returns profile data.
 * Results are deduplicated per request via React cache().
 */
export const getProfile = cache((): Profile => {
  return ProfileSchema.parse(profileData);
});

/** Validates and returns experience entries. */
export const getExperience = cache((): Experience[] => {
  return ExperienceSchema.array().parse(experienceData);
});

/** Validates and returns education entries. */
export const getEducation = cache((): Education[] => {
  return EducationSchema.array().parse(educationData);
});

/** Validates and returns project entries. */
export const getProjects = cache((): Project[] => {
  return ProjectSchema.array().parse(projectsData);
});

/** Validates and returns skill categories. */
export const getSkills = cache((): SkillCategory[] => {
  return SkillCategorySchema.array().parse(skillsData);
});

/** Validates and returns certifications. */
export const getCertifications = cache((): Certification[] => {
  return CertificationSchema.array().parse(certificationsData);
});

/** Validates and returns languages. */
export const getLanguages = cache((): Language[] => {
  return LanguageSchema.array().parse(languagesData);
});

/** Validates and returns leadership entries. */
export const getLeadership = cache((): Leadership[] => {
  return LeadershipSchema.array().parse(leadershipData);
});

/** Validates and returns site configuration. */
export const getSiteConfig = cache((): SiteConfig => {
  return SiteConfigSchema.parse(siteConfigData);
});
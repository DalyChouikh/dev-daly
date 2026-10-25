import type { z } from "zod";
import type { AdminSectionSchema } from "@/lib/types";

export type AdminSectionId = z.infer<typeof AdminSectionSchema>;

/** Shared labels keep the content inventory and administration navigation aligned. */
export const ADMIN_SECTIONS: readonly {
  id: AdminSectionId;
  label: string;
  description: string;
  collection: boolean;
}[] = [
  {
    id: "profile",
    label: "Profile",
    description: "Introduction, biography, and contact details",
    collection: false,
  },
  {
    id: "projects",
    label: "Projects",
    description: "Selected work, project details, and media",
    collection: true,
  },
  {
    id: "experience",
    label: "Experience",
    description: "Companies, roles, and engineering contributions",
    collection: true,
  },
  {
    id: "education",
    label: "Education",
    description: "Degrees, institutions, and coursework",
    collection: true,
  },
  {
    id: "skills",
    label: "Skills",
    description: "Languages, systems, and tools",
    collection: true,
  },
  {
    id: "leadership",
    label: "Leadership",
    description: "Community work and campus responsibilities",
    collection: true,
  },
  {
    id: "certifications",
    label: "Certifications",
    description: "Qualifications and certificate links",
    collection: true,
  },
  {
    id: "languages",
    label: "Languages",
    description: "Spoken languages and proficiency",
    collection: true,
  },
  {
    id: "site",
    label: "Site Config",
    description: "Navigation, featured projects, and résumé link",
    collection: false,
  },
];

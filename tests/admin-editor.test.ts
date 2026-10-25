import { describe, expect, test } from "bun:test";
import {
  createEditorItem,
  encodeFileBase64,
  mergeProjectDraft,
} from "@/lib/admin-editor";
import { ProjectSchema } from "@/lib/types";
import type { DraftProject, JsonObject } from "@/lib/types";

const draft: DraftProject = {
  id: "new-project",
  title: "New project",
  tagline: "A useful project",
  techStack: ["TypeScript"],
  year: "2026",
  githubUrl: "https://github.com/example/project",
  liveUrl: "",
  bullets: ["Built a useful project."],
};

describe("editor collection templates", () => {
  test("creates a project in an empty collection without copying optional media", () => {
    const item = createEditorItem("projects") as JsonObject;
    expect(item).toEqual({
      id: "",
      title: "",
      tagline: "",
      techStack: [],
      year: "",
      githubUrl: "",
      liveUrl: "",
      bullets: [],
    });
    expect(
      ProjectSchema.safeParse({ ...item, githubUrl: draft.githubUrl }).success,
    ).toBe(true);
  });

  test("creates structured entries for every object collection", () => {
    expect(createEditorItem("experience")).toHaveProperty("company", "");
    expect(createEditorItem("education")).toHaveProperty("institution", "");
    expect(createEditorItem("skills")).toEqual({
      category: "",
      icon: "code",
      items: [],
    });
    expect(createEditorItem("leadership")).toHaveProperty("organization", "");
    expect(createEditorItem("certifications")).toEqual({ name: "", url: "" });
    expect(createEditorItem("languages")).toEqual({
      name: "",
      proficiency: "",
    });
    expect(createEditorItem("profile.stats")).toEqual({ value: "", label: "" });
    expect(createEditorItem("site.navItems")).toEqual({ id: "", label: "" });
    expect(createEditorItem("projects[11].gallery")).toEqual({
      type: "image",
      src: "",
      alt: "",
      width: 1,
      height: 1,
    });
  });

  test("keeps string collections editable and returns independent templates", () => {
    expect(createEditorItem("projects[0].bullets")).toBe("");
    expect(createEditorItem("site.featuredProjectIds")).toBe("");
    const first = createEditorItem("projects") as JsonObject;
    first.title = "Changed";
    expect(createEditorItem("projects")).toHaveProperty("title", "");
  });
});

describe("browser file encoding", () => {
  test("encodes a PDF payload with browser byte APIs", () => {
    const bytes = new TextEncoder().encode("%PDF-1.7\n");
    expect(encodeFileBase64(bytes.buffer)).toBe("JVBERi0xLjcK");
  });

  test("preserves every byte in a large binary payload", () => {
    const bytes = Uint8Array.from(
      { length: 131075 },
      (_, index) => index % 256,
    );
    const decoded = Uint8Array.from(
      atob(encodeFileBase64(bytes.buffer)),
      (character) => character.charCodeAt(0),
    );
    expect(decoded).toEqual(bytes);
  });
});

describe("draft publishing", () => {
  test("adds a new draft while retaining existing project fields", () => {
    const project = {
      ...draft,
      id: "existing",
      featured: true,
      media: {
        type: "image",
        src: "/images/project.png",
        alt: "Project",
        width: 100,
        height: 100,
      },
    };
    expect(mergeProjectDraft([project], draft)).toEqual([project, draft]);
  });

  test("updates an existing draft without duplicating it or dropping editorial fields", () => {
    const project = {
      ...draft,
      title: "Previous title",
      displayTitle: "Portfolio title",
      featured: true,
      media: {
        type: "image",
        src: "/images/project.png",
        alt: "Project",
        width: 100,
        height: 100,
      },
    };
    expect(mergeProjectDraft([project], draft)).toEqual([
      { ...project, ...draft },
    ]);
  });
});

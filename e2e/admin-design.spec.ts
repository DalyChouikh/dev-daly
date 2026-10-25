import { expect, test, type Page } from "@playwright/test";
import { z } from "zod";
import { ProjectSchema, type Project } from "../lib/types";
import profile from "../data/profile.json";
import experience from "../data/experience.json";
import education from "../data/education.json";
import projects from "../data/projects.json";
import skills from "../data/skills.json";
import leadership from "../data/leadership.json";
import certifications from "../data/certifications.json";
import languages from "../data/languages.json";
import site from "../data/site.json";

const fixtures = z.record(z.string(), z.json()).parse({
  profile,
  experience,
  education,
  projects,
  skills,
  leadership,
  certifications,
  languages,
  site,
});
const password = "portfolio-browser-test-password";
const sha = "a".repeat(40);

test("dashboard distinguishes unavailable counts from a real zero and retries", async ({
  page,
}) => {
  await prepareAdmin(page);
  let reads = 0;
  await page.route("**/api/admin/data/projects", (route) => {
    reads += 1;
    return route.fulfill(
      reads === 1
        ? { status: 503, json: { success: false } }
        : { json: { success: true, data: [], sha } },
    );
  });
  await page.goto("/admin");
  const projectRow = page.locator('[data-admin-section="projects"]');
  await expect(projectRow).toContainText("Count unavailable");
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(projectRow).toContainText("0 entries");
});

test("the sample notification fits a phone with readable text when images are blocked", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/preview/contact-email.html");
  await expect(
    page.getByRole("heading", { name: "New contact message" }),
  ).toBeVisible();
  await expect(
    page.getByText("Sample notification", { exact: false }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .getByRole("img", { name: "Daly", exact: true })
        .evaluate((node: HTMLImageElement) => node.naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await page.screenshot({
    path: testInfo.outputPath("email-320.png"),
    fullPage: true,
  });
  await page.route("**/brand/png/**", (route) => route.abort());
  await page.reload();
  await expect(
    page.getByText("Daly Chouikh", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Reply to message" }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
});

async function prepareAdmin(page: Page) {
  await page.route("**/api/admin/data/*", (route) => {
    const section =
      new URL(route.request().url()).pathname.split("/").at(-1) ?? "";
    return route.fulfill({
      json: { success: true, data: fixtures[section], sha },
    });
  });
  const response = await page.request.post("/api/admin/auth", {
    data: { password },
  });
  expect(response.ok()).toBe(true);
}

test("login has the Olive identity without authenticated navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/admin/login");
  await page.screenshot({
    path: testInfo.outputPath("login.png"),
    fullPage: true,
  });
  await expect(
    page.getByRole("navigation", { name: "Admin navigation" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Logout", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".admin-shell")).toHaveCSS(
    "background-color",
    "rgb(236, 235, 231)",
  );
  await expect(
    page.getByRole("img", { name: "Daly", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("incorrect-password");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeEnabled();
});

test("dashboard counts current content and links to its real resume section", async ({
  page,
}, testInfo) => {
  await prepareAdmin(page);
  const currentProjects = [
    ...projects,
    {
      ...projects[0],
      id: "newly-published-project",
      title: "Newly published project",
    },
  ];
  await page.route("**/api/admin/data/projects", (route) =>
    route.fulfill({ json: { success: true, data: currentProjects, sha } }),
  );
  await page.goto("/admin");
  await page.screenshot({
    path: testInfo.outputPath("dashboard.png"),
    fullPage: true,
  });
  const projectRow = page.locator('[data-admin-section="projects"]');
  await expect(projectRow).toContainText(`${currentProjects.length} entries`);
  await expect(page.locator('[data-admin-section="experience"]')).toContainText(
    `${experience.length} entries`,
  );
  await expect(page.locator("#resume")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Upload résumé", exact: true }),
  ).toHaveAttribute("href", "#resume");
});

for (const width of [1440, 768, 390]) {
  test(`admin screens fit ${width}px and phone navigation closes`, async ({
    page,
  }, testInfo) => {
    await prepareAdmin(page);
    await page.setViewportSize({ width, height: 960 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of [
      "/admin/login",
      "/admin",
      "/admin/projects",
      "/admin/projects/draft",
    ]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      await page.screenshot({
        path: testInfo.outputPath(`${path.split("/").at(-1)}-${width}.png`),
      });
    }
    if (width < 1100) {
      await page.getByRole("button", { name: "Open admin navigation" }).click();
      await expect(
        page.getByRole("navigation", { name: "Admin navigation" }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Open admin navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
      await page.getByRole("button", { name: "Open admin navigation" }).click();
      await page
        .getByRole("navigation", { name: "Admin navigation" })
        .getByRole("link", { name: "Education", exact: true })
        .click();
      await expect(page).toHaveURL(/\/admin\/education$/);
      await expect(
        page.getByRole("button", { name: "Open admin navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
    }
    expect(errors).toEqual([]);
  });
}

test("resume upload encodes the selected PDF and preserves pending controls", async ({
  page,
}) => {
  await prepareAdmin(page);
  const gate = Promise.withResolvers<void>();
  let uploaded = "";
  await page.route("**/api/admin/upload-resume", async (route) => {
    const body = route.request().postDataJSON() as {
      fileBase64: string;
      fileName: string;
    };
    uploaded = body.fileBase64;
    expect(body.fileName).toBe("candidate.pdf");
    await gate.promise;
    await route.fulfill({ json: { success: true } });
  });
  await page.goto("/admin#resume");
  const pdf = Buffer.from("%PDF-1.7\nPortfolio résumé browser test\n%%EOF");
  await page.locator('input[type="file"]').setInputFiles({
    name: "candidate.pdf",
    mimeType: "application/pdf",
    buffer: pdf,
  });
  await expect(page.getByText("candidate.pdf", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Upload Resume", exact: true })
    .click();
  try {
    await expect(
      page.getByRole("button", { name: /Uploading/ }),
    ).toBeDisabled();
  } finally {
    gate.resolve();
  }
  await expect(page.locator("#resume").getByRole("status")).toContainText(
    /uploaded/i,
  );
  expect(Buffer.from(uploaded, "base64")).toEqual(pdf);
});

test("editor retains local changes on conflict and permits retry after a network failure", async ({
  page,
}) => {
  await prepareAdmin(page);
  let saves = 0;
  await page.route("**/api/admin/save", (route) => {
    saves += 1;
    if (saves === 1)
      return route.fulfill({
        status: 409,
        json: {
          success: false,
          error: "Another edit changed the latest revision.",
        },
      });
    if (saves === 2)
      return route.fulfill({
        status: 500,
        json: { success: false, error: "Temporary save failure" },
      });
    return route.fulfill({ json: { success: true, sha: "b".repeat(40) } });
  });
  await page.goto("/admin/projects");
  const input = page.getByRole("textbox").first();
  await input.fill("local-edit-kept");
  const save = page.getByRole("button", { name: "Save Changes", exact: true });
  await save.click();
  await expect(page.locator(".admin-page").getByRole("alert")).toContainText(
    "Your edits are kept",
  );
  await expect(input).toHaveValue("local-edit-kept");
  await page.getByRole("button", { name: "Show JSON", exact: true }).click();
  await expect(page.locator("#editor-json")).toContainText("local-edit-kept");
  await save.click();
  await expect(page.locator(".admin-page").getByRole("alert")).toContainText(
    "Temporary save failure",
  );
  await expect(input).toHaveValue("local-edit-kept");
  await save.click();
  await expect(page.locator(".admin-page").getByRole("status")).toContainText(
    "Changes saved successfully",
  );
});

test("empty project collections add an editable object and remove it locally", async ({
  page,
}) => {
  await prepareAdmin(page);
  await page.route("**/api/admin/data/projects", (route) =>
    route.fulfill({ json: { success: true, data: [], sha } }),
  );
  await page.goto("/admin/projects");
  await expect(
    page.getByText("No entries yet. Add an item to get started."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add Item", exact: true }).click();
  await expect(page.getByLabel("Title", { exact: true })).toBeVisible();
  await page
    .getByLabel("Title", { exact: true })
    .fill("A new portfolio project");
  await expect(
    page.getByRole("button", { name: "Save Changes", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", {
      name: "Remove A new portfolio project",
      exact: true,
    })
    .click();
  await expect(
    page.getByText("No entries yet. Add an item to get started."),
  ).toBeVisible();
});

test("draft enhancement and repeated saves preserve project media and file revisions", async ({
  page,
}, testInfo) => {
  await prepareAdmin(page);
  let latest = ProjectSchema.array().parse(projects);
  let revision = sha;
  const original =
    latest.find((project) => project.media?.type === "image") ?? latest[0];
  const { id, title, tagline, techStack, year, githubUrl, liveUrl, bullets } =
    original;
  const draft = {
    id,
    title,
    tagline,
    techStack,
    year,
    githubUrl,
    liveUrl,
    bullets,
  };
  const gate = Promise.withResolvers<void>();
  const revisions: string[] = [];
  const published: Project[][] = [];
  await page.route("**/api/admin/data/projects", (route) =>
    route.fulfill({ json: { success: true, data: latest, sha: revision } }),
  );
  await page.route("**/api/github-draft", (route) =>
    route.fulfill({
      json: { success: true, draft, readmeContent: "Verified project README" },
    }),
  );
  await page.route("**/api/ai-enhance", async (route) => {
    await gate.promise;
    return route.fulfill({
      json: {
        success: true,
        result: {
          title: "Within — preview edit",
          tagline,
          techStack,
          bullets: ["Additional reviewed contribution."],
          enhancedDescription: "Reviewed engineering summary.",
        },
      },
    });
  });
  await page.route("**/api/admin/save", (route) => {
    const body = z
      .object({ sha: z.string(), data: ProjectSchema.array() })
      .parse(route.request().postDataJSON());
    revisions.push(body.sha);
    latest = body.data;
    published.push(body.data);
    revision = String.fromCharCode(97 + published.length).repeat(40);
    return route.fulfill({ json: { success: true, sha: revision } });
  });
  await page.goto("/admin/projects/draft");
  await page
    .getByLabel("GitHub repository URL", { exact: true })
    .fill(githubUrl);
  await page.getByRole("button", { name: "Fetch Repo", exact: true }).click();
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(title);
  await page
    .getByRole("button", { name: "Enhance with AI", exact: true })
    .click();
  try {
    await expect(page.getByLabel("Title", { exact: true })).toBeDisabled();
  } finally {
    gate.resolve();
  }
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    "Within — preview edit",
  );
  await page.screenshot({
    path: testInfo.outputPath("draft-populated.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Save to Projects", exact: true })
    .click();
  await expect(page.locator(".admin-page").getByRole("status")).toContainText(
    /saved/i,
  );
  await page.getByLabel("Title", { exact: true }).fill("Within — second edit");
  await page
    .getByRole("button", { name: "Save to Projects", exact: true })
    .click();
  await expect.poll(() => published.length).toBe(2);
  expect(revisions).toEqual([sha, "b".repeat(40)]);
  for (const collection of published) {
    expect(collection).toHaveLength(projects.length);
    expect(collection.find((project) => project.id === id)?.media).toEqual(
      original.media,
    );
    expect(collection.find((project) => project.id === id)?.featured).toBe(
      original.featured,
    );
  }
});

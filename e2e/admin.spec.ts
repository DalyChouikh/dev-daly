import { expect, test } from "@playwright/test";
import projects from "../data/projects.json";
import skills from "../data/skills.json";

const password = "portfolio-browser-test-password";
const initialSha = "a".repeat(40);
const savedSha = "b".repeat(40);

test("homepage renders TapNShow and loads the bundled fonts", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const fontRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.resourceType() === "font") fontRequests.push(request.url());
  });
  await page.goto("/");
  const project = page.getByRole("heading", { name: "TapNShow", exact: true });
  await project.scrollIntoViewIfNeeded();
  await expect(project).toBeVisible();
  await expect(project.locator("xpath=ancestor::div[@style][1]")).toHaveCSS("opacity", "1", { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  expect(fontRequests.length).toBe(3);
  expect(fontRequests.every((url) => url.startsWith("http://127.0.0.1:3100/_next/static/"))).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("projects-desktop.png") });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.getByRole("heading", { level: 1 }).locator("..")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("link", { name: "Contact Me", exact: true }).locator("xpath=ancestor::div[@style][1]")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: testInfo.outputPath("homepage-desktop.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("homepage-mobile.png") });
});

test("actual Node handlers preserve authenticated POST bodies and reject invalid data", async ({ request }) => {
  for (const path of ["/api/admin/save", "/api/admin/upload-resume", "/api/github-draft", "/api/ai-enhance"]) {
    expect((await request.post(path, { data: {} })).status()).toBe(401);
  }
  const response = await request.post("/api/admin/auth", { data: { password } });
  expect(response.status()).toBe(200);
  const cookie = response.headers()["set-cookie"].split(";")[0];
  for (const path of ["/api/admin/save", "/api/admin/upload-resume", "/api/github-draft", "/api/ai-enhance"]) {
    expect((await request.post(path, { data: {}, headers: { Cookie: cookie } })).status()).toBe(400);
  }
  expect((await request.post("/api/admin/save", {
    data: { section: "projects", data: projects }, headers: { Cookie: cookie },
  })).status()).toBe(409);
});

test("editor carries revisions through repeated saves and reloads on section navigation", async ({ page }) => {
  await page.route("**/api/admin/data/projects", (route) => route.fulfill({ json: { success: true, data: projects, sha: initialSha } }));
  await page.route("**/api/admin/data/skills", (route) => route.fulfill({ json: { success: true, data: skills, sha: initialSha } }));
  const revisions: string[] = [];
  const firstSave = Promise.withResolvers<void>();
  await page.route("**/api/admin/save", async (route) => {
    const payload = route.request().postDataJSON() as { sha: string };
    revisions.push(payload.sha);
    if (revisions.length === 1) await firstSave.promise;
    return route.fulfill({ json: { success: true, sha: savedSha } });
  });
  await page.goto("/admin/projects");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByRole("heading", { name: "projects Editor", exact: true })).toBeVisible();
  const title = page.getByRole("textbox").first();
  await title.fill("First edit");
  await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  try {
    await expect(title).toBeDisabled();
  } finally {
    firstSave.resolve();
  }
  await expect(page.getByRole("button", { name: "Save Changes", exact: true })).toBeDisabled();
  await expect(title).toBeEnabled();
  await title.fill("Second edit");
  await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  await expect(page.getByRole("button", { name: "Save Changes", exact: true })).toBeDisabled();
  expect(revisions).toEqual([initialSha, savedSha]);
  await page.getByRole("link", { name: "Skills", exact: true }).click();
  await expect(page.getByRole("heading", { name: "skills Editor", exact: true })).toBeVisible();
  await expect(page.getByRole("textbox").first()).toHaveValue(skills[0].category);
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/admin/projects");
  await expect(page).toHaveURL(/\/admin\/login/);
});

for (const destination of ["https://example.com", "//example.com", "javascript:document.documentElement.dataset.injected='yes'"]) {
  test(`login ignores unsafe return destination ${destination}`, async ({ page }) => {
    await page.route("https://example.com/**", (route) => route.fulfill({ body: "external destination" }));
    await page.goto(`/admin/login?from=${encodeURIComponent(destination)}`);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page).toHaveURL("/admin");
    expect(await page.evaluate(() => document.documentElement.dataset.injected)).toBeUndefined();
  });
}

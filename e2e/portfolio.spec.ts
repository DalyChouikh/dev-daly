import { expect, test } from "@playwright/test";

test("approved portfolio contains the complete career and project content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Daly\s*Chouikh/);
  for (const id of ["work", "experience", "skills", "education", "projects", "about", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator("[data-project]")).toHaveCount(12);
  await expect(page.locator("[data-experience]")).toHaveCount(4);
  await expect(page.locator("[data-education]")).toHaveCount(2);
  await expect(page.locator(".skill-group")).toHaveCount(7);
  for (const heading of await page.locator(".career-company h3").all()) {
    await expect(heading).toHaveCSS("font-weight", "800");
  }
  await page.locator(".archive-item summary").first().click();
  await expect(page.locator(".archive-content").first()).toBeVisible();
  const qrProject = page.locator('.archive-item').filter({ has: page.getByText("QR Code Generator", { exact: true }) });
  await qrProject.locator("summary").click();
  await expect(qrProject.locator(".archive-content")).toContainText("Lip Gloss");
  await expect(page.locator(".career-body ul").first()).toHaveCSS("list-style-type", "disc");
  await expect(page.getByRole("img", { name: "Daly Chouikh", exact: true })).toHaveCount(2);
});

for (const width of [1440, 768, 390]) {
  test(`approved layout fits ${width}px without horizontal overflow`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`home-${width}.png`) });
    for (const id of ["work", "experience", "education", "contact"]) {
      await page.locator(`#${id}`).screenshot({ path: testInfo.outputPath(`${id}-${width}.png`), animations: "disabled" });
    }
    expect(errors).toEqual([]);
  });
}

test("phone navigation opens, jumps to a section, and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".mobile-menu summary").click();
  const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: "Education", exact: true }).click();
  await expect(page.locator(".mobile-menu")).not.toHaveAttribute("open");
  await expect(page).toHaveURL(/#education$/);
  await page.locator(".mobile-menu summary").click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-menu")).not.toHaveAttribute("open");
});

test("contact submits once, disables pending fields, and reports confirmed delivery", async ({ page }) => {
  const gate = Promise.withResolvers<void>();
  let requests = 0;
  await page.route("**/api/contact", async (route) => {
    requests += 1;
    expect(route.request().postDataJSON()).toEqual({ name: "Portfolio reviewer", email: "review@example.com", message: "An engineering opportunity to discuss." });
    await gate.promise;
    await route.fulfill({ json: { success: true, id: "test-message" } });
  });
  await page.goto("/#contact");
  await page.getByLabel("Your name", { exact: true }).fill("Portfolio reviewer");
  await page.getByLabel("Email address", { exact: true }).fill("review@example.com");
  await page.getByLabel("What do you have in mind?", { exact: true }).fill("An engineering opportunity to discuss.");
  await page.getByRole("button", { name: "Send message" }).click();
  try {
    await expect(page.getByRole("button", { name: "Sending" })).toBeDisabled();
    await expect(page.getByLabel("Your name", { exact: true })).toBeDisabled();
  } finally { gate.resolve(); }
  await expect(page.getByRole("status")).toContainText("sent");
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
  expect(requests).toBe(1);
});

test("contact retains the message after a server error and supports retry", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/contact", (route) => {
    requests += 1;
    return route.fulfill(requests === 1 ? { status: 500, json: { success: false } } : { json: { success: true } });
  });
  await page.goto("/#contact");
  await page.getByLabel("Your name", { exact: true }).fill("Portfolio reviewer");
  await page.getByLabel("Email address", { exact: true }).fill("review@example.com");
  await page.getByLabel("What do you have in mind?", { exact: true }).fill("Keep this message so I can retry.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#contact").getByRole("alert")).toContainText("try again");
  await expect(page.getByLabel("What do you have in mind?", { exact: true })).toHaveValue("Keep this message so I can retry.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("sent");
  expect(requests).toBe(2);
});

test("the original project film waits for playback and supports seeking", async ({ page }) => {
  await page.goto("/#work");
  const video = page.locator("video");
  await expect(video).toHaveAttribute("preload", "metadata");
  await expect(video).toHaveAttribute("controls");
  expect(await video.evaluate((node: HTMLVideoElement) => node.paused && !node.autoplay)).toBe(true);
  await video.evaluate(async (node: HTMLVideoElement) => { node.muted = true; await node.play(); });
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(0);
  await video.evaluate((node: HTMLVideoElement) => { node.pause(); node.currentTime = 21.6; });
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeCloseTo(21.6, 1);
  expect(await video.evaluate((node: HTMLVideoElement) => node.error)).toBeNull();
});

test("server content remains readable without JavaScript or motion", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-project]")).toHaveCount(12);
    await page.locator(".archive-item summary").first().click();
    await expect(page.locator(".archive-content").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  } finally { await context.close(); }
});
